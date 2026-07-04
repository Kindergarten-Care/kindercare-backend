# KẾ HOẠCH TRIỂN KHAI — HỆ THỐNG HỌC PHÍ & HÓA ĐƠN

> Tài liệu tham chiếu để implement module billing. Dùng để tự build theo từng phase.

---

## 0. QUYẾT ĐỊNH NGHIỆP VỤ ĐÃ CHỐT

| # | Vấn đề | Phương án chốt |
|---|---|---|
| 1 | Tiền ăn tính khi nào | **Thu trước + hoàn sau**: đầu tháng thu ước tính theo ngày công dự kiến; ngày nghỉ có phép (`isMealFeeDeducted=1`) → cộng dồn `RefundAmount` vào phiếu tháng KẾ TIẾP |
| 2 | Giá học phí khi gói dài bắc qua năm học | **Snapshot khi đăng ký**: lưu `MonthlyTuition` vào plan, giá cố định suốt gói |
| 3 | Ngày công tính tiền ăn | **Bảng Holidays**: ngày công = số ngày T2–T6 trong tháng − số ngày lễ rơi vào T2–T6 |
| 4 | Đăng ký ngoại khóa giữa tháng | **Tính full tháng** (không prorate) — `RegisteredMonth` đã ở mức tháng |

---

## 1. KIẾN TRÚC — 2 LUỒNG HÓA ĐƠN

```
┌─ HÓA ĐƠN HỌC PHÍ (InvoiceType = 'TUITION') ──────────────────┐
│  • Xuất khi TỚI KỲ theo gói: Tháng/Quý/Nửa năm/Năm            │
│  • Chỉ chứa: TuitionFee + DiscountAmount                       │
│  • PeriodRange = khoảng thời gian gói bao phủ                  │
│  • Chiết khấu (5%/10%) CHỈ áp ở luồng này                      │
└───────────────────────────────────────────────────────────────┘

┌─ PHIẾU THU HÀNG THÁNG (InvoiceType = 'MONTHLY') ─────────────┐
│  • Xuất MỖI THÁNG cho mọi học sinh Active                     │
│  • Chứa: ExpectedMealFee + ExtracurricularFee + Surcharge     │
│           − RefundAmount (hoàn tiền ăn tháng trước)           │
│  • TuitionFee = 0 (học phí không nằm ở đây)                   │
│  • Không phát sinh → TotalAmount = 0                          │
└───────────────────────────────────────────────────────────────┘
```

**Ví dụ gói QUÝ, bắt đầu 8/2026:**

| Tháng | Phiếu HỌC PHÍ | Phiếu HÀNG THÁNG |
|---|---|---|
| 8/2026 | ✅ 13,500,000 (T8–T10) | Tiền ăn T8 + ngoại khóa T8 |
| 9/2026 | — | Tiền ăn T9 + ngoại khóa T9 − hoàn T8 |
| 10/2026 | — | Tiền ăn T10 + ngoại khóa T10 − hoàn T9 |
| 11/2026 | ✅ 13,500,000 (T11–T1) | Tiền ăn T11 + ngoại khóa T11 − hoàn T10 |

---

## 2. THAY ĐỔI SCHEMA (Migration)

### 2.1 Bảng mới — `StudentTuitionPlans`
Lưu gói học sinh đã đăng ký + mốc neo chu kỳ + giá đã khóa.

```sql
CREATE TABLE `StudentTuitionPlans` (
  `PlanID`                 int          NOT NULL AUTO_INCREMENT,
  `StudentID`              int          NOT NULL,
  `PackageID`              int          NOT NULL,
  `StartMonth`             varchar(10)  NOT NULL,               -- 'YYYY-MM' mốc neo chu kỳ (= tháng nhập học)
  `MonthlyTuitionSnapshot` decimal(15,2) NOT NULL,             -- KHÓA GIÁ học phí lúc đăng ký
  `Status`                 varchar(20)  DEFAULT 'Active',       -- Active | Paused | Ended
  `CreatedAt`              bigint       DEFAULT (unix_timestamp()),
  PRIMARY KEY (`PlanID`),
  KEY `idx_student` (`StudentID`),
  KEY `idx_package` (`PackageID`),
  CONSTRAINT `STP_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  CONSTRAINT `STP_ibfk_2` FOREIGN KEY (`PackageID`) REFERENCES `PaymentPackages` (`PackageID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### 2.2 Bảng mới — `Holidays`
Ngày nghỉ lễ để loại khỏi ngày công tính tiền ăn.

```sql
CREATE TABLE `Holidays` (
  `HolidayID`   int         NOT NULL AUTO_INCREMENT,
  `HolidayDate` bigint      NOT NULL,          -- unix timestamp, mốc 00:00 UTC ngày lễ
  `HolidayName` varchar(100) DEFAULT NULL,
  `YearID`      int         DEFAULT NULL,       -- optional: gắn năm học
  PRIMARY KEY (`HolidayID`),
  KEY `idx_date` (`HolidayDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### 2.3 Sửa bảng `Invoices`
```sql
-- Phân biệt loại hóa đơn
ALTER TABLE `Invoices`
  ADD COLUMN `InvoiceType` varchar(20) DEFAULT 'MONTHLY';   -- 'TUITION' | 'MONTHLY'

-- Chống trùng khi cron chạy lại nhiều lần (idempotent)
ALTER TABLE `Invoices`
  ADD UNIQUE KEY `uq_invoice` (`StudentID`, `BillingMonth`, `InvoiceType`);
```

> **Lưu ý:** với TUITION thì `BillingMonth` = tháng bắt đầu chu kỳ (vd '2026-08'); với MONTHLY thì `BillingMonth` = tháng của phiếu.

### 2.4 (Để sau — không bắt buộc đợt này)
```sql
ALTER TABLE `Invoices` ADD COLUMN `DueDate` bigint DEFAULT NULL;   -- hạn đóng / Overdue
```

---

## 3. THUẬT TOÁN LÕI

### 3.1 Tính `monthIndex` và xác định "tới kỳ học phí"
```
monthIndex(start 'YYYY-MM', current 'YYYY-MM'):
   = (curYear − startYear) * 12 + (curMonth − startMonth)

isTuitionDue(plan, billingMonth):
   D = package.DurationInMonths
   idx = monthIndex(plan.StartMonth, billingMonth)
   return idx >= 0 && idx % D === 0
```

### 3.2 Tính tiền học phí một kỳ
```
tuitionForCycle(plan, package):
   gross    = package.DurationInMonths * plan.MonthlyTuitionSnapshot
   discount = gross * package.DiscountPercentage / 100
   net      = gross − discount
   periodRange = [billingMonth, addMonths(billingMonth, D − 1)]   // 'YYYY-MM → YYYY-MM'
   return { TuitionFee: gross, DiscountAmount: discount, TotalNet: net, PeriodRange }
```
> `TotalAmount` (generated column) tự = TuitionFee − DiscountAmount vì các cột khác = 0.

### 3.3 Tính ngày công & tiền ăn dự kiến (thu trước)
```
workingDays(billingMonth):
   days = tất cả ngày trong tháng
   weekdays = days.filter(d => d.dayOfWeek in [Mon..Fri])
   holidays = SELECT HolidayDate FROM Holidays
              WHERE HolidayDate trong billingMonth AND rơi vào Mon..Fri
   return weekdays.length − holidays.length

expectedMealFee(billingMonth):
   return workingDays(billingMonth) * BaseFees.DailyMealFee   // DailyMealFee lấy live theo năm học hiện tại
```

### 3.4 Tính tiền hoàn tháng trước (thu trước + hoàn sau)
```
refundForPrevMonth(studentId, prevMonth):
   // ngày nghỉ CÓ PHÉP + được miễn tiền ăn trong tháng trước
   deductedDays = tổng số ngày thuộc leave requests đã duyệt (status='Approved')
                  của prevMonth có isMealFeeDeducted = 1
   return deductedDays * BaseFees.DailyMealFee
```
> Khoản này được cộng vào `RefundAmount` của phiếu MONTHLY tháng hiện tại.

### 3.5 Tính tiền ngoại khóa
```
extracurricularFee(studentId, billingMonth):
   return SUM(e.MonthlyFee)
     FROM StudentExtracurriculars se
     JOIN Extracurriculars e ON se.ActivityID = e.ActivityID
     WHERE se.StudentID = studentId
       AND se.RegisteredMonth = billingMonth
       AND se.Status = 'Active'
```

---

## 4. CẤU TRÚC CODE

```
src/modules/billing/         ← MODULE MỚI (do HIỆU TRƯỞNG xử lý; admin thêm sau)
├── billing.service.js       ← toàn bộ logic tính toán + tạo hóa đơn (role-agnostic, cron cũng gọi)
├── billing.controller.js    ← handler (đăng ký gói, chạy cron, thêm phụ thu)
├── billing.route.js         ← route hiệu trưởng, dùng authorize(2)   // admin: sau này nới thành authorize(1,2)
└── billing.docs.js          ← swagger

src/modules/parent/          (bổ sung — parent xem & thanh toán)
├── parent.service.js        + getInvoicesByStudentId, getInvoiceDetail, createPayment
├── parent.controller.js     + getChildInvoices, getInvoiceDetail, payInvoice
├── parent.route.js          + 3 route (authorize(4))
└── parent.docs.js           + docs nhóm "Parent - Billing"

src/jobs/                     ← THƯ MỤC MỚI (chưa tồn tại)
└── monthlyBilling.cron.js   ← cron đầu mỗi tháng → billing.service.runMonthlyBilling()

src/utils/
└── dateHelpers.js           + monthIndex, addMonths, monthRange, getMonthKey, listWeekdays

src/routes/index.js          (bổ sung) + mount { path: '/billing', route: billingRoute }
```

> ⚠️ **`node-cron` CHƯA được cài** trong `package.json`. Chọn 1 trong 2:
> - **Cách 1**: `npm i node-cron` → tạo `src/jobs/monthlyBilling.cron.js`, khởi động trong `src/app.js`.
> - **Cách 2 (không thêm dep)**: bỏ file cron, để scheduler ngoài (crontab hệ điều hành / cloud scheduler) gọi `POST /billing/run-monthly` ngày 1 hàng tháng.

### 4.1 `billing.service.js` — function signatures
```js
// Đăng ký gói cho học sinh (Flow 1)
export const registerTuitionPlan = async (studentId, packageId, startMonth) => {...}
//   → snapshot MonthlyTuition từ BaseFees theo năm học của lớp bé
//   → INSERT StudentTuitionPlans
//   → gọi generateTuitionInvoice(plan, startMonth)  // kỳ đầu
//   → gọi generateMonthlyInvoice(studentId, startMonth)

// Tạo 1 hóa đơn HỌC PHÍ cho 1 kỳ
export const generateTuitionInvoice = async (plan, billingMonth) => {...}
//   → tính tuitionForCycle → INSERT Invoices (InvoiceType='TUITION')
//   → bọc try/catch nuốt lỗi UNIQUE (đã tồn tại thì bỏ qua)

// Tạo 1 phiếu thu HÀNG THÁNG cho 1 học sinh
export const generateMonthlyInvoice = async (studentId, billingMonth) => {...}
//   → meal = expectedMealFee(billingMonth)
//   → extra = extracurricularFee(studentId, billingMonth)
//   → refund = refundForPrevMonth(studentId, prevMonth(billingMonth))
//   → INSERT Invoices (InvoiceType='MONTHLY', Surcharge=0)

// Cron đầu tháng (Flow 2) — chạy cho toàn trường
export const runMonthlyBilling = async (billingMonth) => {...}
//   for each student có plan Active:
//     if isTuitionDue(plan, billingMonth) → generateTuitionInvoice
//     generateMonthlyInvoice(student, billingMonth)   // luôn luôn

// Thêm phụ thu (Flow 3)
export const addSurcharge = async (invoiceId, amount, note) => {...}

// Ghi nhận thanh toán (Flow 4)
export const recordPayment = async (invoiceId, amountPaid, method, code) => {...}
//   → INSERT Transactions
//   → tính SUM(AmountPaid) vs TotalAmount → cập nhật PaymentStatus (Unpaid/Partial/Paid)
```

---

## 5. API CONTRACTS

### 5.1 Hiệu trưởng — module `billing`, mount `/billing`, `authorize(2)`
> Hiệu trưởng (roleId=2) là người xử lý billing. Admin (roleId=1) bổ sung sau → chỉ cần đổi `authorize(2)` thành `authorize(1, 2)`.
```
POST /billing/students/:studentId/tuition-plan
  body: { packageId, startMonth? }        // startMonth default = tháng hiện tại
  → 201 { plan, tuitionInvoice, monthlyInvoice }

POST /billing/run-monthly
  body: { billingMonth? }                 // default = tháng hiện tại
  → 200 { generated: { tuition: n, monthly: m }, skipped: k }

PATCH /billing/invoices/:invoiceId/surcharge
  body: { amount, note }
  → 200 { invoice }                       // TotalAmount đã tính lại
```

### 5.2 Parent
```
GET /parent/children/:studentId/invoices
  query: { type?, status?, from?, to? }
  → 200 [ { invoiceId, invoiceType, billingMonth, periodRange, totalAmount, paymentStatus, ... } ]

GET /parent/invoices/:invoiceId
  → 200 { invoice + breakdown các cột + transactions[] }

POST /parent/invoices/:invoiceId/pay
  body: { amountPaid, paymentMethod, transactionCode? }
  → 200 { transaction, paymentStatus }
```
> Nhớ check quyền: `isParentOfStudent` cho các endpoint parent (giống pattern hiện có).

---

## 6. KẾ HOẠCH THEO PHASE

### ☐ Phase 0 — Migration schema + khởi tạo module
**DB**
- [ ] Viết migration: `CREATE TABLE StudentTuitionPlans`
- [ ] Viết migration: `CREATE TABLE Holidays`
- [ ] Viết migration: `ALTER Invoices ADD InvoiceType`
- [ ] Viết migration: `ALTER Invoices ADD UNIQUE (StudentID, BillingMonth, InvoiceType)`
- [ ] Seed dữ liệu: vài ngày lễ mẫu vào `Holidays`

**Khởi tạo module & wiring**
- [ ] Tạo thư mục `src/modules/billing/` với 4 file rỗng (service/controller/route/docs)
- [ ] Import + mount `{ path: '/billing', route: billingRoute }` trong `src/routes/index.js`
- [ ] Xác nhận role: tất cả route billing dùng `authorize(2)` (hiệu trưởng)
- [ ] (Nếu chọn cron nội bộ) `npm i node-cron`

### ☐ Phase 1 — Học phí theo gói (lõi, chắc chắn nhất)
**Helper**
- [ ] `dateHelpers.getMonthKey(timestamp)` → 'YYYY-MM'
- [ ] `dateHelpers.monthIndex(startMonth, curMonth)`
- [ ] `dateHelpers.addMonths(month, n)` + `monthRange(start, count)`

**Service**
- [ ] `registerTuitionPlan(studentId, packageId, startMonth)` — lấy `MonthlyTuition` từ `BaseFees` theo năm học của lớp bé → snapshot vào plan
- [ ] `isTuitionDue(plan, billingMonth)` (idx % D === 0)
- [ ] `tuitionForCycle(plan, package)` (gross, discount, periodRange)
- [ ] `generateTuitionInvoice(plan, billingMonth)` — INSERT `InvoiceType='TUITION'`, nuốt lỗi trùng UNIQUE

**API + Test**
- [ ] `POST /billing/students/:studentId/tuition-plan` (authorize(2))
- [ ] Test gói Tháng: TuitionFee=4,500,000, discount=0
- [ ] Test gói Quý: TuitionFee=13,500,000, PeriodRange đúng 3 tháng
- [ ] Test gói Năm: discount=10% → Total=48,600,000

### ☐ Phase 2 — Phiếu thu hàng tháng (tiền ăn + ngoại khóa)
**Service**
- [ ] `workingDays(billingMonth)` — đếm T2–T6 trừ `Holidays`
- [ ] `expectedMealFee(billingMonth)` = workingDays × `BaseFees.DailyMealFee` (live)
- [ ] `extracurricularFee(studentId, billingMonth)` — sum `StudentExtracurriculars` Active
- [ ] `refundForPrevMonth(studentId, prevMonth)` — sum ngày nghỉ `IsMealFeeDeducted=1` (đơn đã auto-Approved)
- [ ] `generateMonthlyInvoice(studentId, billingMonth)` — INSERT `InvoiceType='MONTHLY'`, TuitionFee=0

**Test**
- [ ] Tháng có lễ → workingDays trừ đúng ngày lễ
- [ ] Bé đăng ký 2 hoạt động → ExtracurricularFee = tổng đúng
- [ ] Bé nghỉ phép tháng M → RefundAmount xuất hiện đúng ở phiếu tháng M+1
- [ ] Không phát sinh → TotalAmount = 0

### ☐ Phase 3 — Cron tự động toàn trường
- [ ] `runMonthlyBilling(billingMonth)` — loop mọi student có plan Active: tới kỳ→TUITION; luôn→MONTHLY
- [ ] `POST /billing/run-monthly` (authorize(2)) — trigger tay để test
- [ ] Test idempotent: chạy 2 lần cùng tháng → không tạo trùng (nhờ UNIQUE)
- [ ] (Cách 1) `src/jobs/monthlyBilling.cron.js` chạy 00:05 ngày 1 + khởi động trong `app.js`
- [ ] (Cách 2) Ghi chú cấu hình scheduler ngoài gọi endpoint

### ☐ Phase 4 — Thanh toán + phụ thu + Parent APIs
**Service (billing)**
- [ ] `addSurcharge(invoiceId, amount, note)` → cập nhật `Surcharge`
- [ ] `recordPayment(invoiceId, amountPaid, method, code)` → INSERT `Transactions` + cập nhật `PaymentStatus`
- [ ] `PATCH /billing/invoices/:invoiceId/surcharge` (authorize(2))

**Parent (module parent)**
- [ ] `getInvoicesByStudentId` + `GET /parent/children/:id/invoices` (authorize(4) + `isParentOfStudent`)
- [ ] `getInvoiceDetail` + `GET /parent/invoices/:invoiceId` (kèm transactions)
- [ ] `createPayment` + `POST /parent/invoices/:invoiceId/pay`
- [ ] Swagger docs nhóm "Parent - Billing"

---

## 7. EDGE CASES & ĐỂ SAU

| Vấn đề | Trạng thái |
|---|---|
| `DueDate` + trạng thái `Overdue` | 🔵 Để sau (thêm cột khi cần) |
| Prorate tiền ăn khi nhập học giữa tháng | 🔵 Để sau (hiện tính từ đầu tháng nhập học) |
| Hoàn học phí khi rút gói dài giữa chừng | 🔵 Để sau (cần chính sách hoàn) |
| Giảm giá anh/chị em ruột, con nhân viên | 🔵 Để sau (cần bảng discount riêng) |
| Đổi gói giữa chừng | 🔵 Để sau (Ended plan cũ → tạo plan mới) |
| Thanh toán online (VNPay/Momo) | 🔵 Để sau (hiện chỉ ghi nhận Transaction thủ công) |

---

## 8. GHI CHÚ QUAN TRỌNG

- **Chiết khấu chỉ áp học phí** — tiền ăn/ngoại khóa/phụ thu luôn full giá.
- **DailyMealFee lấy live** theo năm học hiện tại (khác học phí — học phí snapshot khóa giá).
- **Idempotency**: cron dựa vào `UNIQUE(StudentID, BillingMonth, InvoiceType)` → chạy lại an toàn, đã có thì bỏ qua.
- **TotalAmount là generated column** — KHÔNG insert/update thủ công, chỉ đổ các cột con.
- **Hoàn tiền ăn trễ 1 tháng**: nghỉ tháng M → hoàn ở phiếu tháng M+1 (`RefundAmount`).
- **Timestamp**: toàn hệ thống dùng Unix bigint (giây), khớp convention hiện có.
- **Role IDs**: `1` = admin, `2` = hiệu trưởng, `4` = phụ huynh (theo `auth.middleware.js`). **Hiệu trưởng (roleId=2) là người xử lý billing** → route dùng `authorize(2)`. Admin làm sau: chỉ cần nới thành `authorize(1, 2)`.
- **Leave request auto-Approved**: đơn nghỉ tạo ra đã là `'Approved'` (parent.service dòng ~821), KHÔNG có bước duyệt riêng → `refundForPrevMonth` chỉ cần sum ngày nghỉ có `IsMealFeeDeducted=1` trong tháng, không phải lọc trạng thái duyệt.
- **Chưa có module admin**: billing là module đầu tiên phục vụ admin → tự tạo mới, không có sẵn pattern admin để bám theo (nhưng bám theo pattern module `parent`).
