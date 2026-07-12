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

---

## 3. GET `/principal/holidays`

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

## 4. POST `/principal/holidays`

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
