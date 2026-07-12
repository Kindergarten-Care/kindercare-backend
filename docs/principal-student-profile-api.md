# API Contract — Hồ sơ học sinh (Principal)

Base path: `/principal`

Tất cả endpoint dưới đây yêu cầu:
- Header: `Authorization: Bearer <token>`
- Role: **Principal** (`RoleID = 2`). Nếu không đúng role → `403 Forbidden`.

---

## 1. GET `/principal/student/{id}/detail`

Lấy thông tin chi tiết học sinh, kèm danh sách phụ huynh. Dùng để hiển thị màn hình hồ sơ/chỉnh sửa trước khi gọi API sửa (mục 2).

### Request

```
GET /principal/student/1/detail
Authorization: Bearer <token>
```

| Path param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | number | Có | `StudentID` |

### Response `200 OK`

```json
{
  "success": true,
  "message": "Lấy thông tin chi tiết học sinh thành công",
  "data": {
    "id": 1,
    "fullName": "Nguyễn Minh Khang",
    "dateOfBirth": 1684108800,
    "gender": "Nam",
    "allergies": "Dị ứng lạc",
    "admissionDate": 1693526400,
    "status": "Active",
    "avatarUrl": null,
    "classId": 1,
    "className": "Mầm 1",
    "parents": [
      {
        "parentId": 4,
        "fullName": "Nguyễn Anh Tuấn",
        "phoneNumber": "0909090909",
        "email": "tuan.nguyen@gmail.com",
        "relationship": "Bố",
        "isPrimary": 1
      }
    ]
  }
}
```

### Field description

| Field | Type | Ghi chú |
|---|---|---|
| `id` | number | `StudentID` |
| `fullName` | string | |
| `dateOfBirth` | number (unix timestamp) \| null | |
| `gender` | string \| null | |
| `allergies` | string \| null | |
| `admissionDate` | number (unix timestamp) \| null | Ngày nhập học — **chỉ đọc**, không sửa được qua API mục 2 |
| `status` | string \| null | `EnrollmentStatus` (vd `Active`, `Graduated`) — **chỉ đọc** |
| `avatarUrl` | string \| null | |
| `classId` | number \| null | **Chỉ đọc** — đổi lớp qua `POST /principal/assignments/students`, không qua API sửa hồ sơ |
| `className` | string \| null | |
| `parents[]` | array | Danh sách phụ huynh — xem/thêm phụ huynh qua `POST /principal/student/:id/parents`, không sửa qua API này |

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ |
| 404 | Không tìm thấy học sinh |

---

## 2. PATCH `/principal/student/{id}`

Sửa thông tin cá nhân của học sinh. Chỉ cần truyền field muốn sửa (ít nhất 1 field).

**Giới hạn có chủ đích:** endpoint này chỉ sửa thông tin cá nhân cơ bản. Các thao tác nghiệp vụ khác đã có API riêng, **không** gộp vào đây:

| Muốn làm gì | Dùng API nào |
|---|---|
| Đổi lớp học sinh | `POST /principal/assignments/students` |
| Đổi `EnrollmentStatus` (tốt nghiệp...) | `POST /principal/academic-year/end` (tự động khi tổng kết năm học) |
| Thêm/liên kết phụ huynh | `POST /principal/student/:id/parents` |

### Request

```
PATCH /principal/student/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Nguyễn Minh Khang",
  "dateOfBirth": 1684108800,
  "gender": "Nam",
  "allergies": "Dị ứng lạc, hải sản",
  "avatarUrl": "https://media.kindercare.app/students/avatar.jpg"
}
```

| Path param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | number | Có | `StudentID` của học sinh cần sửa |

| Body field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `fullName` | string | Không* | |
| `dateOfBirth` | number (unix timestamp) | Không* | |
| `gender` | string | Không* | |
| `allergies` | string \| null | Không* | |
| `avatarUrl` | string \| null | Không* | |

\* Cần truyền ít nhất 1 trong 5 field, nếu không sẽ trả `400 Bad Request`.

### Response `200 OK`

```json
{
  "success": true,
  "message": "Cập nhật thông tin học sinh thành công",
  "data": null
}
```

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ, hoặc không truyền field nào để sửa |
| 404 | Không tìm thấy học sinh |

---

## Lưu ý cho FE

- **Luồng màn hình sửa hồ sơ:** gọi mục 1 (`GET .../detail`) để đổ dữ liệu vào form → người dùng sửa → chỉ gửi lên (mục 2, `PATCH`) **những field thực sự thay đổi**, không bắt buộc gửi cả 5 field mỗi lần (partial update).
- Sau khi `PATCH` thành công, **response không trả lại object học sinh đã cập nhật** (`data: null`) — FE cần tự cập nhật lại state ở client bằng chính giá trị vừa gửi lên, hoặc gọi lại `GET .../detail` nếu cần đồng bộ chắc chắn với server (ví dụ để lấy `className` mới nếu vừa đổi lớp ở nơi khác).
- `dateOfBirth` truyền vào là **unix timestamp giây**, không phải chuỗi ngày — cần convert ở FE trước khi gửi (tương tự các field ngày khác trong hệ thống).
- Trường `classId`, `status` (EnrollmentStatus), `admissionDate` là **chỉ đọc** ở màn hình này — nếu UI có ô nhập cho các field này, cần disable hoặc ẩn đi, đừng gửi lên API `PATCH` vì API sẽ bỏ qua (không có field tương ứng trong body được xử lý).

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
