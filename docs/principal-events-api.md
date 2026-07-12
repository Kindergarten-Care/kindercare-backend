# API Contract — Sự kiện & Ngày nghỉ lễ (Principal)

Base path: `/principal`

Tất cả endpoint dưới đây yêu cầu:
- Header: `Authorization: Bearer <token>`
- Role: **Principal** (`RoleID = 2`). Nếu không đúng role → `403 Forbidden`.

---

## 1. GET `/principal/events`

Lấy danh sách sự kiện, hỗ trợ lọc theo `eventType`.

### Request

```
GET /principal/events?eventType=School
Authorization: Bearer <token>
```

| Query param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `eventType` | string | Không | `Class` \| `School` \| `Holiday` \| `Student`. Không truyền → trả về tất cả loại. |

### Response `200 OK`

```json
{
  "success": true,
  "message": "Lấy danh sách sự kiện thành công",
  "data": [
    {
      "id": 1,
      "title": "Khai giảng năm học mới",
      "description": "Lễ khai giảng toàn trường",
      "startTime": 1787886600,
      "endTime": 1787893800,
      "location": "Sân trường",
      "status": "Upcoming",
      "eventType": "School",
      "createdBy": 2,
      "createdAt": 1783564680,
      "classIds": [],
      "studentIds": []
    },
    {
      "id": 5,
      "title": "Họp phụ huynh lớp Mầm 1",
      "description": null,
      "startTime": 1787886600,
      "endTime": 1787893800,
      "location": null,
      "status": "Upcoming",
      "eventType": "Class",
      "createdBy": 2,
      "createdAt": 1783564680,
      "classIds": [1],
      "studentIds": []
    }
  ]
}
```

### Field description

| Field | Type | Ghi chú |
|---|---|---|
| `id` | number | `EventID` |
| `title` | string | Tiêu đề sự kiện |
| `description` | string \| null | |
| `startTime` | number (unix timestamp, giây) | |
| `endTime` | number (unix timestamp, giây) | |
| `location` | string \| null | |
| `status` | string | Mặc định `Upcoming` |
| `eventType` | string | `Class` \| `School` \| `Holiday` \| `Student` |
| `createdBy` | number \| null | `UserID` người tạo |
| `createdAt` | number (unix timestamp, giây) | |
| `classIds` | number[] | Chỉ có giá trị khi `eventType = "Class"`, join từ `EventClasses` |
| `studentIds` | number[] | Chỉ có giá trị khi `eventType = "Student"`, join từ `EventStudents` |

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | `eventType` truyền sai giá trị (không thuộc 4 loại trên) |

---

## 2. POST `/principal/events`

Tạo sự kiện mới theo `eventType`.

**Quy tắc theo từng loại:**
- `Class` → **bắt buộc** truyền `classIds[]` (ít nhất 1 phần tử) — sự kiện chỉ hiển thị cho các lớp đó.
- `Student` → **bắt buộc** truyền `studentIds[]` (ít nhất 1 phần tử) — sự kiện chỉ hiển thị cho các học sinh đó.
- `School` / `Holiday` → không cần `classIds`/`studentIds` — hiển thị cho toàn trường.

### Request

```
POST /principal/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Họp phụ huynh lớp Mầm 1",
  "description": null,
  "startTime": 1787886600,
  "endTime": 1787893800,
  "location": null,
  "status": "Upcoming",
  "eventType": "Class",
  "classIds": [1]
}
```

| Body field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `title` | string | Có | |
| `description` | string | Không | |
| `startTime` | number (unix timestamp) | Có | |
| `endTime` | number (unix timestamp) | Có | |
| `location` | string | Không | |
| `status` | string | Không | Mặc định `Upcoming` |
| `eventType` | string | Có | `Class` \| `School` \| `Holiday` \| `Student` |
| `classIds` | number[] | Điều kiện | Bắt buộc khi `eventType = "Class"` |
| `studentIds` | number[] | Điều kiện | Bắt buộc khi `eventType = "Student"` |

### Response `201 Created`

```json
{
  "success": true,
  "message": "Tạo sự kiện thành công",
  "data": {
    "id": 5,
    "title": "Họp phụ huynh lớp Mầm 1",
    "description": null,
    "startTime": 1787886600,
    "endTime": 1787893800,
    "location": null,
    "status": "Upcoming",
    "eventType": "Class",
    "createdBy": 2,
    "classIds": [1],
    "studentIds": []
  }
}
```

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | Thiếu `title`/`startTime`/`endTime`/`eventType`, hoặc `eventType` sai giá trị, hoặc thiếu `classIds`/`studentIds` tương ứng với `eventType` |

**Lưu ý:** sau khi tạo thành công, hệ thống tự động gửi push notification "Sự kiện mới" cho các phụ huynh liên quan (theo `eventType`: `Class` → phụ huynh của học sinh trong các lớp; `Student` → phụ huynh của các học sinh; `School`/`Holiday` → toàn bộ phụ huynh trong trường). Việc gửi thông báo chạy nền — không ảnh hưởng tới response, và lỗi gửi (nếu có) không làm hỏng việc tạo sự kiện.

---

## 3. PATCH `/principal/events/{id}`

Sửa thông tin sự kiện. Chỉ cần truyền field muốn sửa.

Nếu truyền `eventType` hoặc `classIds`/`studentIds`, toàn bộ liên kết cũ trong `EventClasses`/`EventStudents` sẽ bị xóa và tạo lại theo giá trị mới. Lưu ý: nếu đổi `eventType` sang loại khác mà không truyền `classIds`/`studentIds` tương ứng, liên kết cũ vẫn bị xóa hết (vì loại mới không cần chúng).

### Request

```
PATCH /principal/events/5
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Họp phụ huynh lớp Mầm 1 (dời lịch)",
  "startTime": 1787890200,
  "endTime": 1787897400,
  "classIds": [1, 2]
}
```

| Path param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | number | Có | `EventID` của sự kiện cần sửa |

| Body field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `title` | string | Không* | |
| `description` | string | Không* | |
| `startTime` | number (unix timestamp) | Không* | |
| `endTime` | number (unix timestamp) | Không* | |
| `location` | string | Không* | |
| `status` | string | Không* | |
| `eventType` | string | Không* | `Class` \| `School` \| `Holiday` \| `Student` |
| `classIds` | number[] | Không* | Bắt buộc có ít nhất 1 phần tử nếu `eventType` (cũ hoặc mới) là `Class` |
| `studentIds` | number[] | Không* | Bắt buộc có ít nhất 1 phần tử nếu `eventType` (cũ hoặc mới) là `Student` |

\* Cần truyền ít nhất 1 field, nếu không sẽ trả `400 Bad Request`.

### Response `200 OK`

```json
{
  "success": true,
  "message": "Cập nhật sự kiện thành công",
  "data": {
    "id": 5,
    "title": "Họp phụ huynh lớp Mầm 1 (dời lịch)",
    "description": null,
    "startTime": 1787890200,
    "endTime": 1787897400,
    "location": null,
    "status": "Upcoming",
    "eventType": "Class",
    "createdBy": 2,
    "createdAt": 1783564680,
    "classIds": [1, 2],
    "studentIds": []
  }
}
```

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ, không truyền field nào để sửa, `eventType` sai giá trị, hoặc thiếu `classIds`/`studentIds` tương ứng |
| 404 | Không tìm thấy sự kiện |

**Lưu ý:** sau khi cập nhật thành công, hệ thống tự động gửi thông báo "Sự kiện đã được cập nhật" cho phụ huynh liên quan (theo `eventType` sau khi cập nhật).

---

## 4. DELETE `/principal/events/{id}`

Xóa sự kiện. Các liên kết trong `EventClasses`/`EventStudents` tự động bị xóa theo (`ON DELETE CASCADE`).

### Request

```
DELETE /principal/events/5
Authorization: Bearer <token>
```

| Path param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | number | Có | `EventID` của sự kiện cần xóa |

### Response `200 OK`

```json
{
  "success": true,
  "message": "Đã xóa sự kiện thành công",
  "data": null
}
```

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ |
| 404 | Không tìm thấy sự kiện |

**Lưu ý:** trước khi xóa, hệ thống gửi thông báo "Sự kiện đã bị hủy" cho phụ huynh liên quan (theo `eventType` hiện tại của sự kiện, trước khi bị xóa).

---

## 5. GET `/principal/holidays`

Lấy danh sách ngày nghỉ lễ, hỗ trợ lọc theo `yearId`.

### Request

```
GET /principal/holidays?yearId=1
Authorization: Bearer <token>
```

| Query param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `yearId` | number | Không | Lọc theo năm học. Không truyền → trả về tất cả năm. |

### Response `200 OK`

```json
{
  "success": true,
  "message": "Lấy danh sách ngày nghỉ lễ thành công",
  "data": [
    {
      "id": 1,
      "holidayDate": 1787884800,
      "holidayName": "Quốc khánh 2/9",
      "yearId": 1,
      "yearName": "Niên khóa 2026-2027"
    }
  ]
}
```

### Field description

| Field | Type | Ghi chú |
|---|---|---|
| `id` | number | `HolidayID` |
| `holidayDate` | number (unix timestamp, giây) | |
| `holidayName` | string \| null | |
| `yearId` | number \| null | |
| `yearName` | string \| null | Join từ `AcademicYears` |

---

## 6. POST `/principal/holidays`

Tạo ngày nghỉ lễ mới. Lưu ý: đây là dữ liệu được billing cron dùng để **loại trừ khỏi số ngày công** khi tính `expectedMealFee` hàng tháng — thêm ngày nghỉ lễ sẽ ảnh hưởng tới hóa đơn phí ăn của tháng tương ứng.

### Request

```
POST /principal/holidays
Authorization: Bearer <token>
Content-Type: application/json

{
  "holidayDate": 1787884800,
  "holidayName": "Quốc khánh 2/9",
  "yearId": 1
}
```

| Body field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `holidayDate` | number (unix timestamp) | Có | |
| `holidayName` | string | Không | |
| `yearId` | number | Không | Năm học áp dụng |

### Response `201 Created`

```json
{
  "success": true,
  "message": "Tạo ngày nghỉ lễ thành công",
  "data": {
    "id": 2,
    "holidayDate": 1787884800,
    "holidayName": "Quốc khánh 2/9",
    "yearId": 1
  }
}
```

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | Thiếu `holidayDate` |
| 404 | Không tìm thấy năm học (nếu có truyền `yearId`) |

---

## 7. PATCH `/principal/holidays/{id}`

Sửa thông tin một ngày nghỉ lễ. Chỉ cần truyền field muốn sửa.

### Request

```
PATCH /principal/holidays/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "holidayDate": 1787971200,
  "holidayName": "Quốc khánh 2/9 (nghỉ bù)"
}
```

| Path param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | number | Có | `HolidayID` của ngày nghỉ lễ cần sửa |

| Body field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `holidayDate` | number (unix timestamp) | Không* | |
| `holidayName` | string | Không* | |
| `yearId` | number | Không* | |

\* Cần truyền ít nhất 1 trong 3 field, nếu không sẽ trả `400 Bad Request`.

### Response `200 OK`

```json
{
  "success": true,
  "message": "Cập nhật ngày nghỉ lễ thành công",
  "data": null
}
```

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ, hoặc không truyền field nào để sửa |
| 404 | Không tìm thấy ngày nghỉ lễ, hoặc không tìm thấy năm học (nếu truyền `yearId`) |

---

## 8. DELETE `/principal/holidays/{id}`

Xóa một ngày nghỉ lễ.

**Lưu ý:** xóa ngày nghỉ lễ sẽ ảnh hưởng tới số ngày công dùng để tính `expectedMealFee` của billing cron cho các tháng liên quan. Nếu hóa đơn tháng đó đã được tạo trước khi xóa, hóa đơn cũ **không tự động tính lại**.

### Request

```
DELETE /principal/holidays/1
Authorization: Bearer <token>
```

| Path param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | number | Có | `HolidayID` của ngày nghỉ lễ cần xóa |

### Response `200 OK`

```json
{
  "success": true,
  "message": "Xóa ngày nghỉ lễ thành công",
  "data": null
}
```

### Error cases riêng

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ |
| 404 | Không tìm thấy ngày nghỉ lễ |

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
