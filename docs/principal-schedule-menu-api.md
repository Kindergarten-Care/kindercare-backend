# API Contract & FE Implementation — Duyệt Thời Khóa Biểu & Thực Đơn (Principal)

Base path: `/principal`

Tất cả endpoint dưới đây yêu cầu:
- Header: `Authorization: Bearer <token>`
- Role: **Principal** (`RoleID = 2`). Nếu không đúng role → `403 Forbidden`.

---

# PHẦN A — Duyệt Thời Khóa Biểu Tháng (Sidebar: "Yêu cầu duyệt")

## A.1. GET `/principal/schedules/monthly`

Lấy danh sách tổng quan các thời khóa biểu tháng (`MonthlySchedules`) do giáo viên đã tạo.

### Request

```
GET /principal/schedules/monthly?year=2026&approvedStatus=0
Authorization: Bearer <token>
```

| Query param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `year` | number | Không | Lọc theo năm |
| `month` | number | Không | Lọc theo tháng (1-12) |
| `approvedStatus` | 0 \| 1 | Không | `0` = Chưa duyệt, `1` = Đã duyệt |
| `classId` | number | Không | Lọc theo lớp |

### Response `200 OK`

```json
{
  "success": true,
  "message": "Lấy danh sách thời khóa biểu tháng thành công",
  "data": [
    {
      "id": 2,
      "classId": 1,
      "className": "Mầm 1",
      "gradeName": "Khối Mầm",
      "month": 8,
      "year": 2026,
      "monthTheme": "Tháng 8 Bứt Phá - Bé Khám Phá Thế Giới Xung Quanh",
      "approvedStatus": 0,
      "isActive": 1,
      "createdAt": 1783617978,
      "updatedAt": 1783617978
    }
  ]
}
```

### Field description

| Field | Type | Ghi chú |
|---|---|---|
| `id` | number | `MonthlyScheduleID` |
| `classId` / `className` / `gradeName` | | Lớp và khối |
| `month` / `year` | number | |
| `monthTheme` | string | Chủ đề tháng do giáo viên đặt |
| `approvedStatus` | 0 \| 1 | **0 = Chưa duyệt, 1 = Đã duyệt** |
| `isActive` | 0 \| 1 | Tháng có đang được dùng active hay không (khác `approvedStatus`) |
| `createdAt` / `updatedAt` | unix timestamp (giây) | |

---

## A.2. GET `/principal/schedules/monthly/{id}`

Lấy chi tiết đầy đủ 1 tháng — kèm toàn bộ tuần (`WeeklySchedules`) và hoạt động từng ngày (`WeeklyScheduleDetails`).

### Request

```
GET /principal/schedules/monthly/2
Authorization: Bearer <token>
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Lấy chi tiết thời khóa biểu tháng thành công",
  "data": {
    "id": 2,
    "classId": 1,
    "className": "Mầm 1",
    "gradeName": "Khối Mầm",
    "month": 8,
    "year": 2026,
    "monthTheme": "Tháng 8 Bứt Phá",
    "approvedStatus": 0,
    "isActive": 1,
    "createdAt": 1783617978,
    "updatedAt": 1783617978,
    "weeks": [
      {
        "weeklyScheduleId": 5,
        "monthlyScheduleId": 2,
        "weekOrder": 1,
        "weekTheme": "Tuần 1: Làm quen với biển cả (Sinh vật đại dương)",
        "createdAt": 1783012594,
        "updatedAt": 1783012594,
        "items": [
          {
            "scheduleDetailId": 10,
            "weeklyScheduleId": 5,
            "dayOfWeek": "Monday",
            "startTime": "07:30:00",
            "endTime": "08:00:00",
            "activityName": "Đón trẻ",
            "details": null,
            "location": "Sân trường",
            "activityType": "pickup"
          }
        ]
      }
    ]
  }
}
```

### Field description

| Field | Type | Ghi chú |
|---|---|---|
| ...(giống mục A.1)... | | |
| `weeks[]` | array | Danh sách tuần, đã sort theo `weekOrder` tăng dần |
| `weeks[].items[]` | array | Hoạt động trong tuần, đã sort theo thứ tự ngày (T2→CN) rồi `startTime` |
| `items[].dayOfWeek` | string | `Monday`...`Sunday` |
| `items[].startTime` / `endTime` | string `HH:mm:ss` | |
| `items[].activityType` | string | `pickup` \| `meal` \| `study` \| `nap` \| `play` \| `dropoff` \| `other` |

### Error cases

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ |
| 404 | Không tìm thấy thời khóa biểu tháng |

---

## A.3. PATCH `/principal/schedules/monthly/{id}/approve`

Duyệt hoặc từ chối 1 thời khóa biểu tháng.

### Request

```
PATCH /principal/schedules/monthly/2/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "approvedStatus": 1
}
```

| Body field | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `approvedStatus` | 0 \| 1 | Có | `0` = Chưa duyệt/Từ chối, `1` = Đã duyệt |

### Response `200 OK`

```json
{
  "success": true,
  "message": "Đã duyệt thời khóa biểu tháng",
  "data": null
}
```

**Side-effect:** sau khi cập nhật thành công, hệ thống tự động gửi push notification cho các giáo viên phụ trách lớp đó ("Thời khóa biểu đã được duyệt" hoặc "... bị từ chối, vui lòng chỉnh sửa lại"). Chạy nền, không ảnh hưởng response.

### Error cases

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ, hoặc `approvedStatus` không phải 0/1 |
| 404 | Không tìm thấy thời khóa biểu tháng |

---

## A.4. ⚠️ YÊU CẦU CÁC THÀNH PHẦN HIỂN THỊ UI — "Yêu cầu duyệt"

### Sidebar

Thêm 1 item sidebar mới, tên **"Yêu cầu duyệt"**, điều hướng tới trang danh sách (A.4.1).

### A.4.1. Trang danh sách tổng quan (gọi API A.1)

- **Bố cục:** danh sách dạng card hoặc bảng, mỗi item = 1 tháng/1 lớp.
- **Mỗi item hiển thị:**
  - Tên lớp + tên khối (`className` + `gradeName`).
  - Tháng/Năm (`month`/`year`) — hiển thị dạng "Tháng 8/2026".
  - Chủ đề tháng (`monthTheme`).
  - **Badge trạng thái duyệt** dựa vào `approvedStatus`:
    - `0` → badge màu vàng/cam, label "Chờ duyệt".
    - `1` → badge màu xanh lá, label "Đã duyệt".
  - Thời gian cập nhật gần nhất (`updatedAt`, format ngày giờ dễ đọc).
- **Bộ lọc phía trên danh sách:** dropdown chọn năm (`year`), dropdown chọn tháng (`month`, tùy chọn), tab/toggle lọc theo trạng thái (`approvedStatus`: Tất cả / Chờ duyệt / Đã duyệt), dropdown chọn lớp (`classId`, tùy chọn — lấy danh sách lớp từ `GET /principal/grades-classes` đã có sẵn).
- **Mặc định khi vào trang:** nên mặc định lọc `approvedStatus=0` (chờ duyệt) trước, vì đây là màn hình "yêu cầu duyệt" — ưu tiên hiển thị việc cần làm. Cho phép người dùng đổi sang xem "Đã duyệt"/"Tất cả".
- **Click vào 1 item** → điều hướng sang trang chi tiết (A.4.2), truyền `id` (MonthlyScheduleID).

### A.4.2. Trang chi tiết 1 tháng (gọi API A.2)

- **Header trang:** tên lớp, tháng/năm, chủ đề tháng, badge trạng thái duyệt hiện tại.
- **2 nút hành động ở đầu trang** (gọi API A.3):
  - Nút **"Duyệt"** (màu xanh) → gửi `approvedStatus: 1`.
  - Nút **"Từ chối"** (màu đỏ/outline) → gửi `approvedStatus: 0`.
  - Sau khi bấm, hiển thị toast xác nhận thành công, cập nhật lại badge trạng thái trên UI (không cần gọi lại GET, dùng optimistic update dựa theo giá trị vừa gửi).
  - Nếu tháng đã ở trạng thái đó rồi (vd đã "Đã duyệt" mà bấm "Duyệt" lần nữa), vẫn cho phép gọi lại bình thường (API là idempotent).
- **Nội dung chính — hiển thị theo tuần:**
  - Dùng **accordion hoặc tab**, mỗi tuần (`weeks[]`) là 1 accordion-item/tab, tiêu đề là `weekTheme` (vd "Tuần 1: Làm quen với biển cả").
  - Bên trong mỗi tuần: **bảng hoạt động theo ngày** (`items[]`), gợi ý layout dạng lịch tuần (cột = 7 ngày trong tuần T2→CN, hàng = khung giờ) hoặc bảng đơn giản với các cột: Giờ (`startTime`-`endTime`), Ngày (`dayOfWeek`, hiển thị tiếng Việt: Thứ Hai...Chủ Nhật), Tên hoạt động (`activityName`), Địa điểm (`location`), Loại hoạt động (`activityType`, có thể hiển thị icon tương ứng: 🚗 pickup, 🍽️ meal, 📚 study, 😴 nap, 🎨 play, 🚙 dropoff, 📌 other).
  - Nếu `details` (ghi chú thêm) khác `null`, hiển thị dạng tooltip hoặc dòng phụ nhỏ dưới tên hoạt động.
- **Trạng thái rỗng:** nếu `weeks` là mảng rỗng, hiển thị thông báo "Chưa có tuần nào được thiết lập cho tháng này".

---

# PHẦN B — Thực Đơn (Sidebar: "Thực đơn")

## B.1. GET `/principal/menus`

Lấy danh sách thực đơn theo tuần/lớp.

### Request

```
GET /principal/menus?classId=1&year=2026
Authorization: Bearer <token>
```

| Query param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `classId` | number | Không | Lọc theo lớp |
| `year` | number | Không | Lọc theo năm |
| `weekNumber` | number | Không | Lọc theo tuần (số tuần ISO trong năm) |

### Response `200 OK`

```json
{
  "success": true,
  "message": "Lấy danh sách thực đơn thành công",
  "data": [
    {
      "id": 1,
      "classId": 1,
      "className": "Mầm 1",
      "weekNumber": 32,
      "year": 2026,
      "menuName": "Thực đơn Tuần 32 - Ngày hè năng động (Mầm 1)",
      "createdAt": 1783745949,
      "updatedAt": 1783745949
    }
  ]
}
```

---

## B.2. GET `/principal/menus/{id}`

Lấy chi tiết 1 thực đơn — đủ 7 ngày x 3 bữa.

### Request

```
GET /principal/menus/1
Authorization: Bearer <token>
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Lấy chi tiết thực đơn thành công",
  "data": {
    "id": 1,
    "classId": 1,
    "className": "Mầm 1",
    "weekNumber": 32,
    "year": 2026,
    "menuName": "Thực đơn Tuần 32 - Ngày hè năng động (Mầm 1)",
    "createdAt": 1783745949,
    "updatedAt": 1783745949,
    "menuDetails": [
      {
        "id": 16,
        "menuId": 1,
        "dayOfWeek": "Monday",
        "mealType": "Breakfast",
        "dishName": "Bún bò Huế",
        "calories": 300,
        "nutritionalDetails": "Nước dùng đậm đà, bún dai sợi. Bổ sung sắt."
      }
    ]
  }
}
```

`menuDetails[]` đã sort sẵn theo thứ tự ngày (T2→CN) rồi loại bữa (Breakfast → Lunch → Snack). FE tự group theo `dayOfWeek` để hiển thị dạng bảng 7 ngày x 3 bữa.

### Error cases (B.1 và B.2)

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ (chỉ B.2) |
| 404 | Không tìm thấy thực đơn (chỉ B.2) |

---

## B.3. DELETE `/principal/menus/{id}`

Xóa 1 thực đơn. Toàn bộ `MenuDetails` liên quan tự động bị xóa theo (cascade).

**Vì sao cần API này:** ràng buộc `Unique_Class_Week_Year` (mục B.4) không cho phép import lại thực đơn cho cùng lớp/tuần/năm đã tồn tại — nếu bếp ăn gửi nhầm file hoặc cần thay thế toàn bộ thực đơn của 1 tuần, hiệu trưởng phải **xóa thực đơn cũ trước**, sau đó import lại file mới.

### Request

```
DELETE /principal/menus/1
Authorization: Bearer <token>
```

| Path param | Type | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | number | Có | `MenuID` cần xóa |

### Response `200 OK`

```json
{
  "success": true,
  "message": "Xóa thực đơn thành công",
  "data": null
}
```

### Error cases

| Status | Trường hợp |
|---|---|
| 400 | `id` không hợp lệ |
| 404 | Không tìm thấy thực đơn |

---

## B.4. POST `/principal/menus/import`

Import thực đơn từ **1 hoặc nhiều file CSV/XLSX** cùng lúc (nghiệp vụ: bếp ăn đưa file, hiệu trưởng duyệt rồi import).

### Định dạng file bắt buộc — layout 2 vùng

Mỗi file là **1 thực đơn tuần cho 1 lớp**, cấu trúc bắt buộc theo đúng thứ tự hàng sau (áp dụng cho cả `.csv` và `.xlsx`):

| Hàng | Nội dung |
|---|---|
| 1 | Header vùng thông tin: `ClassID,WeekNumber,Year,MenuName` |
| 2 | Dữ liệu vùng thông tin (đúng 1 hàng duy nhất) |
| 3 | **Để trống** (dòng phân cách bắt buộc) |
| 4 | Header vùng chi tiết: `DayOfWeek,MealType,DishName,Calories,NutritionalDetails` |
| 5+ | Dữ liệu chi tiết — mỗi hàng là 1 món ăn của 1 bữa trong 1 ngày |

**Ví dụ file hoàn chỉnh:**

```csv
ClassID,WeekNumber,Year,MenuName
1,32,2026,Thực đơn Tuần 32 - Ngày hè năng động (Mầm 1)

DayOfWeek,MealType,DishName,Calories,NutritionalDetails
Monday,Breakfast,Bún bò Huế,300,Nước dùng đậm đà bổ sung sắt
Monday,Lunch,Cơm gà xối mỡ,450,Giàu đạm và tinh bột
Monday,Snack,Sữa chua trái cây,150,Bổ sung lợi khuẩn
Tuesday,Breakfast,Phở bò,320,...
...
```

| Cột vùng thông tin | Bắt buộc | Kiểu | Ghi chú |
|---|---|---|---|
| `ClassID` | Có | integer | Phải khớp 1 lớp đang tồn tại |
| `WeekNumber` | Có | integer | Số tuần trong năm |
| `Year` | Có | integer | |
| `MenuName` | Không | string | Tên hiển thị của thực đơn |

| Cột vùng chi tiết | Bắt buộc | Kiểu | Ghi chú |
|---|---|---|---|
| `DayOfWeek` | Có | enum | `Monday`\|`Tuesday`\|`Wednesday`\|`Thursday`\|`Friday`\|`Saturday`\|`Sunday` |
| `MealType` | Có | enum | `Breakfast`\|`Lunch`\|`Snack` |
| `DishName` | Có | string | |
| `Calories` | Không | integer | |
| `NutritionalDetails` | Không | string | |

**Ràng buộc:** mỗi lớp chỉ có **1 thực đơn / 1 tuần / 1 năm** (`Unique_Class_Week_Year`) — nếu file có `ClassID`+`WeekNumber`+`Year` trùng với thực đơn đã tồn tại, file đó bị coi là lỗi (không ghi đè âm thầm).

### Request

```
POST /principal/menus/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [menu_mam1_tuan32.xlsx, menu_choi1_tuan32.xlsx, ...]  (field name: "files", tối đa 10 file)
```

### Response `201 Created` (tất cả file thành công)

```json
{
  "success": true,
  "message": "Import thực đơn thành công",
  "data": [
    { "filename": "menu_mam1_tuan32.xlsx", "success": true, "menuId": 14 },
    { "filename": "menu_choi1_tuan32.xlsx", "success": true, "menuId": 15 }
  ]
}
```

### Response `400 Bad Request` (có ít nhất 1 file lỗi — ⚠️ ALL-OR-NOTHING)

**Quan trọng:** nếu bất kỳ file nào trong lô lỗi (sai format, `ClassID` không tồn tại, hoặc trùng lớp/tuần/năm), **toàn bộ lô bị hủy** — kể cả các file hợp lệ khác cũng KHÔNG được lưu vào DB. Response luôn trả về mảng kết quả cho **từng file** để biết chính xác nguyên nhân:

```json
{
  "success": false,
  "message": "Import thất bại — xem chi tiết lỗi từng file",
  "data": [
    {
      "filename": "menu_mam1_tuan32.xlsx",
      "success": false,
      "message": "File \"menu_mam1_tuan32.xlsx\": đã tồn tại thực đơn cho lớp này ở tuần 32/2026"
    },
    {
      "filename": "menu_choi1_tuan32.xlsx",
      "success": false,
      "message": "Không được xử lý do lô import bị hủy (lỗi: File \"menu_mam1_tuan32.xlsx\": đã tồn tại thực đơn cho lớp này ở tuần 32/2026)"
    }
  ]
}
```

Lưu ý: file gây lỗi thật sự có `message` mô tả đúng nguyên nhân; các file khác (vốn hợp lệ) có `message` giải thích rằng chúng không được xử lý vì file khác trong cùng lô gây lỗi — **không phải bản thân chúng sai**.

### Error cases

| Status | Trường hợp |
|---|---|
| 400 | Không có file nào được upload, hoặc có ít nhất 1 file lỗi (xem chi tiết trong `data[]`) |
| 401 | Thiếu/token không hợp lệ |
| 403 | Không phải role hiệu trưởng |

---

## B.5. ⚠️ YÊU CẦU CÁC THÀNH PHẦN HIỂN THỊ UI — "Thực đơn"

### Sidebar

Thêm 1 item sidebar mới, tên **"Thực đơn"**, điều hướng tới trang danh sách (B.5.1).

### B.5.1. Trang danh sách Menu (gọi API B.1)

- **Bố cục:** bảng (table), các cột: Lớp (`className`), Tuần/Năm (`weekNumber`/`year`, format "Tuần 32/2026"), Tên thực đơn (`menuName`), Ngày cập nhật (`updatedAt`).
- **Bộ lọc phía trên bảng:** dropdown chọn lớp (`classId`), dropdown chọn năm (`year`), input/dropdown chọn tuần (`weekNumber`) — tất cả tùy chọn.
- **Nút "Nhập thực đơn"** ở góc trên bảng (nổi bật, màu chính) → mở **modal upload** (xem B.5.2).
- **Mỗi dòng có nút/icon "Xóa"** (gọi API B.3) — nên hiện dialog xác nhận trước khi xóa vì thao tác không thể hoàn tác, và cần nhắc rõ ràng buộc: muốn thay thế thực đơn, phải xóa bản cũ trước khi import bản mới cho cùng lớp/tuần/năm.
- **Click vào 1 dòng trong bảng** → điều hướng sang trang chi tiết (B.5.3), truyền `id` (MenuID).

### B.5.2. Modal "Nhập thực đơn" (gọi API B.4)

- **Vùng upload:** hỗ trợ **kéo-thả hoặc chọn nhiều file cùng lúc** (multi-file), chỉ nhận `.csv`/`.xlsx`, tối đa 10 file/lần.
- **Trước khi submit:** hiển thị danh sách file đã chọn (tên file, dung lượng), cho phép xóa bớt file khỏi danh sách trước khi upload.
- **Link tải file mẫu:** đặt sẵn nút/link "Tải file mẫu" để tải về 1 file `.xlsx` mẫu đúng layout 2 vùng ở mục B.4 (FE tự sinh file mẫu tĩnh, không cần gọi API — vì không có phần dropdown động nào ở đây, khác với file mẫu import học sinh).
- **Sau khi submit:**
  - Trong lúc chờ, hiển thị loading (có thể mất vài giây nếu file lớn).
  - **Nếu response thành công (`success: true` toàn bộ):** đóng modal, hiển thị toast "Đã import thành công N thực đơn", refresh lại danh sách (gọi lại B.1).
  - **Nếu response lỗi (`success: false`):** **giữ nguyên modal**, hiển thị danh sách kết quả từng file ngay trong modal — mỗi file 1 dòng với icon ✅/❌ tương ứng `success`, và dòng lỗi hiển thị đúng `message` trả về. Vì cơ chế all-or-nothing, cần ghi chú rõ trên UI: *"Do có file lỗi, toàn bộ lô import đã bị hủy — vui lòng sửa file lỗi và upload lại toàn bộ."* Cho phép người dùng bấm "Thử lại" để upload lại (giữ nguyên danh sách file đã chọn, không bắt chọn lại từ đầu nếu có thể).

### B.5.3. Trang chi tiết 1 Menu (gọi API B.2)

- **Header trang:** tên lớp, "Tuần {weekNumber}/{year}", tên thực đơn (`menuName`).
- **Nội dung chính:** bảng dạng lưới **7 cột (Thứ Hai → Chủ Nhật) x 3 hàng (Sáng/Trưa/Xế)**, hoặc ngược lại (7 hàng x 3 cột) — group `menuDetails[]` theo `dayOfWeek` rồi theo `mealType` ở phía FE.
- **Mỗi ô hiển thị:** tên món (`dishName`), calo (`calories`, nếu có — hiển thị dạng "300 kcal"), và `nutritionalDetails` hiển thị dạng tooltip hoặc text nhỏ bên dưới tên món khi hover/click.
- **Ô trống** (ngày/bữa không có món nào trong `menuDetails[]`): hiển thị "Chưa có thực đơn" hoặc để trống có viền nhạt.
- Trang này **chỉ xem, không có chức năng sửa trực tiếp** — muốn sửa thực đơn phải **xóa bản cũ** (nút "Xóa" ở B.3, hoặc đặt thêm nút "Xóa" ngay tại trang chi tiết này gọi cùng API B.3) rồi **import lại file mới** (B.4). Import lại trực tiếp cho tuần đã tồn tại sẽ luôn bị từ chối do ràng buộc unique.

---

## Error response format (chung cho toàn bộ endpoint ở tài liệu này)

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
