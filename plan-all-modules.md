# Plan: Thiết kế kết nối lại TOÀN BỘ API cho Teacher App (FE ↔ BE)

> **Mục đích**: Tổng hợp toàn bộ endpoint BE hiện có ở module Teacher, ánh xạ tới các màn hình thường gặp ở FE Teacher app, đề xuất **cách FE chỉnh cho khớp BE** (BE là nguồn), kèm cảnh báo về các lệch schema/enum/field đã biết và chỗ BE chưa có schema (FE cần đoán).
>
> **Phạm vi**: Tất cả module Teacher:
> 1. Dashboard, 2. Profile, 3. Work History, 4. Settings,
> 5. Leave Requests, 6. Classes (CRUD nhẹ), 7. Class Menu,
> 8. Class Schedule (Daily + Weekly), 9. Class Students,
> 10. Attendance (Quick + Meal + Activity + QR Scan), 11. Newsfeed,
> 12. Medical Requests, 13. Detailed Students,
> 14. Student Assessments (Phiếu bé ngoan), 15. Reward Badges,
> 16. Weekly Rewards, 17. Monthly Good Kids,
> 18. Lesson Plans, 19. Weekly Schedule Templates (monthly/weekly + CSV),
> 20. Health Module (Allergies / Medications / Logs / Assessments) — chi tiết đã có trong `plan.md` cũ, mình sẽ tóm tắt link.
>
> **Tài liệu liên quan**:
> - `plan.md` (đã có) — chi tiết module Health (Allergies / Medications / Logs / Assessments).
> - Swagger test: https://web-test.kindercare.app/api-docs/
> - Base path: `/teacher` (toàn bộ, không có `/api/teacher` — **NGOẠI TRỪ** đặc tả trong `teacher.docs.js` có dùng `/api/teacher/classes/{classId}/assessments` cho Assessments, nhưng code route thực tế lại là `/teacher/classes/{classId}/assessments` → BE Swagger có thể đang lệch với code, FE cần test trực tiếp để xác nhận).
>
> **Quy ước enum chuẩn hoá** (BE controller `teacher.controller.js` đang map VN↔EN, FE nên dùng EN để tránh rủi ro mapping):
>
> | Domain | Enum EN (FE nên gửi) | Enum VN (BE cũng chấp nhận, nhưng không khuyến nghị) |
> |---|---|---|
> | Attendance | `Present` / `Absent` / `Excused` | `Có mặt` / `Vắng`, `Vắng không phép` / `Phép`, `Vắng có phép` |
> | Leave status | `Pending` / `Approved` / `Rejected` | `Chờ duyệt` / `Đã duyệt` / `Không duyệt` |
> | Medical status | `Pending` / `Approved` / `Rejected` / `Completed` | `Chờ duyệt` / `Đã duyệt` / `Không duyệt` / `Đã hoàn thành` |
> | Schedule status | `Chưa diễn ra` / `Đang diễn ra` / `Xong` | (chỉ có 1 set tiếng Việt) |
> | Meal | `Ăn hết` / `Ăn chậm` / `Ăn ngoan` / `Không ăn` | (BE chỉ validate `eatingStatus` là string) |
> | Assessment month | `MM-YYYY` (vd `05-2026`) | (bắt buộc format này) |
> | Lesson plan status | `Draft`, `Submitted`, `UnderReview`, `Approved`, `Rejected`, `RevisionRequested` | (EN-only) |
> | Lesson day | `Monday`..`Saturday` | (EN-only) |
> | Lesson subject | `lang`, `math`, `art`, `music`, `world`, `phys`, `other` | (EN enum) |
>
> **Quy ước timestamp**: Tất cả date/time đều là **Unix timestamp (seconds)**, **không phải milliseconds**. Một số field `startTime` / `endTime` trong LessonPlanItems là chuỗi `"HH:mm:ss"`. Các field `createdAt`, `submittedAt`, `reviewedAt` của LessonPlan cũng là epoch seconds.

---

## 0. Tổng quan trạng thái theo module

> ✅ = endpoint hoạt động & FE nên dùng nguyên xi (chỉ cần tạo wrapper).
> ⚠️ = endpoint hoạt động nhưng có khác biệt schema/field FE cần chú ý.
> 🆕 = FE có UI nhưng BE chưa có endpoint (cần bổ sung — ngoài scope hiện tại, xem `plan.md` cũ).

| # | Module | BE endpoint chính | Trạng thái |
|---|---|---|---|
| 1 | Dashboard | `GET /teacher/dashboard` | ✅ |
| 2 | Profile | `GET/PUT /teacher/profile` | ✅ |
| 3 | Work History | `GET /teacher/work-history` | ✅ |
| 4 | Settings (thông báo) | `GET/PUT /teacher/settings` | ✅ |
| 5 | Leave Requests | `GET /teacher/leave-requests`, `GET /teacher/leave-requests/:id`, `PUT /teacher/leave-requests/:id/status` | ✅ |
| 6 | Classes | `GET /teacher/classes` | ✅ |
| 7 | Class Menu | `GET/PUT /teacher/classes/:classId/menu` | ✅ |
| 8 | Class Schedule | `GET /teacher/classes/:classId/schedule`, `GET /teacher/classes/:classId/schedule/weekly`, `PUT /teacher/classes/:classId/schedule/:scheduleId/status` | ✅ |
| 9 | Class Students (DS + điểm danh hôm nay) | `GET /teacher/classes/:classId/students` | ✅ |
| 10 | Attendance (quick/meal/activity) | `POST /teacher/attendance/quick`, `POST /teacher/attendance/meals`, `POST /teacher/attendance/activities` | ✅ |
| 11 | QR Scan | `POST /teacher/attendance/scan` | ✅ |
| 12 | Newsfeed | `POST /teacher/classes/:classId/newsfeed`, `GET /teacher/classes/:classId/newsfeed`, `DELETE /teacher/classes/:classId/newsfeed/:postId` | ✅ |
| 13 | Upload ảnh (newsfeed/daily album) | `POST /teacher/upload` (multipart `image`) | ✅ |
| 14 | Medical Requests (cũ) | `GET /teacher/classes/:classId/medical-requests`, `PUT /teacher/medical-requests/:requestId` | ⚠️ schema response thiếu (xem `plan.md`) |
| 15 | Detailed Students (cho tab Y tế) | `GET /teacher/classes/:classId/detailed-students` | ✅ |
| 16 | Student Assessments (Phiếu bé ngoan) | `POST/GET /teacher/assessments`, `GET/POST /teacher/classes/:classId/assessments` | ✅ (xem 1.16) |
| 16b | Development Assessments (Health) | `GET/PUT /teacher/classes/:classId/student-health/assessments` | ✅ (xem 1.16b) |
| 17 | Reward Badges | `GET /teacher/reward-badges` | ✅ |
| 18 | Monthly Good Kids | `GET /teacher/classes/:classId/monthly-good-kids?month&year` | ✅ |
| 19 | Weekly Rewards | `GET /teacher/classes/:classId/weekly-rewards?weekNumber&year`, `POST /teacher/classes/:classId/weekly-rewards` | ✅ |
| 20 | Lesson Plans | `GET/POST /teacher/lesson-plans`, `GET /teacher/lesson-plans/:id`, `POST /teacher/lesson-plans/:id/submit`, `POST /teacher/lesson-plans/:id/withdraw`, `PATCH /teacher/lesson-plans/:planId/items/:itemId/complete` | ✅ |
| 21 | Weekly Schedule Templates | `GET /teacher/classes/:classId/monthly-schedule/:year/:month`, `POST /teacher/classes/:classId/monthly-schedule`, `GET /teacher/classes/:classId/monthly-schedule/weeks/:year/:month`, `POST /teacher/classes/:classId/weekly-schedule`, `GET /teacher/classes/:classId/weekly-schedule/:wsId`, `DELETE /teacher/classes/:classId/weekly-schedule/:wsId`, `POST /teacher/classes/:classId/weekly-schedule/preview-csv`, `POST /teacher/classes/:classId/weekly-schedule/import-csv` | ✅ (FE chưa có module này — đây là khu để xây mới) |
| 22 | Health (Allergies/Medications/Logs/Assessments) | `GET/POST/PATCH/DELETE /teacher/classes/:classId/student-health/{allergies,medications,logs,assessments}` | 🆕 xem `plan.md` |

---

## 1. Ma trận endpoint BE ↔ UI FE Teacher (kèm cảnh báo)

> Mỗi dòng gồm: **Method + Path** · **Auth/Role** · **Request shape** · **Response shape** · **Cảnh báo FE cần biết**.

### 1.1. Dashboard
- `GET /teacher/dashboard` · Auth teacher
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "todayDate": 1784160000,
        "classes": [
          {
            "classId": 1,
            "className": "Mầm 1",
            "stats": {
              "totalStudents": 15,
              "attendance": { "present": 12, "absent": 1, "excused": 2, "noAttendance": 0 },
              "pendingLeavesCount": 1
            }
          }
        ]
      }
    }
    ```
  - ⚠️ Trường `attendance.*` và `pendingLeavesCount` ở camelCase, không phải snake_case.

### 1.2. Profile
- `GET /teacher/profile` · trả full profile (xem Swagger `teacher.docs.js:300-368`).
- `PUT /teacher/profile` · body:
  ```json
  { "fullName": "...", "phoneNumber": "...", "email": "...", "dateOfBirth": 642729600, "gender": "Nữ", "idCard": "...", "address": "...", "avatarUrl": "..." }
  ```
  - ⚠️ `dateOfBirth` là **epoch seconds** (không phải ISO).
  - ⚠️ `fullName` là bắt buộc.

### 1.3. Work History
- `GET /teacher/work-history` · response là mảng các object (xem service). FE cần dùng cho trang "Lịch sử công tác".

### 1.4. Settings
- `GET /teacher/settings`, `PUT /teacher/settings` · cấu hình nhận thông báo.

### 1.5. Leave Requests
- `GET /teacher/leave-requests?status=Pending` · `status` optional: `Pending|Approved|Rejected`.
- `GET /teacher/leave-requests/:requestId` · lấy chi tiết (kèm `parentPhone`, `parentName`, `studentAvatar`).
- `PUT /teacher/leave-requests/:requestId/status`
  - Body: `{ "status": "Approved" | "Rejected" | "Đã duyệt" | "Không duyệt" }`
  - ⚠️ **FE nên dùng EN** (`Approved` / `Rejected`) — VN sẽ bị map tự động, nhưng response trả về `status` EN.
  - BE có push notification cho parent khi duyệt/từ chối.
- Response chung có `leaveRequest: { requestId, status, ... }` hoặc null.

### 1.6. Classes
- `GET /teacher/classes` · trả `[{ classId, className, studentCount }]`.

### 1.7. Class Menu
- `GET /teacher/classes/:classId/menu?date=<seconds>` · response là array các bữa trong ngày.
- `PUT /teacher/classes/:classId/menu`
  - Body: `{ "date": 1784160000, "breakfastMenu": "...", "lunchMenu": "...", "afternoonSnackMenu": "..." }`
  - ⚠️ Cả 3 field menu đều **bắt buộc là string** (xem validation).

### 1.8. Class Schedule
- `GET /teacher/classes/:classId/schedule?date=<seconds>` · daily schedule.
  - `activityType` enum: `pickup|meal|study|nap|play|dropoff|other`.
  - `status` enum: `Chưa diễn ra|Đang diễn ra|Xong` (tiếng Việt, không có EN).
- `GET /teacher/classes/:classId/schedule/weekly?date=<seconds>` · lịch tuần.
- `PUT /teacher/classes/:classId/schedule/:scheduleId/status`
  - Body: `{ "completed": true | false }` → BE map sang `Xong` / `Chưa diễn ra`.

### 1.9. Class Students (DS + điểm danh hôm nay)
- `GET /teacher/classes/:classId/students?date=<seconds>`
  - Trả `[{ studentId, fullName, avatarUrl, status, checkInTime, checkOutTime, healthNote, leaveRequest: { requestId, status, reason } | null, hasProxy, proxyInfo: {...} | null }]`.
  - ⚠️ `status` là string nullable (Present/Absent/Excused hoặc null = chưa điểm danh).

### 1.10. Attendance (Quick / Meals / Activities)
- `POST /teacher/attendance/quick`
  ```json
  {
    "classId": 1,
    "date": 1784160000,            // optional, default = hôm nay
    "attendanceData": [
      { "studentId": 1, "status": "Present", "checkInTime": 1784187000, "checkOutTime": 1784221200, "pickedUpBy": "Nguyễn Anh Tuấn", "pickedUpByParentId": 4, "droppedOffByParentId": 4, "checkedInByTeacherId": 5, "proxyAuthorizationId": 12 }
    ]
  }
  ```
  - ⚠️ **BE ưu tiên `*ByParentId` (int) nếu có**, fallback về `*By` (string) — FE nên gửi cả 2 hoặc ưu tiên id.
  - BE push notification cho parent nếu Absent/Excused.
- `POST /teacher/attendance/meals`
  ```json
  { "classId": 1, "date": 1784160000, "mealData": [ { "studentId": 1, "breakfastStatus": "Ăn hết", "lunchStatus": "Ăn ngoan", "snackStatus": "Ăn hết", "teacherNote": "...", "photoUrl": "..." } ] }
  ```
- `POST /teacher/attendance/activities`
  ```json
  { "classId": 1, "date": 1784160000, "activityData": [ { "studentId": 1, "napStatus": "Ngủ ngon", "hygieneStatus": "Sạch sẽ", "activityStatus": "Vui", "teacherNote": "...", "photoUrl": "..." } ] }
  ```

### 1.11. QR Scan
- `POST /teacher/attendance/scan` · body `{ "qrToken": "eyJhbGciOi..." }`.
  - Response: `{ studentId, fullName, attendanceType: "checkin"|"checkout", hasProxy, proxyInfo: {...} }`.
  - 409 nếu mã đã dùng hoặc bé đã điểm danh đủ (checkin+checkout) trong ngày.

### 1.12. Newsfeed
- `POST /teacher/classes/:classId/newsfeed` · body `{ "content": "...", "mediaUrl": "https://..." }` · trả `{ postId }`.
  - ⚠️ `mediaUrl` là URL đã upload sẵn qua `/teacher/upload`. Nếu FE muốn upload ảnh/video → gọi upload trước, lấy `url` rồi mới gọi newsfeed.
- `GET /teacher/classes/:classId/newsfeed` · trả mảng bài đăng.
- `DELETE /teacher/classes/:classId/newsfeed/:postId`.

### 1.13. Upload ảnh
- `POST /teacher/upload` (multipart, field `image`)
  - Form fields tuỳ chọn: `date` (epoch seconds **hoặc** `"YYYY-MM-DD"`)
  - Response: `{ "url": "https://...", "folder": "daily-albums/album-YYYY-MM-DD" }`.

### 1.14. Medical Requests (cũ — sẽ chuyển sang module Health)
- `GET /teacher/classes/:classId/medical-requests?date=<seconds>`
- `PUT /teacher/medical-requests/:requestId`
  - Body: `{ "status": "Pending|Administered|Cancelled" /* EN, swagger */, "teacherNote": "..." }`
  - ⚠️ **Swagger ghi `Administered`/`Cancelled` nhưng validation hiện tại chỉ chấp nhận `Pending|Approved|Rejected|Completed|Đã hoàn thành|Chờ duyệt|Đã duyệt|Không duyệt`** → **lệch EN vs Swagger, FE ưu tiên dùng `Completed` (theo validation thực tế). Xem `plan.md` mục 2.1 để biết quyết định enum cuối cùng.**
- ⚠️ Response không có schema Swagger — chỉ dựa vào `plan.md` cũ (mục 2.2) để biết field.

### 1.15. Detailed Students
- `GET /teacher/classes/:classId/detailed-students`
  - Response: `{ classId, totalStudents, students: [...] }`.
  - Có thể có `allergies: string` (text) ở cấp student — **sẽ được thay thế** khi sang module Health.

### 1.16. Student Assessments (Phiếu bé ngoan)

**Có 2 endpoint sets — chọn 1 trong 2 cách dùng:**

**Cách 1 (Khuyến nghị — đúng spec FE 2026-07-10):**
- `GET /teacher/assessments?studentId=123`
  - Trả về lịch sử **6 tháng** gần nhất, dùng teacher's active class tự động
  - Response: mảng `AssessmentHistoryItem[]`
    ```json
    [
      {
        "assessmentId": 5,
        "studentId": 123,
        "month": "2026-07",
        "physicalScore": 8,
        "cognitiveScore": 9,
        "languageScore": 7,
        "emotionalScore": 8,
        "aestheticScore": 9,
        "lifeSkillsScore": 8,
        "notes": "Bé ngoan"
      }
    ]
    ```
- `POST /teacher/assessments` (upsert 1 record, từng học sinh)
  ```json
  {
    "classId": 1,
    "studentId": 123,
    "month": "2026-07",
    "physicalScore": 8,
    "cognitiveScore": 9,
    "languageScore": 7,
    "emotionalScore": 8,
    "aestheticScore": 9,
    "lifeSkillsScore": 8,
    "notes": "Bé ngoan"
  }
  ```
  - Format `month`: `YYYY-MM` (VD `2026-07`)
  - Score range: 1–10
  - Tự động push notification cho phụ huynh

**Cách 2 (batch cũ — legacy):**
- `GET /teacher/classes/:classId/assessments?month=MM-YYYY`
  - Response: `{ classId, month, students: [...] }`
- `POST /teacher/classes/:classId/assessments`
  - Body: `{ "month": "MM-YYYY", "assessments": [ { ... } ] }` (array)

**Các trường** (đúng spec FE):
- `physicalScore`, `cognitiveScore`, `languageScore` ✅
- `emotionalScore` ✅ (DB maps → `SocioEmotionalScore`)
- `aestheticScore` ✅ (DB maps → `AestheticScore`)
- `lifeSkillsScore` ✅ (DB maps → `LifeSkillsScore`)
- `notes` ✅ (DB maps → `TeacherComment`)

⚠️ **Bảng `StudentAssessments` cần column `LifeSkillsScore`** — kiểm tra và tạo migration nếu chưa có.

### 1.16b. Development Assessments (module Health — tab Y tế)

> **KHÁC** với Phiếu bé ngoan. Dùng bảng `developmentassessments`.

- `GET /teacher/classes/:classId/student-health/assessments?termPeriod=YYYY-MM`
  - Response: `{ data: { assessments: [ { studentId, name, avatarUrl, assessmentId, termPeriod, physicalScore, emotionalScore, socialScore, languageScore, cognitiveScore, overallNote, assessedBy } ] } }`
- `PUT /teacher/classes/:classId/student-health/assessments`
  ```json
  {
    "termPeriod": "2026-07",
    "items": [{
      "studentId": 123,
      "physicalScore": 5, "emotionalScore": 4, "socialScore": 5,
      "languageScore": 4, "cognitiveScore": 5,
      "overallNote": "Bé phát triển tốt"
    }]
  }
  ```
  - Score range: 0–5

### 1.17. Reward Badges
- `GET /teacher/reward-badges` · trả mảng huy hiệu (definition).

### 1.18. Monthly Good Kids (tự động)
- `GET /teacher/classes/:classId/monthly-good-kids?month=5&year=2026` · trả DS bé ngoan tháng.

### 1.19. Weekly Rewards
- `GET /teacher/classes/:classId/weekly-rewards?weekNumber=20&year=2026`
- `POST /teacher/classes/:classId/weekly-rewards`
  - Body: `{ "weekNumber": 20, "year": 2026, "awards": [ { "studentId": 1, "badgeId": 2, "note": "..." } ] }`

### 1.20. Lesson Plans
- `GET /teacher/lesson-plans?status=&classId=&year=`
- `GET /teacher/lesson-plans/:id`
- `POST /teacher/lesson-plans` · upsert (xem `LessonPlanUpsertRequest` trong `lessonPlan.docs.js`).
  - ⚠️ Path dùng `items[].dayOfWeek` (Monday..Saturday) và `items[].subject` (lang|math|art|music|world|phys|other).
- `POST /teacher/lesson-plans/:id/submit` · optional body `{ "note": "..." }`.
- `POST /teacher/lesson-plans/:id/withdraw`
- `PATCH /teacher/lesson-plans/:planId/items/:itemId/complete` · body `{ "isCompleted": true|false }`.
  - Status: `Draft|Submitted|UnderReview|Approved|Rejected|RevisionRequested`.

### 1.21. Weekly Schedule Templates (Monthly + Weekly + CSV)
- `GET /teacher/classes/:classId/monthly-schedule/weeks/:year/:month` · trả các tuần (weekStartDate, weekEndDate).
- `GET /teacher/classes/:classId/monthly-schedule/:year/:month` · full monthly schedule.
- `POST /teacher/classes/:classId/monthly-schedule` · upsert monthly.
- `POST /teacher/classes/:classId/weekly-schedule` · upsert weekly (replace).
- `GET /teacher/classes/:classId/weekly-schedule/:wsId`
- `DELETE /teacher/classes/:classId/weekly-schedule/:wsId`
- `POST /teacher/classes/:classId/weekly-schedule/preview-csv` (multipart `file`)
- `POST /teacher/classes/:classId/weekly-schedule/import-csv` (multipart `file`)

---

## 2. Những chỗ FE có thể "ngã ngựa" & cách phòng tránh

### 2.1. Ngã ở phân trang/kích thước response
- **Triệu chứng**: Một số endpoint (Dashboard, Class Students, Newsfeed) **không có `limit/offset`**. Với lớp > 50 học sinh hoặc lịch sử > 1000 bài đăng, payload có thể rất nặng.
- **Hành động FE**:
  1. **Bước 1 (bắt buộc)**: Check response thực tế trên test env, đo thời gian tải.
  2. **Bước 2 (nếu cần)**: Thêm lazy load / infinite scroll ở FE, hoặc filter `date` / `month` để giảm payload.
  3. **Bước 3 (nếu BE confirm cần)**: Tạo ticket yêu cầu BE thêm `?limit=&offset=` (ngoài scope plan này).

### 2.2. Ngã ở timestamp format
- **Triệu chứng**: Một số dev FE quen dùng **ISO string** (`"2026-05-15T00:00:00Z"`) hoặc **epoch milliseconds** → BE sẽ reject vì 400.
- **Quy tắc**: **LUÔN dùng epoch seconds (Unix timestamp)**. Nếu cần convert:
  ```ts
  // epoch seconds → Date
  new Date(unixSeconds * 1000)
  // Date → epoch seconds
  Math.floor(date.getTime() / 1000)
  ```
- **Ngoại lệ**: `startTime`/`endTime` trong LessonPlanItems là chuỗi `"HH:mm:ss"`.

### 2.3. Ngã ở enum sai locale
- **Triệu chứng**: BE có map VN↔EN cho Attendance/Leave/Medical, nhưng mapping chỉ một chiều và response trả về **EN**. FE hiển thị tiếng Việt cần map ngược ở client.
- **Khuyến nghị**:
  - Gửi **EN** lên BE.
  - Map EN→VI chỉ ở **lớp hiển thị (i18n)**, không hard-code ở service.

### 2.4. Ngã ở thiếu `classId` trong body (cho attendance)
- **Triệu chứng**: `POST /teacher/attendance/quick` cần `classId` **trong body**, không phải trong path. Nếu FE gửi `{attendanceData: [...]}` mà quên `classId` → 400.
- **Action**: Wrapper service FE phải luôn merge `classId` từ context.

### 2.5. Ngã ở `mediaUrl` cho newsfeed
- **Triệu chứng**: Newsfeed cần `mediaUrl` đã upload sẵn. Nếu FE gửi base64 hoặc form-data file → 400 (chỉ nhận string URL).
- **Action**: Tạo helper `uploadImageAndGetUrl(file)` ở FE gọi `/teacher/upload` trước rồi truyền URL cho newsfeed.

### 2.6. Ngã ở hai hệ thống Assessment — KHÔNG nhầm lẫn

- **Development Assessments** (bảng `developmentassessments`): dùng `/classes/:classId/student-health/assessments`, 5 fields, score 0–5
- **Student Assessments — Phiếu bé ngoan** (bảng `StudentAssessments`): dùng `/assessments`, 7 fields, score 1–10. Xem mục 1.16 và 1.16b chi tiết.

### 2.7. Ngã ở field `medicineImageURL` vs `medicineImageUrl` (case sensitivity)
- **Triệu chứng**: Parent API trả `medicineImageUrl` (lowercase 'rl'), Swagger Teacher ghi `medicineImageURL` (uppercase 'RL'). Backend thực tế có thể chỉ serialize theo 1 dạng.
- **Action**: Test bằng Postman/curl, normalize tên field khi map ở FE.

### 2.8. Ngã ở `termPeriod` (YYYY-MM) vs `month` format
- **Development Assessments**: dùng `termPeriod=YYYY-MM` (VD `2026-07`).
- **Student Assessments (Phiếu bé ngoan)**: dùng `month=YYYY-MM` (VD `2026-07`) — **cùng format** với Development Assessments.
- **Action**: Helper `toTermPeriod(date)` và `toMonthString(date)` riêng, **không hard-code**.

---

## 3. Kế hoạch triển khai (3 pha)

### Pha 1 — Audit & Lock baseline (1–2 ngày)
**Mục tiêu**: FE tự kiểm tra, khóa danh sách endpoint BE "chuẩn", không cần nhờ BE sửa gì.

1. **Bước 1.1** — Liệt kê toàn bộ API call hiện có ở FE:
   ```bash
   # Trong repo FE
   rg -n "api\.|\.get\(|\.post\(|\.put\(|\.patch\(|\.delete\(" apps/teacher/src/services
   ```
   Tạo bảng `services → endpoint đang gọi → endpoint BE đề xuất → mismatch?`.
2. **Bước 1.2** — Test từng endpoint bằng Postman/Insomnia với token teacher thật, ghi lại:
   - Path thực tế (đặc biệt `/api` prefix)
   - Response shape thực tế (copy JSON mẫu)
   - Status code lỗi thường gặp
3. **Bước 1.3** — So sánh với bảng ở mục 1 của plan này, đánh dấu:
   - ✅ Khớp → sang Pha 2.
   - ⚠️ Lệch → sang Pha 2 kèm cảnh báo.
   - 🆕 Thiếu → giữ nguyên UI, comment "chờ BE" (xem `plan.md` mục 2).

### Pha 2 — Tái cấu trúc service layer FE (3–5 ngày)
**Mục tiêu**: Tạo lớp service chuẩn, dùng chung cho mọi màn hình.

1. **Bước 2.1** — Tạo các file service mới trong `apps/teacher/src/services/teacher/` (1 file per module, đề xuất):
   ```
   services/teacher/
     apiClient.ts                # axios instance + baseURL + interceptor
     teacherDashboard.service.ts
     teacherProfile.service.ts
     teacherLeaveRequest.service.ts
     teacherClass.service.ts
     teacherClassMenu.service.ts
     teacherSchedule.service.ts
     teacherAttendance.service.ts
     teacherNewsfeed.service.ts
     teacherUpload.service.ts
     teacherMedicalRequest.service.ts
     teacherStudentAssessment.service.ts
     teacherReward.service.ts
     teacherLessonPlan.service.ts
     teacherWeeklySchedule.service.ts
     health/
       healthAllergy.service.ts
       healthMedication.service.ts
       healthLog.service.ts
       healthAssessment.service.ts
   ```
2. **Bước 2.2** — Mỗi service export:
   - Hàm `*Api(args)` gọi axios raw.
   - Hàm `*Mapper(raw)` convert BE DTO → FE Domain Model (chỗ nào BE trả field lạ, hoặc enum EN cần map VI).
   - Hàm `*Args(dto)` convert FE Domain → BE args.
   - **Không** throw exception raw — luôn trả về `{ success, data, error }` thống nhất.
3. **Bước 2.3** — Cập nhật view FE sử dụng service mới (sửa từng module, ưu tiên các module đang lỗi trước):
   - Ưu tiên 1: `MedicalRequest`, `Assessment` (đang có mismatch nặng nhất).
   - Ưu tiên 2: `Attendance`, `Menu` (volume lớn, dễ test).
   - Ưu tiên 3: `LessonPlan`, `WeeklySchedule` (module mới, nhiều màn).
4. **Bước 2.4** — Sửa `useTeacherClasses` + `useDetailedStudents` (hook) để expose đủ field mà Health module cần (`allergies` ở cấp student, hoặc tách sang `useClassAllergies`).

### Pha 3 — Kiểm thử & chốt (2–3 ngày)
1. **Bước 3.1** — Test E2E từng luồng chính:
   - Đăng nhập → Dashboard → chọn lớp → xem danh sách học sinh.
   - Điểm danh nhanh / bằng QR.
   - Tạo newsfeed có ảnh.
   - Duyệt đơn phép.
   - Nhập phiếu bé ngoan.
   - Tạo + submit + duyệt giáo án.
2. **Bước 3.2** — Test tải (load test) ở class có 30+ học sinh.
3. **Bước 3.3** — Test network offline/timeout/error → đảm bảo UI hiển thị error message rõ ràng.
4. **Bước 3.4** — Cập nhật README + JSDoc cho mỗi service (1 dòng mô tả "endpoint BE: GET /teacher/...").

---

## 4. Ma trận phân công đề xuất (1 FE lead + 1–2 FE member)

| Module | Endpoint count | Ưu tiên | Owner đề xuất | Ghi chú |
|---|---|---|---|---|
| 1 Dashboard | 1 | P2 | FE member A | Đơn giản |
| 2 Profile + Work History + Settings | 5 | P3 | FE member A | Ít thay đổi |
| 3 Leave Requests | 3 | P1 | FE member A | Enum mapping cẩn thận |
| 4 Classes + Menu + Schedule | 6 | P1 | FE member B | Lệch schema nhiều |
| 5 Attendance (Quick/Meals/Activity/QR) | 4 | P1 | FE member B | Ưu tiên cao, volume lớn |
| 6 Newsfeed + Upload | 4 | P2 | FE member B | Helper upload |
| 7 Medical Requests (cũ, sẽ dùng tạm) | 2 | P1 | FE member A | Xem `plan.md` mục 2.1 |
| 8 Student Assessments (Phiếu bé ngoan) | 2 | P1 | FE member A | Test path `/api/` vs `/` |
| 9 Reward Badges + Weekly/Monthly | 3 | P3 | FE member A | |
| 10 Lesson Plans | 6 | P2 | FE member B | Module phức tạp nhất, lên kế hoạch riêng |
| 11 Weekly Schedule Templates | 8 | P3 | FE member B | Module mới hoàn toàn — nên bắt đầu với PoC trước |
| 12 Health (Allergies/Medications/Logs/Assessments) | 13 | P1 | FE lead | Xem `plan.md` cũ |

> **P1** = làm ngay (đang lỗi/không dùng được), **P2** = trong sprint tới, **P3** = làm sau.

---

## 5. Deliverables (sau khi hoàn thành)

1. Repo FE có `apps/teacher/src/services/teacher/` chuẩn hoá (xem Pha 2).
2. Mỗi service có 1 file README ngắn (≤30 dòng) mô tả BE endpoint tương ứng.
3. Bảng `api-coverage.md` ở root repo FE ghi:
   - 100% màn hình Teacher có backend mapping.
   - 0 mismatch về path/method so với plan này.
4. Smoke test script (Playwright/Cypress) chạy được cho 6 luồng chính ở Pha 3.
5. **Không** thay đổi BE (theo yêu cầu "FE chỉnh theo BE"). Mọi vấn đề schema BE phát hiện thêm → mở ticket riêng, đưa vào backlog.

---

## 6. Những thứ cần bạn (FE lead / project owner) confirm trước khi code

1. **Endpoint `/api/teacher/...` vs `/teacher/...`**: Test thực tế trên test env xem endpoint Assessments đang chạy ở path nào.
2. **Enum Medical Request**: chốt 1 trong 2 phương án ở `plan.md` mục 2.1 (`Completed` vs `Administered`).
3. **Allergies module**: xác nhận thời điểm BE sẽ release module Health (xem `plan.md` mục 3.2) — FE có thể "stub" tạm trong lúc chờ.
4. **Phân trang**: xác nhận có cần BE bổ sung `?limit=&offset=` hay FE chấp nhận tải full.
5. **Thư mục FE repo**: Cho mình biết path để có thể tạo nhánh `feat/teacher-api-rewire` và gửi PR đúng chỗ.

---

## 7. Phiên bản tài liệu

- **Tạo**: 10/07/2026
- **Tác giả**: BE (đóng vai tròn đối chiếu), gửi FE team thực thi
- **BE base path**: `/teacher` (auth role 3)
- **Nguồn tham chiếu**:
  - `src/modules/teacher/teacher.route.js`
  - `src/modules/teacher/teacher.controller.js`
  - `src/modules/teacher/teacher.docs.js`
  - `src/modules/teacher/teacher.validation.js`
  - `src/modules/teacher/sub/health.route.js` + `health.controller.js`
  - `src/modules/teacher/sub/lessonPlan.docs.js`
  - `src/modules/teacher/sub/weeklySchedule.route.js`
  - `plan.md` (chi tiết module Health)
