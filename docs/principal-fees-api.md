# API Contract — Biểu phí & Hóa đơn (Principal)

Base path: `/principal`

Tất cả endpoint dưới đây yêu cầu:
- Header: `Authorization: Bearer <token>`
- Role: **Principal** (`RoleID = 2`). Nếu không đúng role → `403 Forbidden`.

---

## 1. GET `/principal/fees`

Lấy toàn bộ dữ liệu biểu phí: gói học phí, học phí cơ bản theo mọi năm học (kể cả năm không active), và hoạt động ngoại khóa.

### Request

Không có query param.

```
GET /principal/fees
Authorization: Bearer <token>
```

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": 1,
        "name": "Gói Tháng",
        "duration": 1,
        "discount": 0.00
      },
      {
        "id": 2,
        "name": "Gói Học Kỳ",
        "duration": 6,
        "discount": 5.00
      },
      {
        "id": 3,
        "name": "Gói Cả Năm",
        "duration": 12,
        "discount": 10.00
      }
    ],
    "baseFees": [
      {
        "id": 2,
        "yearId": 2,
        "yearName": "Niên khóa 2027-2028",
        "isActive": 1,
        "monthlyTuition": 0.00,
        "dailyMealFee": 0.00
      },
      {
        "id": 1,
        "yearId": 1,
        "yearName": "Niên khóa 2026-2027",
        "isActive": 0,
        "monthlyTuition": 4000000.00,
        "dailyMealFee": 50000.00
      }
    ],
    "extracurriculars": [
      {
        "id": 1,
        "name": "...",
        "monthlyFee": 0.00,
        "description": "..."
      }
    ]
  }
}
```

### Field description

| Field | Type | Ghi chú |
|---|---|---|
| `packages[].id` | number | `PackageID` |
| `packages[].name` | string | Tên gói học phí |
| `packages[].duration` | number | Số tháng của gói |
| `packages[].discount` | number | % giảm giá |
| `baseFees[].id` | number | `FeeID` |
| `baseFees[].yearId` | number | Năm học áp dụng |
| `baseFees[].yearName` | string \| null | Tên năm học (null nếu năm học đã bị xoá) |
| `baseFees[].isActive` | 0 \| 1 \| null | Năm học đang active hay không |
| `baseFees[].monthlyTuition` | number | Học phí/tháng |
| `baseFees[].dailyMealFee` | number | Phí ăn/ngày |
| `extracurriculars[].id` | number | `ActivityID` |
| `extracurriculars[].name` | string | Tên hoạt động ngoại khóa |
| `extracurriculars[].monthlyFee` | number | Phí/tháng |
| `extracurriculars[].description` | string \| null | Mô tả |

> Danh sách `baseFees` bao gồm **tất cả năm học**, không lọc theo `isActive` — khác với endpoint cũ `GET /principal/payment-configs` (chỉ trả biểu phí của năm học đang active).

---

## 2. PATCH `/principal/base-fees/{id}`

Sửa học phí cơ bản (`BaseFees`) của một năm học. Chỉ cần truyền field muốn sửa. Áp dụng được cho biểu phí của bất kỳ năm học nào, kể cả năm không active.

### Request

```
PATCH /principal/base-fees/2
Authorization: Bearer <token>
Content-Type: application/json

{
  "monthlyTuition": 4200000,
  "dailyMealFee": 55000
}
```

| Path param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | number | Có | `FeeID` (lấy từ `GET /principal/fees` → `baseFees[].id`) |

| Body field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `monthlyTuition` | number | Không* | Học phí/tháng |
| `dailyMealFee` | number | Không* | Phí ăn/ngày |

\* Cần truyền ít nhất 1 trong 2 field, nếu không sẽ trả `400 Bad Request`.

### Response `200 OK`

```json
{
  "success": true,
  "message": "Cập nhật biểu phí thành công",
  "data": null
}
```

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ, hoặc không truyền field nào để sửa |
| 404 | Không tìm thấy biểu phí với `id` tương ứng |

---

## 3. GET `/principal/invoices`

Lấy danh sách hóa đơn (invoices), hỗ trợ filter qua query string.

### Request

```
GET /principal/invoices?studentId=19&billingMonth=07-2026&paymentStatus=Unpaid&invoiceType=EXTRACURRICULAR
Authorization: Bearer <token>
```

| Query param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `studentId` | number | Không | Lọc theo học sinh |
| `billingMonth` | string (`MM-YYYY`) | Không | Lọc theo tháng, vd `07-2026` |
| `paymentStatus` | string | Không | `Unpaid` \| `Paid` \| ... (theo giá trị lưu trong DB) |
| `invoiceType` | string | Không | `MONTHLY` \| `EXTRACURRICULAR` \| ... |

Không truyền param nào → trả về toàn bộ hóa đơn, sắp xếp theo `createdAt` giảm dần.

### Response `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 51,
      "studentId": 19,
      "studentFullName": "Nguyễn Văn A",
      "packageId": null,
      "packageName": null,
      "periodRange": null,
      "billingMonth": "07-2026",
      "tuitionFee": 0.00,
      "expectedMealFee": 0.00,
      "extracurricularFee": 0.00,
      "surcharge": 0.00,
      "refundAmount": 0.00,
      "discountAmount": 0.00,
      "totalAmount": 0.00,
      "paymentStatus": "Unpaid",
      "invoiceType": "EXTRACURRICULAR",
      "createdAt": 1783564680,
      "dueDate": 1783616400,
      "reminderSentAt": null,
      "overdueReminderSentAt": 1783645200
    }
  ]
}
```

### Field description

| Field | Type | Ghi chú |
|---|---|---|
| `id` | number | `InvoiceID` |
| `studentId` | number \| null | |
| `studentFullName` | string \| null | Join từ bảng `Students` |
| `packageId` | number \| null | |
| `packageName` | string \| null | Join từ bảng `PaymentPackages` |
| `periodRange` | string \| null | |
| `billingMonth` | string | Định dạng `MM-YYYY` |
| `tuitionFee` | number | Học phí |
| `expectedMealFee` | number | Phí ăn dự kiến |
| `extracurricularFee` | number | Phí ngoại khóa |
| `surcharge` | number | Phụ phí |
| `refundAmount` | number | Số tiền hoàn |
| `discountAmount` | number | Số tiền giảm giá |
| `totalAmount` | number | Cột generated: `tuitionFee + expectedMealFee + extracurricularFee + surcharge - refundAmount - discountAmount` |
| `paymentStatus` | string | Trạng thái thanh toán |
| `invoiceType` | string | `MONTHLY` \| `EXTRACURRICULAR` \| ... |
| `createdAt` | number (unix timestamp) | |
| `dueDate` | number (unix timestamp) \| null | |
| `reminderSentAt` | number (unix timestamp) \| null | |
| `overdueReminderSentAt` | number (unix timestamp) \| null | |

---

## 4. POST `/principal/payment-packages`

Thêm gói học phí mới.

### Request

```
POST /principal/payment-packages
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Gói Quý",
  "duration": 3,
  "discount": 3.00
}
```

| Body field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `name` | string | Có | Tên gói học phí |
| `duration` | number | Có | Số tháng của gói |
| `discount` | number | Không | % giảm giá (mặc định 0 nếu không truyền) |

### Response `201 Created`

```json
{
  "success": true,
  "message": "Tạo gói học phí thành công",
  "data": {
    "id": 4,
    "name": "Gói Quý",
    "duration": 3,
    "discount": 3.00
  }
}
```

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | Thiếu `name` hoặc `duration` |

---

## 5. PATCH `/principal/payment-packages/{id}`

Sửa thông tin một gói học phí (`PaymentPackages`). Chỉ cần truyền field muốn sửa.

### Request

```
PATCH /principal/payment-packages/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Gói Tháng",
  "duration": 1,
  "discount": 5.00
}
```

| Path param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | number | Có | `PackageID` của gói học phí cần sửa |

| Body field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `name` | string | Không* | Tên gói học phí |
| `duration` | number | Không* | Số tháng của gói |
| `discount` | number | Không* | % giảm giá |

\* Cần truyền ít nhất 1 trong 3 field, nếu không sẽ trả `400 Bad Request`.

### Response `200 OK`

```json
{
  "success": true,
  "message": "Cập nhật gói học phí thành công",
  "data": null
}
```

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ, hoặc không truyền field nào để sửa |
| 404 | Không tìm thấy gói học phí với `id` tương ứng |

---

## 6. POST `/principal/extracurriculars`

Thêm hoạt động ngoại khóa mới.

### Request

```
POST /principal/extracurriculars
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Vẽ Sáng Tạo",
  "monthlyFee": 300000,
  "description": "Khám phá hội họa"
}
```

| Body field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `name` | string | Có | Tên hoạt động |
| `monthlyFee` | number | Có | Phí/tháng |
| `description` | string | Không | Mô tả |

### Response `201 Created`

```json
{
  "success": true,
  "message": "Tạo hoạt động ngoại khóa thành công",
  "data": {
    "id": 3,
    "name": "Vẽ Sáng Tạo",
    "monthlyFee": 300000,
    "description": "Khám phá hội họa"
  }
}
```

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | Thiếu `name` hoặc `monthlyFee` |

---

## 7. PATCH `/principal/extracurriculars/{id}`

Sửa thông tin một hoạt động ngoại khóa. Chỉ cần truyền field muốn sửa.

### Request

```
PATCH /principal/extracurriculars/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Tiếng Anh Tăng Cường",
  "monthlyFee": 500000,
  "description": "Học với giáo viên bản ngữ"
}
```

| Path param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | number | Có | `ActivityID` của hoạt động cần sửa |

| Body field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `name` | string | Không* | Tên hoạt động |
| `monthlyFee` | number | Không* | Phí/tháng |
| `description` | string | Không* | Mô tả |

\* Cần truyền ít nhất 1 trong 3 field, nếu không sẽ trả `400 Bad Request`.

### Response `200 OK`

```json
{
  "success": true,
  "message": "Cập nhật hoạt động ngoại khóa thành công",
  "data": null
}
```

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ, hoặc không truyền field nào để sửa |
| 404 | Không tìm thấy hoạt động ngoại khóa với `id` tương ứng |

---

## Error response format (chung cho các endpoint)

```json
{
  "success": false,
  "message": "..."
}
```

| Status | Trường hợp |
|---|---|
| 401 | Thiếu/token không hợp lệ |
| 403 | User không phải role Principal |
| 500 | Lỗi hệ thống |
