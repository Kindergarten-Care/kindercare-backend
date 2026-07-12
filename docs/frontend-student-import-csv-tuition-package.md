# FE IMPLEMENTATION PLAN — IMPORT HỌC SINH CSV/XLSX KÈM GÓI HỌC PHÍ

> Thay đổi cho `POST /principal/students/import`. Xem [principal-fees-api.md](./principal-fees-api.md) để biết cách lấy danh sách gói học phí hiện có (`GET /principal/fees` → `packages[]`).

---

## 0. Vấn đề & giải pháp

**Trước đây:** import chỉ nhận file CSV, chỉ tạo học sinh trần trụi (`FullName`, `DateOfBirth`, `Gender`, `Allergies`, `AdmissionDate`) — không có gói học phí, không có `StudentTuitionPlans`. Hiệu trưởng phải đăng ký gói học phí thủ công cho từng học sinh sau khi import xong.

**Giờ có 2 thay đổi:**
1. **Endpoint giờ nhận cả `.xlsx`**, không chỉ `.csv` — backend tự nhận diện định dạng theo **đuôi file gốc** (`originalname` gửi kèm trong multipart request, multer tự lấy). Đây là thay đổi bắt buộc để hỗ trợ mục 3 (dropdown `PackageID`) — vì data validation/dropdown trong Excel **chỉ hoạt động trên file `.xlsx` thật**, không thể nhúng vào file `.csv` thuần văn bản.
2. File có thêm cột `PackageID` (tùy chọn). Nếu điền đúng ID của 1 gói học phí đang tồn tại, hệ thống tự động tạo `StudentTuitionPlans` cho học sinh đó ngay lúc import — không cần thao tác thêm.

**Không đổi:** học sinh vẫn được tạo với `ClassID = NULL` (chưa xếp lớp) — xếp lớp vẫn làm riêng qua `POST /principal/assignments/students` như cũ.

---

## 1. Định dạng file được hỗ trợ

| Đuôi file | Hỗ trợ | Ghi chú |
|---|---|---|
| `.csv` | Có (như cũ) | Parse bằng `csv-parser`, dòng 1 là header |
| `.xlsx` | **Có (mới)** | Parse bằng `exceljs`, chỉ đọc **sheet đầu tiên**, dòng 1 là header. Ô ngày tháng có thể để dạng Date thật trong Excel (tự động format lại) hoặc chuỗi `dd/mm/yyyy` |
| Khác (`.xls`, `.txt`, ...) | Không | Trả `400 Bad Request` |

FE chọn định dạng nào để làm **file mẫu tải về** là tùy — nhưng nếu muốn có dropdown `PackageID` (mục 3), **bắt buộc phải xuất file mẫu dạng `.xlsx`**.

---

## 2. Cột file mới: `PackageID`

| Cột | Bắt buộc | Kiểu | Ghi chú |
|---|---|---|---|
| `FullName` | Có | string | (không đổi) |
| `DateOfBirth` | Không | `dd/mm/yyyy` | (không đổi) |
| `Gender` | Không | string | (không đổi) |
| `Allergies` | Không | string | (không đổi) |
| `AdmissionDate` | Không | `dd/mm/yyyy` | (không đổi) |
| **`PackageID`** | **Không** | **integer** | **Mới** — `PackageID` của gói học phí, lấy từ `GET /principal/fees` → `packages[].id` |

### Quy tắc xử lý ở backend

- Nếu `PackageID` **rỗng/không có cột** → học sinh được tạo bình thường, không có gói học phí (giống hành vi cũ).
- Nếu `PackageID` **có giá trị nhưng không khớp** gói nào đang tồn tại trong `PaymentPackages` → **bỏ qua âm thầm**, học sinh vẫn được tạo, không báo lỗi, không dừng import cả file.
- Nếu `PackageID` hợp lệ → tạo `StudentTuitionPlans` với:
  - `MonthlyTuitionSnapshot` = `BaseFees.MonthlyTuition` của **năm học đang active** (không phải theo lớp — vì học sinh mới chưa có lớp).
  - `StartMonth` = tháng/năm của `AdmissionDate`, định dạng `MM-YYYY` (vd `"07-2026"`).
  - `Status` = `Active`.
- **Không tự động tạo hóa đơn (`Invoices`) ngay lúc import** — hóa đơn đầu tiên sẽ được billing cron tạo vào kỳ tương ứng như bình thường (khác với luồng `enrollStudent` 1-học-sinh có tạo invoice kỳ đầu ngay).

---

## 3. API Response thay đổi

```
POST /principal/students/import
```

Request không đổi (vẫn `multipart/form-data`, field `file`).

**Response `201` — đổi từ số đơn thuần sang object:**

Trước:
```json
{
  "success": true,
  "message": "Đã import thành công 20 học sinh"
}
```

Giờ:
```json
{
  "success": true,
  "message": "Đã import thành công 20 học sinh (12 học sinh được đăng ký gói học phí)",
  "data": {
    "imported": 20,
    "tuitionPlansCreated": 12
  }
}
```

| Field | Type | Ghi chú |
|---|---|---|
| `data.imported` | number | Tổng số học sinh đã tạo (giống số cũ) |
| `data.tuitionPlansCreated` | number | Số học sinh có `PackageID` hợp lệ và đã được tạo gói học phí |

FE cần cập nhật chỗ đọc kết quả import: **không còn field `count`/số nguyên ở root**, phải đọc `data.imported` và có thể hiển thị thêm `data.tuitionPlansCreated` để hiệu trưởng biết bao nhiêu học sinh đã có gói, bao nhiêu chưa (nếu `tuitionPlansCreated < imported`, phần chênh lệch là học sinh cần vào đăng ký gói thủ công sau).

---

## 4. ⚠️ Việc FE cần làm — dropdown `PackageID` động trong file XLSX

**Vấn đề:** người dùng tự tay điền `PackageID` (một con số vô nghĩa, vd `2`) vào file rất dễ gõ sai hoặc không biết ID nào ứng với gói nào.

**Yêu cầu:** khi FE tạo/xuất **file mẫu XLSX** để hiệu trưởng tải về điền, cột `PackageID` phải là **dropdown (data validation list)**, với danh sách item là **các gói học phí đang hoạt động, lấy động (dynamic) tại thời điểm xuất file** — không hardcode.

Đây là lý do endpoint import giờ phải nhận `.xlsx` (mục 1) — Excel data validation/dropdown **không thể nhúng vào `.csv`** (file text thuần, không có khái niệm ô/cell validation). File mẫu tải về **bắt buộc phải là `.xlsx`** nếu muốn có dropdown này.

### Cách lấy danh sách để đổ vào dropdown

Gọi `GET /principal/fees` (đã có sẵn), lấy mảng `packages[]`:

```json
{
  "data": {
    "packages": [
      { "id": 1, "name": "Gói Tháng", "duration": 1, "discount": 0 },
      { "id": 2, "name": "Gói Học Kỳ", "duration": 6, "discount": 5 },
      { "id": 3, "name": "Gói Cả Năm", "duration": 12, "discount": 10 }
    ]
  }
}
```

### Cách hiển thị trong dropdown

Khuyến nghị hiển thị dạng dễ đọc nhưng giá trị thật vẫn phải parse ra được số nguyên — ví dụ dùng thư viện xuất Excel hỗ trợ data validation (như `exceljs`, cũng là thư viện backend đang dùng để đọc lại file khi import) để tạo dropdown với label dạng:

```
1 - Gói Tháng
2 - Gói Học Kỳ (giảm 5%)
3 - Gói Cả Năm (giảm 10%)
```

**Hành vi parse thật của backend:** cột `PackageID` được đọc bằng `parseInt(giá_trị_ô, 10)` — với chuỗi dạng `"1 - Gói Tháng"`, `parseInt` sẽ tự động lấy đúng số `1` ở đầu chuỗi (bỏ qua phần chữ phía sau), nên **không bắt buộc** FE phải tách số ra khỏi label trước khi ghi vào ô. Tuy vậy, nếu muốn chắc chắn tránh rủi ro parse sai (ví dụ format label khác đi sau này), FE có thể chọn ghi **chỉ đúng số nguyên `PackageID`** vào ô thực tế, và dùng label đẹp chỉ ở phần hiển thị gợi ý/tooltip của dropdown nếu công cụ hỗ trợ.

**Lưu ý quan trọng:** danh sách này phải là **dynamic** — nghĩa là mỗi lần hiệu trưởng bấm "Tải file mẫu", FE phải gọi lại `GET /principal/fees` để lấy danh sách gói **mới nhất tại thời điểm đó**, không cache cứng danh sách gói cũ. Nếu hiệu trưởng vừa tạo gói mới qua `POST /principal/payment-packages`, gói đó phải xuất hiện ngay trong dropdown ở lần tải file mẫu tiếp theo.

---

## 5. Checklist cho FE

- [ ] Cập nhật chỗ đọc response `POST /principal/students/import`: đọc `data.imported` và `data.tuitionPlansCreated` thay vì field số cũ.
- [ ] Đổi file mẫu (template) xuất ra cho hiệu trưởng tải về từ `.csv` sang **`.xlsx`** — bắt buộc để có thể nhúng dropdown.
- [ ] Cột `PackageID` trong file mẫu `.xlsx` phải là dropdown, danh sách lấy động từ `GET /principal/fees` → `packages[]` tại thời điểm xuất file.
- [ ] Đảm bảo request upload gửi kèm tên file gốc đúng đuôi (`.csv`/`.xlsx`) — backend nhận diện định dạng theo `originalname` của file, không phải theo nội dung.
- [ ] Dropdown chỉ hiển thị các gói **đang hoạt động** — hiện tại `PaymentPackages` không có cột trạng thái ẩn/hiện, nên "đang hoạt động" = toàn bộ gói trả về từ `GET /principal/fees`. Nếu sau này có thêm cơ chế ẩn gói, cần lọc lại ở bước này.
- [ ] Validate ở phía FE trước khi upload (tùy chọn, không bắt buộc vì BE đã tự bỏ qua `PackageID` sai): cảnh báo người dùng nếu `PackageID` họ nhập không khớp danh sách hiện có, tránh trường hợp họ tưởng đã đăng ký gói nhưng thực ra bị bỏ qua âm thầm.
- [ ] Hiển thị rõ trên UI sau khi import xong: "Đã tạo X học sinh, Y học sinh được đăng ký gói học phí" — dùng đúng 2 số `imported`/`tuitionPlansCreated` trả về.
