# FE IMPLEMENTATION PLAN — BILLING (HỌC PHÍ/HÓA ĐƠN) & THANH TOÁN MOMO

> Tài liệu tham chiếu để FE implement UI cho các API billing đã hoàn thành ở backend.
> Base URL: `{API_URL}` (vd `https://web-test.kindercare.app/api/v1`). Tất cả endpoint dưới đây yêu cầu header `Authorization: Bearer <token>` trừ MoMo IPN (nội bộ, BE-to-BE, FE không gọi).

---

## 0. BỐI CẢNH NGHIỆP VỤ CẦN HIỂU TRƯỚC KHI CODE UI

| Khái niệm | Giải thích |
|---|---|
| 3 loại hóa đơn | `InvoiceType = 'TUITION'` (học phí theo gói, xuất theo chu kỳ), `'MONTHLY'` (tiền ăn + phụ thu − hoàn tiền, xuất mỗi tháng), `'EXTRACURRICULAR'` (hoạt động ngoại khóa đã đăng ký, gộp theo tháng — xem mục 2.6). Một học sinh có thể có cả 3 loại hóa đơn trong cùng 1 tháng. |
| Format tháng | Mọi field tháng dùng string `'MM-YYYY'` (ví dụ `"08-2026"`), **không phải** `'YYYY-MM'`. Cẩn thận khi parse/sort. |
| `TotalAmount` | Là trường tính sẵn ở BE, FE **không tự tính lại** — chỉ hiển thị giá trị BE trả về. |
| `PaymentStatus` | 3 giá trị: `Unpaid` | `Partial` | `Paid`. Cập nhật tự động sau mỗi lần thanh toán (thủ công hoặc MoMo). |
| `dueDate` | Hạn đóng, unix timestamp giây, cố định = **ngày 10 của `billingMonth`**. Có thể `null` cho các invoice cũ tạo trước khi tính năng này ra đời. BE tự gửi push nhắc phụ huynh trước 3 ngày và khi quá hạn (xem mục 2.5) — FE chỉ cần hiển thị, không cần tự tính lịch nhắc. |
| Timestamp | Toàn hệ thống dùng Unix timestamp (giây), không phải milliseconds — nhớ `× 1000` khi tạo `Date` ở JS. |
| Vai trò | 2 nhóm actor dùng các API khác nhau: **Hiệu trưởng** (roleId=2) dùng nhóm `/billing/*`; **Phụ huynh** (roleId=4) dùng nhóm `/parent/*`. |

---

## 1. NHÓM API — HIỆU TRƯỞNG (`/billing/*`)

Dành cho màn hình quản trị học phí phía hiệu trưởng/admin.

### 1.1 Đăng ký gói học phí cho học sinh

```
POST /billing/students/{studentId}/tuition-plan
```

**Request body:**
```json
{
  "packageId": 2,
  "startMonth": "08-2026"   // optional, default = tháng hiện tại
}
```

**Response 201:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Đăng ký gói học phí thành công",
  "data": {
    "plan": {
      "PlanID": 1,
      "StudentID": 19,
      "PackageID": 2,
      "StartMonth": "08-2026",
      "MonthlyTuitionSnapshot": 4500000
    },
    "tuitionInvoice": {
      "invoiceId": 8,
      "tuitionFee": 13500000,
      "discountAmount": 0,
      "periodRange": "08-2026 - 10-2026",
      "billingMonth": "08-2026"
    },
    "monthlyInvoice": {
      "invoiceId": 9,
      "billingMonth": "08-2026",
      "expectedMealFee": 1495000,
      "extracurricularFee": 0,
      "refundAmount": 0
    }
  }
}
```

**UI gợi ý:**
- Form đăng ký gói: dropdown chọn gói (Tháng/Quý/Nửa năm/Năm — lấy từ danh sách `PaymentPackages`, hiện tại chưa có API list riêng, có thể hardcode hoặc hỏi BE bổ sung `GET /billing/packages` nếu cần), date picker chọn `startMonth` (chỉ chọn tháng/năm, không chọn ngày).
- Sau khi đăng ký thành công, hiển thị toast + 2 card tóm tắt: hóa đơn học phí kỳ đầu và hóa đơn hàng tháng đầu tiên vừa tạo (điều hướng sang trang chi tiết hóa đơn nếu cần).

**Lỗi cần xử lý:**
| Status | Nguyên nhân | UI xử lý |
|---|---|---|
| 400 | Thiếu `packageId`, hoặc lớp của học sinh chưa có `BaseFees` cho năm học | Hiện thông báo lỗi rõ ràng, gợi ý liên hệ admin cấu hình học phí cơ bản |
| 404 | Không tìm thấy học sinh/gói | Hiện lỗi "không tìm thấy" |

---

### 1.2 Chạy hóa đơn hàng tháng cho toàn trường (thủ công/test)

```
POST /billing/run-monthly
```

**Request body (optional):**
```json
{ "billingMonth": "08-2026" }
```

**Response 200:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Chạy hóa đơn hàng tháng thành công",
  "data": {
    "billingMonth": "08-2026",
    "generated": { "tuition": 3, "monthly": 42 },
    "skipped": 0
  }
}
```

> Idempotent — gọi lại nhiều lần cùng `billingMonth` không tạo trùng, chỉ tăng `skipped`. Production có cron tự chạy 00:05 ngày 1 hàng tháng — endpoint này chủ yếu để test/trigger tay khi cần.

**UI gợi ý:** nút "Chạy hóa đơn tháng này" trong màn hình quản trị billing, kèm dialog xác nhận (vì đây là hành động ảnh hưởng toàn trường). Sau khi chạy, hiển thị kết quả `generated`/`skipped` dạng toast hoặc bảng tóm tắt.

---

### 1.3 Thêm phụ thu vào 1 hóa đơn

```
PATCH /billing/invoices/{invoiceId}/surcharge
```

**Request body:**
```json
{
  "amount": 100000,
  "note": "Phụ thu hoạt động dã ngoại"
}
```

**Response 200:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Thêm phụ thu thành công",
  "data": { "invoice": { /* full Invoices row, raw DB column names (PascalCase) */ } }
}
```

⚠️ **Lưu ý quan trọng:** `amount` được **cộng dồn** vào `Surcharge` hiện có (không set đè). Gọi API này 2 lần với `amount=100000` sẽ làm `Surcharge` tăng lên 200000. UI nên hiển thị rõ "phụ thu hiện tại" trước khi cho nhập thêm, tránh phụ huynh/hiệu trưởng nhập nhầm tưởng là set giá trị tuyệt đối.

**UI gợi ý:** trong trang chi tiết hóa đơn (view hiệu trưởng), nút "Thêm phụ thu" mở modal nhập `amount` + `note`, sau khi submit refetch lại chi tiết hóa đơn để hiển thị `Surcharge`/`TotalAmount` mới.

---

### 1.4 Sửa hạn đóng của 1 hóa đơn (gia hạn thủ công)

```
PATCH /billing/invoices/{invoiceId}/due-date
```

**Request body:**
```json
{ "dueDate": "2026-08-20" }
```

> `dueDate` là string `'YYYY-MM-DD'` (không phải unix timestamp) — BE tự convert sang 00:00 giờ GMT+7. Dùng date picker thường ở FE, không cần input timestamp thô.

**Response 200:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cập nhật hạn đóng thành công",
  "data": { "invoice": { /* full Invoices row, raw DB column names (PascalCase) */ } }
}
```

> Khi gọi API này, BE tự động reset lại trạng thái "đã nhắc" của hóa đơn — nghĩa là nếu hạn cũ đã trôi qua và hệ thống đã gửi nhắc quá hạn, sau khi gia hạn thì cron nhắc nhở sẽ tính lại từ đầu theo hạn mới (không bị bỏ sót nhắc nhở, cũng không nhắc sai theo hạn cũ).

**UI gợi ý:** trong trang chi tiết hóa đơn (view hiệu trưởng), nút "Gia hạn đóng" mở date picker chọn `dueDate` mới (mặc định hiện giá trị `dueDate` hiện tại nếu có), submit xong refetch lại chi tiết hóa đơn.

**Lỗi cần xử lý:**
| Status | Nguyên nhân | UI xử lý |
|---|---|---|
| 400 | Thiếu `dueDate` hoặc sai định dạng (phải là `YYYY-MM-DD`) | Validate ở FE trước khi gửi, dùng date picker để tránh nhập tay sai format |
| 404 | Không tìm thấy hóa đơn | Hiện lỗi |

---

## 2. NHÓM API — PHỤ HUYNH (`/parent/*`)

Dành cho app/web phụ huynh, hiển thị và thanh toán hóa đơn của con.

### 2.1 Danh sách hóa đơn của 1 học sinh

```
GET /parent/children/{studentId}/invoices?type=&status=&from=&to=
```

**Query params (tất cả optional):**
| Param | Giá trị | Ý nghĩa |
|---|---|---|
| `type` | `TUITION` \| `MONTHLY` | Lọc theo loại hóa đơn |
| `status` | `Unpaid` \| `Partial` \| `Paid` | Lọc theo trạng thái thanh toán |
| `from` | `'MM-YYYY'` | Cận dưới `billingMonth` (inclusive) |
| `to` | `'MM-YYYY'` | Cận trên `billingMonth` (inclusive) |

**Response 200:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy danh sách hóa đơn thành công",
  "data": [
    {
      "invoiceId": 9,
      "invoiceType": "MONTHLY",
      "billingMonth": "08-2026",
      "periodRange": null,
      "tuitionFee": 0,
      "expectedMealFee": 1495000,
      "extracurricularFee": 0,
      "surcharge": 0,
      "refundAmount": 65000,
      "discountAmount": 0,
      "totalAmount": 1430000,
      "paymentStatus": "Unpaid",
      "dueDate": 1786269600,
      "createdAt": 1783067067
    }
  ]
}
```

**UI gợi ý:**
- Danh sách hóa đơn dạng card/table theo `billingMonth` giảm dần (BE đã sort sẵn `ORDER BY BillingMonth DESC, InvoiceID DESC` — FE không cần sort lại).
- Tab lọc theo `type` (Tất cả / Học phí / Hàng tháng / Ngoại khóa) và filter theo `status` (badge màu: Unpaid=đỏ/cam, Partial=vàng, Paid=xanh).
- Với hóa đơn `TUITION`, hiển thị `periodRange` (ví dụ "08-2026 - 10-2026") thay vì chỉ `billingMonth`, vì nó thể hiện cả chu kỳ gói.
- Với hóa đơn `MONTHLY`, nếu `refundAmount > 0`, hiển thị nổi bật dòng "Hoàn tiền ăn tháng trước: -65,000đ" để phụ huynh hiểu vì sao tổng tiền giảm. `extracurricularFee` trong MONTHLY luôn = 0 — tiền ngoại khóa giờ nằm ở hóa đơn `EXTRACURRICULAR` riêng (xem mục 2.6).
- Nếu `dueDate` không null và `paymentStatus !== 'Paid'`, hiển thị hạn đóng (ví dụ "Hạn: 10/08/2026"). Nếu đã qua `dueDate`, đổi màu badge/text sang cảnh báo (ví dụ đỏ đậm "Quá hạn") để phụ huynh nhận biết ngay trong danh sách mà không cần mở chi tiết.

---

### 2.2 Chi tiết 1 hóa đơn (kèm lịch sử giao dịch)

```
GET /parent/invoices/{invoiceId}
```

**Response 200:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy chi tiết hóa đơn thành công",
  "data": {
    "invoiceId": 9,
    "studentId": 19,
    "packageId": null,
    "invoiceType": "MONTHLY",
    "billingMonth": "08-2026",
    "totalAmount": 1930000,
    "paymentStatus": "Unpaid",
    "dueDate": 1786269600,
    "transactions": [
      {
        "transactionId": 3,
        "amountPaid": 1930000,
        "paymentMethod": "Chuyển khoản Bank",
        "transactionCode": "MB-INV009-XYZ",
        "transactionDate": 1783100000,
        "status": "Success"
      }
    ]
  }
}
```

> Lưu ý: response chi tiết trả **toàn bộ cột** của Invoices (bao gồm cả các field không có trong ví dụ trên như `tuitionFee`, `expectedMealFee`, `extracurricularFee`, `surcharge`, `refundAmount`, `discountAmount`, `periodRange`, `createdAt` — giống schema ở mục 2.1). Ví dụ trong docs chỉ rút gọn.

**UI gợi ý:**
- Trang chi tiết hóa đơn: breakdown từng dòng phí (học phí / tiền ăn / ngoại khóa / phụ thu / hoàn tiền / chiết khấu) → tổng cộng.
- Timeline lịch sử giao dịch (`transactions[]`), mỗi dòng hiện `paymentMethod`, số tiền, thời gian (`transactionDate` là Unix timestamp giây), trạng thái (`Success`/`Pending`/`Failed` — xem mục 2.4 để biết khi nào có `Pending`).
- Nếu `paymentStatus !== 'Paid'`, hiện nút "Thanh toán ngay" dẫn tới lựa chọn phương thức (chuyển khoản thủ công vs MoMo — xem 2.3/2.4).

---

### 2.3 Thanh toán thủ công (chuyển khoản/tiền mặt, nhân viên xác nhận)

```
POST /parent/invoices/{invoiceId}/pay
```

**Request body:**
```json
{
  "amountPaid": 1930000,
  "paymentMethod": "Chuyển khoản Bank",
  "transactionCode": "MB-INV009-XYZ"   // optional
}
```

**Response 200:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Thanh toán hóa đơn thành công",
  "data": {
    "transactionId": 3,
    "invoiceId": 9,
    "amountPaid": 1930000,
    "totalPaid": 1930000,
    "totalAmount": 1930000,
    "paymentStatus": "Paid"
  }
}
```

> Dùng cho trường hợp phụ huynh đã chuyển khoản tay và nhân viên/hiệu trưởng nhập lại xác nhận — **không phải** flow tự động online. Nếu FE có màn hình riêng cho nhân viên xác nhận thanh toán thủ công, dùng endpoint này.

**Lỗi cần xử lý:** 400 nếu thiếu `amountPaid`/`paymentMethod`.

---

### 2.4 Thanh toán online qua MoMo (sandbox)

Đây là flow chính cho phụ huynh tự thanh toán online. Gồm 2 bước: **(a)** FE gọi BE tạo đơn MoMo → nhận `payUrl` → redirect; **(b)** MoMo tự gọi về BE (IPN) sau khi thanh toán xong — **FE không tham gia bước (b)**, chỉ cần biết để hiểu vì sao trạng thái invoice tự cập nhật.

#### (a) Tạo đơn thanh toán MoMo

```
POST /parent/invoices/{invoiceId}/pay-momo
```

**Request body:** không cần (rỗng).

**Response 200:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Tạo đơn thanh toán MoMo thành công",
  "data": {
    "payUrl": "https://test-payment.momo.vn/v2/gateway/pay/abc123",
    "orderId": "INV9-a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

**FE cần làm:**
1. Gọi API này khi phụ huynh chọn "Thanh toán qua MoMo".
2. Ngay khi nhận `payUrl`, **redirect toàn trang** (`window.location.href = payUrl`) — không mở popup/iframe vì MoMo sandbox yêu cầu full-page redirect để hoạt động ổn định.
3. Lưu tạm `orderId` (ví dụ vào `sessionStorage`) nếu cần hiển thị lại trạng thái "đang xử lý" khi user quay lại trang.

**Lỗi cần xử lý:**
| Status | Nguyên nhân | UI xử lý |
|---|---|---|
| 400 | Hóa đơn có `totalAmount <= 0` (không có gì phải trả) | Ẩn nút thanh toán MoMo nếu tổng tiền = 0 |
| 404 | Không tìm thấy hóa đơn | Hiện lỗi |
| 500 | MoMo API lỗi (mạng, sai cấu hình) | Hiện lỗi chung, gợi ý thử lại hoặc chọn phương thức khác |

#### (b) MoMo redirect về sau khi thanh toán (FE cần dựng trang này)

Sau khi phụ huynh thanh toán xong trên trang MoMo, MoMo sẽ **redirect trình duyệt** về:

```
{MOMO_REDIRECT_BASE_URL}/billing/payment-result?...(query params do MoMo gắn vào)
```

BE cấu hình `MOMO_REDIRECT_BASE_URL` = domain app phụ huynh (ví dụ `https://parent.kindercare.app`). **FE cần dựng route `/billing/payment-result`** để:
1. Đọc query string MoMo trả về khi redirect (bao gồm `orderId`, `resultCode`, `message`, v.v. — theo chuẩn MoMo).
2. Hiển thị màn hình "Đang xác nhận thanh toán..." rồi **gọi lại `GET /parent/invoices/{invoiceId}` để lấy `paymentStatus` mới nhất từ DB** — vì đây là nguồn sự thật chính xác nhất (IPN có thể xử lý xong trước hoặc sau khi redirect về trang này, không đảm bảo thứ tự).
3. Không tin tưởng hoàn toàn vào `resultCode` trong query string của redirect (đó chỉ là gợi ý UX nhanh) — luôn xác nhận lại bằng cách gọi API BE.

**Gợi ý polling nếu `paymentStatus` chưa cập nhật ngay:**
```js
// Sau khi redirect về, gọi GET /parent/invoices/{invoiceId} mỗi 2s, tối đa 5 lần
// (đợi IPN từ MoMo xử lý xong ở BE), sau đó hiển thị kết quả cuối cùng.
```

**Trạng thái Transaction trong lúc chờ:**
- Ngay sau khi gọi `pay-momo`, BE đã tạo 1 `Transaction` với `status: "Pending"`, `paymentMethod: "MoMo"`.
- Khi MoMo IPN báo thành công → BE tự cập nhật thành `"Success"` + tính lại `paymentStatus` của invoice.
- Khi MoMo IPN báo thất bại/hủy → BE cập nhật thành `"Failed"`.
- Nếu phụ huynh đóng trang giữa đường (không có IPN nào gọi về) → Transaction giữ mãi `"Pending"`. **UI nên coi `Pending` kéo dài (ví dụ > vài phút) là "chưa xác nhận được", cho phép phụ huynh thử thanh toán lại** (gọi lại `pay-momo` tạo đơn mới — không cần xử lý gì với đơn Pending cũ).

---

### 2.5 Nhắc hạn đóng học phí (tự động, BE-only — FE không cần gọi API)

BE có 1 cron chạy **hàng ngày lúc 08:00** quét toàn bộ hóa đơn chưa `Paid` và gửi push notification (qua Firebase, dùng cơ chế thông báo đã có sẵn trong app):

| Loại nhắc | Điều kiện | Nội dung |
|---|---|---|
| Sắp đến hạn | `dueDate` còn đúng 3 ngày, chưa từng được nhắc | "Sắp đến hạn đóng học phí" |
| Quá hạn | `dueDate` đã qua, chưa từng được nhắc quá hạn | "Hóa đơn đã quá hạn thanh toán" (gửi **1 lần duy nhất**, không lặp lại mỗi ngày) |

**FE không cần implement gì cho phần này** — chỉ cần đảm bảo:
1. App đã đăng ký FCM token đúng cách (endpoint `POST /notifications/register-token` đã có sẵn từ trước) để nhận được push.
2. Khi nhận notification có `data.type === 'INVOICE_REMINDER'`, tap vào notification nên điều hướng thẳng tới trang chi tiết hóa đơn tương ứng bằng `data.invoiceId` (payload đầy đủ: `{ type: 'INVOICE_REMINDER', invoiceId, studentId, kind: 'upcoming' | 'overdue' }`).
3. Ở màn hình danh sách/chi tiết hóa đơn, tự tính và hiển thị trạng thái "sắp đến hạn"/"quá hạn" dựa trên `dueDate` so với thời gian hiện tại (client-side), **không cần chờ push** để hiển thị — push chỉ là kênh chủ động nhắc nhở, không phải nguồn duy nhất để biết trạng thái.

---

### 2.6 Đăng ký hoạt động ngoại khóa

Đây là nguồn phát sinh hóa đơn `InvoiceType='EXTRACURRICULAR'` — **tách riêng khỏi hóa đơn MONTHLY** (không còn nằm trong `ExtracurricularFee` của invoice MONTHLY như thiết kế cũ). Mỗi tháng có tối đa 1 invoice EXTRACURRICULAR/học sinh, gộp tất cả hoạt động đăng ký trong tháng đó.

**Vòng đời 1 enrollment:** `Pending` (vừa đăng ký, chờ thanh toán) → `Active` (invoice tháng đó đã thanh toán đủ) → mỗi tháng tiếp theo, cron tự tạo enrollment mới `Pending` + invoice mới cho tháng kế (nếu tháng trước vẫn `Active`) → phụ huynh phải thanh toán lại để enrollment tháng mới thành `Active`.

⏱️ **Tự động hết hạn nếu không thanh toán**: nếu 1 enrollment vẫn ở `Pending` quá **48 giờ** kể từ lúc tạo (`createdAt`), 1 cron chạy mỗi giờ sẽ tự động chuyển nó sang `Expired` và trừ đúng số tiền hoạt động đó ra khỏi `ExtracurricularFee` của invoice liên quan (invoice không bị xóa — có thể còn hoạt động khác trong đó). UI nên hiển thị đếm ngược "Thanh toán trước [createdAt + 48h] để giữ đăng ký" trên mỗi enrollment `Pending`, và làm mới danh sách định kỳ hoặc khi quay lại màn hình để phản ánh đúng nếu đã bị tự hết hạn.

💸 **Chính sách hoàn/trừ phí khi hủy tay** (`PATCH .../cancel`) — có 1 khoảng "grace period" 48 giờ:
| Enrollment đang | Hủy khi nào | Kết quả |
|---|---|---|
| `Pending` (chưa thanh toán) | Bất kỳ lúc nào | **Trừ phí** khỏi invoice — giống hệt tự hết hạn |
| `Active` (đã thanh toán) | Trong vòng **48h kể từ lúc Active** (lúc thanh toán xong) | **Trừ phí** khỏi invoice, coi như hoàn tiền |
| `Active` (đã thanh toán) | Sau 48h kể từ lúc Active | **Không hoàn** — phí giữ nguyên trong invoice |

Response của `PATCH .../cancel` có thêm field `feeRefunded: boolean` để FE biết ngay kết quả cụ thể (nên hiển thị toast khác nhau: "Đã hủy, được hoàn phí" vs "Đã hủy, không hoàn phí do đã quá 48h").

🔁 **Đăng ký lại sau khi `Cancelled`/`Expired`**: gọi lại đúng API đăng ký (mục c) với cùng `activityId` trong cùng tháng — BE tự xử lý đúng phần phí dựa trên việc lần hủy trước đó có bị trừ phí hay không (`feeRefunded`), FE không cần tự tính toán gì thêm:
- Nếu lần hủy/hết hạn trước đó **có** trừ phí → BE cộng phí mới vào invoice.
- Nếu lần hủy trước đó **không** trừ phí (hủy ngoài grace period, tiền không hoàn) → BE chỉ khôi phục lại enrollment về `Pending`, không cộng phí lại (phí cũ vẫn còn nguyên trong invoice).

Cả 2 trường hợp đều trả về response giống hệt đăng ký mới (`status: "Pending"` + `invoiceId` để thanh toán) — không có case nào trả 400 chỉ vì đã từng hủy/hết hạn trước đó.

#### (a) Xem danh mục hoạt động

```
GET /parent/extracurriculars
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "activityId": 1, "activityName": "Vẽ sáng tạo", "monthlyFee": 500000, "description": "Lớp vẽ sáng tạo cho bé, 2 buổi/tuần" }
  ]
}
```

#### (b) Xem đăng ký hiện tại của con

```
GET /parent/children/{studentId}/extracurriculars?month=07-2026
```

`month` optional (`'MM-YYYY'`) — không truyền thì trả về toàn bộ lịch sử đăng ký.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "enrollmentId": 3,
      "activityId": 1,
      "activityName": "Vẽ sáng tạo",
      "monthlyFee": 500000,
      "registeredMonth": "07-2026",
      "status": "Active",
      "createdAt": 1783067067
    }
  ]
}
```

`status` có 4 giá trị:
| Status | Ý nghĩa |
|---|---|
| `Pending` | Vừa đăng ký hoặc vừa được gia hạn tự động sang tháng mới — **chưa** thanh toán invoice EXTRACURRICULAR của tháng đó |
| `Active` | Invoice EXTRACURRICULAR của `registeredMonth` đã thanh toán đủ (`PaymentStatus='Paid'`) |
| `Cancelled` | Phụ huynh **tự hủy tay** (`PATCH .../cancel`) — không hoàn tiền dù đang Pending hay Active, chỉ dừng gia hạn từ tháng sau |
| `Expired` | Hệ thống **tự động hết hạn** vì Pending quá 48h không thanh toán — phí đã được **trừ khỏi invoice** (khác `Cancelled`, có hoàn/trừ tiền) |

#### (c) Đăng ký hoạt động mới

```
POST /parent/children/{studentId}/extracurriculars
```

**Request body:**
```json
{ "activityId": 1 }
```

Đăng ký **có hiệu lực ngay tháng hiện tại** (`registeredMonth` = tháng hiện tại, không phải tháng sau). BE tự tìm hoặc tạo 1 invoice `EXTRACURRICULAR` Unpaid cho `(StudentID, tháng hiện tại)` và cộng phí hoạt động vào đó — nếu phụ huynh đăng ký thêm 1 hoạt động khác cùng tháng, phí sẽ **cộng dồn vào cùng 1 invoice** đó thay vì tạo invoice mới.

**Response 201:**
```json
{
  "success": true,
  "data": {
    "enrollmentId": 3,
    "studentId": 19,
    "activityId": 1,
    "registeredMonth": "07-2026",
    "status": "Pending",
    "invoiceId": 11
  }
}
```

⚠️ **Quan trọng**: enrollment trả về ở trạng thái `Pending` — hoạt động **chưa** được coi là chính thức tham gia cho tới khi invoice `invoiceId` được thanh toán (`POST /parent/invoices/{invoiceId}/pay` hoặc `/pay-momo`). UI nên điều hướng thẳng phụ huynh sang bước thanh toán ngay sau khi đăng ký thành công, dùng `invoiceId` trả về.

**Lỗi cần xử lý:** 400 nếu enrollment hiện tại của `(activityId, tháng hiện tại)` đang ở `Pending` hoặc `Active` (tức đang đăng ký thật, chưa hủy/hết hạn) — không áp dụng cho `Cancelled`/`Expired`, 2 trạng thái đó luôn đăng ký lại được bình thường (xem mục "Đăng ký lại" ở trên).

#### (d) Hủy đăng ký

```
PATCH /parent/children/{studentId}/extracurriculars/{enrollmentId}/cancel
```

**Response 200:**
```json
{
  "success": true,
  "data": { "enrollmentId": 3, "status": "Cancelled", "feeRefunded": true }
}
```

`feeRefunded` cho biết phí có bị trừ khỏi invoice hay không — xem bảng chính sách grace-period 48h ở đầu mục 2.6.

**UI gợi ý:**
- Nút "Hủy đăng ký" trong danh sách hoạt động của con, kèm dialog xác nhận. Dialog nên nói rõ trước khi bấm: nếu enrollment đang `Active` và đã quá 48h kể từ lúc thanh toán, hủy sẽ **không hoàn phí** (không tự tính chính xác được ở FE, nhưng có thể ước lượng hiển thị dựa trên thời điểm invoice liên quan chuyển `Paid`, nếu FE có lưu).
- Sau khi hủy, dùng `feeRefunded` trong response để hiện đúng toast: `true` → "Đã hủy, phí đã được hoàn"; `false` → "Đã hủy, không hoàn phí (đã quá 48h kể từ lúc thanh toán)". Hoạt động luôn ngừng gia hạn tự động sang tháng sau bất kể `feeRefunded`.
- Vì mỗi tháng đều phát sinh 1 enrollment/invoice mới (gia hạn tự động), UI nên hiển thị rõ theo từng tháng trong lịch sử (`GET .../extracurriculars`) thay vì coi 1 hoạt động là "1 đăng ký duy nhất xuyên suốt".

---

## 3. LUỒNG MÀN HÌNH GỢI Ý (PHỤ HUYNH)

```
[Danh sách hóa đơn của con]
  GET /parent/children/{studentId}/invoices
        │
        ▼ (bấm vào 1 hóa đơn)
[Chi tiết hóa đơn]
  GET /parent/invoices/{invoiceId}
        │
        ├─ paymentStatus = 'Paid' → chỉ hiển thị, không có nút thanh toán
        │
        └─ paymentStatus ≠ 'Paid' → hiện 2 lựa chọn:
              │
              ├─ [Thanh toán qua MoMo]
              │     POST /parent/invoices/{invoiceId}/pay-momo
              │     → redirect payUrl
              │     → (MoMo xử lý, tự gọi IPN về BE)
              │     → MoMo redirect về /billing/payment-result
              │     → FE gọi lại GET /parent/invoices/{invoiceId} để confirm
              │
              └─ [Đã chuyển khoản tay / khác] (nếu có màn hình cho nhân viên)
                    POST /parent/invoices/{invoiceId}/pay
```

---

## 4. CHECKLIST IMPLEMENT

### Phía Hiệu trưởng/Admin
- [ ] Màn hình đăng ký gói học phí cho học sinh (`POST /billing/students/:id/tuition-plan`)
- [ ] Nút chạy hóa đơn hàng tháng thủ công + dialog xác nhận (`POST /billing/run-monthly`)
- [ ] Modal thêm phụ thu trong trang chi tiết hóa đơn (`PATCH /billing/invoices/:id/surcharge`) — nhớ UI rõ ràng về việc **cộng dồn**
- [ ] Nút gia hạn/sửa hạn đóng trong trang chi tiết hóa đơn (`PATCH /billing/invoices/:id/due-date`), dùng date picker gửi `'YYYY-MM-DD'`

### Phía Phụ huynh
- [ ] Danh sách hóa đơn của con, filter theo `type`/`status`/`from`/`to` (`GET /parent/children/:id/invoices`)
- [ ] Hiển thị hạn đóng (`dueDate`) trong danh sách + cảnh báo trực quan khi đã quá hạn
- [ ] Trang chi tiết hóa đơn + timeline giao dịch (`GET /parent/invoices/:id`)
- [ ] Nút thanh toán MoMo → redirect `payUrl` (`POST /parent/invoices/:id/pay-momo`)
- [ ] Route `/billing/payment-result` xử lý sau khi MoMo redirect về, gọi lại API xác nhận trạng thái thật
- [ ] (Nếu cần) màn hình xác nhận thanh toán thủ công cho nhân viên (`POST /parent/invoices/:id/pay`)
- [ ] Xử lý tap vào push notification `INVOICE_REMINDER` → điều hướng tới chi tiết hóa đơn theo `data.invoiceId`
- [ ] Màn hình danh mục hoạt động ngoại khóa + đăng ký cho con (`GET /parent/extracurriculars`, `POST /parent/children/:id/extracurriculars`) — nhớ hiển thị rõ hiệu lực từ tháng sau
- [ ] Danh sách đăng ký ngoại khóa của con + nút hủy (`GET`/`PATCH .../extracurriculars/:enrollmentId/cancel`) — phân biệt rõ 2 kết quả hủy trong/ngoài 48h

### Chung
- [ ] Helper format `'MM-YYYY'` ↔ hiển thị tiếng Việt (ví dụ "08-2026" → "Tháng 8/2026")
- [ ] Helper format Unix timestamp giây → ngày giờ hiển thị (nhân 1000 trước khi tạo `Date`)
- [ ] Helper format tiền VNĐ (ví dụ dùng `Intl.NumberFormat('vi-VN')`)
- [ ] Badge màu theo `paymentStatus`: `Unpaid` (đỏ/cam), `Partial` (vàng), `Paid` (xanh)
- [ ] Helper tính trạng thái hạn đóng client-side: so `dueDate` với `now` để hiện "Còn N ngày" / "Quá hạn N ngày" (không phụ thuộc vào push notification)

---

## 5. GHI CHÚ / RỦI RO CẦN LƯU Ý

- **Không polling vô hạn** ở trang `/billing/payment-result` — giới hạn số lần thử rồi hiển thị "chưa xác nhận được, vui lòng kiểm tra lại sau" kèm nút refresh thủ công.
- **Không dùng popup/iframe cho MoMo redirect** — sandbox MoMo yêu cầu full-page redirect, mở trong iframe có thể bị MoMo chặn (X-Frame-Options).
- **`Surcharge` cộng dồn, không set đè** — nếu FE có ý định sửa/xóa phụ thu đã thêm, hiện tại **chưa có API riêng** để trừ/reset — cần yêu cầu BE bổ sung nếu nghiệp vụ cần sửa sai.
- **Chưa có API danh sách `PaymentPackages`** cho dropdown chọn gói khi đăng ký học phí — nếu cần động (không hardcode), báo BE bổ sung `GET /billing/packages` hoặc endpoint tương đương.
- **MoMo sandbox cần domain public thật** để nhận IPN — nếu FE dev trên `localhost`, luồng MoMo IPN sẽ không tự động cập nhật (vì BE test/production mới có domain public cấu hình IPN URL) — cần test đủ điều kiện trên môi trường `web-test.kindercare.app` trở lên, không test được đầy đủ trên localhost.
- **`dueDate` có thể là `null`** cho các hóa đơn tạo trước khi tính năng nhắc hạn được triển khai (dữ liệu cũ trong DB) — FE cần xử lý trường hợp null, không hiển thị hạn đóng hoặc cảnh báo quá hạn cho các hóa đơn này.
