# Plan: Hoàn thiện API Teacher — Backend Status & Remaining Tasks

> **Mục đích**: Tài liệu này ghi lại trạng thái hiện tại của tất cả endpoint Teacher trên branch `teacher-dashboard-apis`, đánh dấu đâu đã xong, đâu còn cần FE/bổ sung, và kế hoạch hoàn thiện còn lại.
>
> **Branch**: `teacher-dashboard-apis`
> **Đã merge vào**: `dev` (qua PR)
> **Cập nhật lần cuối**: 2026-07-10

---

## 1. Tổng quan trạng thái

| # | Module | Endpoint(s) | Trạng thái | Ghi chú |
|---|---|---|---|---|
| 1 | Dashboard | `GET /teacher/dashboard` | ✅ Xong | |
| 2 | My Class (active) | `GET /teacher/my-class` | ✅ Xong | Trả về lớp active duy nhất |
| 3 | Profile | `GET/PUT /teacher/profile` | ✅ Xong | |
| 4 | Work History | `GET /teacher/work-history` | ✅ Xong | |
| 5 | Settings | `GET/PUT /teacher/settings` | ✅ Xong | |
| 6 | Leave Requests | `GET /teacher/leave-requests`, `GET /:id`, `PUT /:id/status` | ✅ Xong | |
| 7 | Classes | `GET /teacher/classes` | ✅ Xong | |
| 8 | Class Menu | `GET/PUT /teacher/classes/:classId/menu` | ✅ Xong | |
| 9 | Class Schedule | `GET daily`, `GET weekly`, `PUT /:scheduleId/status` | ✅ Xong | |
| 10 | Class Students | `GET /teacher/classes/:classId/students` | ✅ Xong | |
| 11 | Attendance | `POST /quick`, `POST /meals`, `POST /activities`, `POST /scan` | ✅ Xong | |
| 12 | Newsfeed | `GET /POST /DELETE /teacher/classes/:classId/newsfeed` | ✅ Xong | |
| 13 | Upload | `POST /teacher/upload` | ✅ Xong | |
| 14 | Medical Requests | `GET /classes/:classId/medical-requests`, `PUT /medical-requests/:requestId` | ✅ Xong | Response thiếu schema |
| 15 | Detailed Students | `GET /teacher/classes/:classId/detailed-students` | ✅ Xong | |
| 16 | **Health: Allergies** | `GET/POST/PATCH/DELETE /classes/:classId/student-health/allergies` | ✅ Xong | CRUD đầy đủ |
| 17 | **Health: Medications** | `GET/POST/PATCH/status/DELETE /classes/:classId/student-health/medications` | ✅ Xong | |
| 18 | **Health: BMI (Logs)** | `GET/POST/PUT/PATCH/DELETE /classes/:classId/student-health/bmi` | ✅ Xong | `/logs` là alias tương thích |
| 19 | **Health: Development Assessments** | `GET/PUT /classes/:classId/student-health/assessments` | ✅ Xong | Đúng spec FE |
| 20 | **Student Assessments (Phiếu bé ngoan)** | `GET/POST /assessments?studentId=`, `POST /assessments` | ✅ Xong | Mới làm 2026-07-10 |
| 21 | Reward Badges | `GET /teacher/reward-badges` | ✅ Xong | |
| 22 | Monthly Good Kids | `GET /teacher/classes/:classId/monthly-good-kids` | ✅ Xong | |
| 23 | Weekly Rewards | `GET/POST /teacher/classes/:classId/weekly-rewards` | ✅ Xong | |
| 24 | Lesson Plans | `GET/POST /lesson-plans`, `POST /:id/submit`, `POST /:id/withdraw`, `PATCH /items/:itemId/complete` | ✅ Xong | |
| 25 | Weekly Schedule Templates | `GET/POST monthly`, `GET/POST/DELETE weekly`, `POST preview-csv`, `POST import-csv` | ✅ Xong | |
| 26 | Socket.io CORS | `IOCORS_ORIGIN`, `IOCORS_METHODS` env | ✅ Xong | 2026-07-10 |

**Tổng kết**: Tất cả endpoint BE đã được triển khai. Không còn endpoint nào thiếu.

---

## 2. Hai hệ thống Assessment — Phân biệt rõ ràng

### 2.1. Development Assessments (module Health)

> **Bảng**: `developmentassessments`
> **Đường dẫn**: `/teacher/classes/:classId/student-health/assessments`
> **Method**: `GET`, `PUT` (batch upsert)
> **Dùng cho**: Trang Y tế / Sức khỏe — tab Đánh giá phát triển

**FE request spec** (đã khớp):

```
PUT /teacher/classes/{classId}/student-health/assessments
Body: {
  termPeriod: "2026-07",
  items: [{
    studentId: 123,
    physicalScore: 5,      // 0-5
    emotionalScore: 4,     // 0-5
    socialScore: 5,        // 0-5
    languageScore: 4,      // 0-5
    cognitiveScore: 5,     // 0-5
    overallNote: "Bé phát triển tốt"
  }]
}
```

**FE response spec** (đã khớp):

```json
{
  "data": {
    "assessments": [{
      "studentId": 123,
      "name": "Nguyễn Văn A",
      "avatarUrl": "https://...",
      "assessmentId": 1,
      "termPeriod": "2026-07",
      "physicalScore": 5,
      "emotionalScore": 4,
      "socialScore": 5,
      "languageScore": 4,
      "cognitiveScore": 5,
      "overallNote": "Bé phát triển tốt",
      "assessedBy": 5
    }]
  }
}
```

**Lưu ý**: Đây là hệ thống 5 trụ cột (physical/emotional/social/language/cognitive), max 5 điểm — **khác** với Phiếu bé ngoan.

---

### 2.2. Student Assessments — Phiếu bé ngoan (teacher root)

> **Bảng**: `StudentAssessments`
> **Đường dẫn**: `/teacher/assessments` (root-level, không có classId trong path)
> **Method**: `POST` (upsert 1 record), `GET` (lấy 6 tháng history)
> **Dùng cho**: Trang Phiếu bé ngoan

**POST — Lưu đánh giá** (2026-07-10):

```
POST /teacher/assessments
Body: {
  classId: 1,              // từ body
  studentId: 123,
  month: "2026-07",        // YYYY-MM
  physicalScore: 8,        // 1-10
  cognitiveScore: 9,        // 1-10
  languageScore: 7,         // 1-10
  emotionalScore: 8,        // 1-10 (maps → SocioEmotionalScore in DB)
  aestheticScore: 9,        // 1-10
  lifeSkillsScore: 8,      // 1-10
  notes: "Bé ngoan"        // maps → TeacherComment in DB
}
Response: { success: true, message: "Lưu đánh giá thành công" }
```

**GET — Lấy lịch sử 6 tháng** (2026-07-10):

```
GET /teacher/assessments?studentId=123
Response: [
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
  },
  {
    "assessmentId": 2,
    "studentId": 123,
    "month": "2026-06",
    ...
  }
]
```

**Lưu ý**: Đây là hệ thống 7 trụ cột (physical/cognitive/language/emotional/aesthetic/lifeSkills), max 10 điểm — **khác** với Development Assessments.

---

### 2.3. Giữ nguyên route cũ (batch)

Route cũ vẫn hoạt động để tương thích ngược:

```
GET  /teacher/classes/:classId/assessments?month=MM-YYYY
POST /teacher/classes/:classId/assessments (batch — assessments array)
```

---

## 3. Các việc còn lại (Backend chưa làm)

### 3.1. Database Migration — BMI columns

**File**: `src/modules/teacher/sub/health.bmi.migration.sql`

Chạy migration này trong MySQL để thêm columns mới vào bảng `HealthRecords`:

```sql
ALTER TABLE `HealthRecords`
  ADD COLUMN `MeasuredAt`  bigint      NULL,
  ADD COLUMN `IsLatest`    tinyint(1)  NOT NULL DEFAULT 1,
  ADD COLUMN `RecordedBy`  int         NULL,
  ADD COLUMN `UpdatedBy`   int         NULL,
  ADD COLUMN `CreatedAt`   bigint      NOT NULL DEFAULT (unix_timestamp()),
  ADD COLUMN `UpdatedAt`   bigint      NOT NULL DEFAULT (unix_timestamp()),
  ADD KEY `idx_hr_student_term_latest` (`StudentID`, `TermPeriod`, `IsLatest`),
  ADD KEY `idx_hr_recorded_by`         (`RecordedBy`),
  ADD KEY `idx_hr_updated_by`          (`UpdatedBy`);

UPDATE `HealthRecords` SET `IsLatest` = 1 WHERE `IsLatest` <> 1 OR `IsLatest` IS NULL;
```

**Action**: Chạy thủ công trong phpMyAdmin hoặc mysql CLI.

### 3.2. Database Migration — StudentAssessments LifeSkillsScore

Kiểm tra bảng `StudentAssessments` có column `LifeSkillsScore` chưa. Nếu chưa, cần migration:

```sql
ALTER TABLE `StudentAssessments`
  ADD COLUMN `LifeSkillsScore` tinyint NULL DEFAULT NULL COMMENT 'Điểm kỹ năng sống 1-10';
```

**Action**: Kiểm tra bằng `DESCRIBE StudentAssessments;` rồi tạo migration nếu cần.

### 3.3. Tạo PR vào `dev`

Branch `teacher-dashboard-apis` đã push. GitHub CLI chưa cài nên chưa tạo PR được.

**Action**: Cài `gh` (`winget install GitHub.CLI`) hoặc tạo PR thủ công trên GitHub.

---

## 4. Socket.io CORS Config

File: `src/config/socket.js` (đã cập nhật 2026-07-10)

**Env variables mới**:

| Variable | Default | Mô tả |
|---|---|---|
| `IOCORS_ORIGIN` | `*` | Allowed origins (comma-separated) |
| `IOCORS_METHODS` | `GET,POST` | Allowed methods |

```bash
# .env
IOCORS_ORIGIN=https://kindercare.app,https://admin.kindercare.app
IOCORS_METHODS=GET,POST
```

---

## 5. Cấu trúc file Backend (Teacher Module)

```
src/modules/teacher/
├── teacher.route.js              # Main router (/teacher/*)
├── teacher.controller.js         # Logic endpoints chính
├── teacher.service.js            # DB queries chính
├── teacher.validation.js        # Request validation
├── teacher.docs.js              # Swagger docs
└── sub/
    ├── health.route.js          # /classes/:classId/student-health/*
    ├── health.controller.js     # Allergies, Medications, BMI, Assessments
    ├── health.service.js        # Health DB queries
    ├── health.validation.js      # Health request validation
    ├── health.bmi.service.js    # BMI measurement logic
    ├── health.bmi.docs.js      # BMI Swagger docs
    ├── health.bmi.migration.sql # DB migration cho BMI columns
    ├── lessonPlan.route.js
    ├── lessonPlan.controller.js
    ├── lessonPlan.service.js
    ├── lessonPlan.validation.js
    ├── lessonPlan.docs.js
    ├── weeklySchedule.route.js
    ├── weeklySchedule.controller.js
    ├── weeklySchedule.service.js
    └── weeklySchedule.validation.js
```

---

## 6. Những thứ FE cần lưu ý

### 6.1. Hai hệ thống Assessment — KHÔNG nhầm lẫn

| | Development Assessments | Student Assessments (Phiếu bé ngoan) |
|---|---|---|
| **URL** | `/classes/:classId/student-health/assessments` | `/assessments` |
| **Điểm max** | 5 | 10 |
| **Fields** | `physicalScore`, `emotionalScore`, `socialScore`, `languageScore`, `cognitiveScore`, `overallNote` | `physicalScore`, `cognitiveScore`, `languageScore`, `emotionalScore`, `aestheticScore`, `lifeSkillsScore`, `notes` |
| **Module** | Health/Y tế | Phiếu bé ngoan |

### 6.2. Month format

- **Development Assessments**: `termPeriod` = `YYYY-MM` (VD `2026-07`)
- **Student Assessments (Phiếu bé ngoan)**: `month` = `YYYY-MM` (VD `2026-07`)
- **Class Schedule/Attendance cũ**: `date` = epoch seconds

### 6.3. Các env cần set trên production

```
# .env
IOCORS_ORIGIN=https://kindercare.app
IOCORS_METHODS=GET,POST
CLIENT_URL=https://kindercare.app
JWT_SECRET=...
DB_HOST=...
```

---

## 7. Checklist trước khi deploy

- [ ] Chạy BMI migration trong MySQL
- [ ] Kiểm tra `StudentAssessments` có `LifeSkillsScore` column
- [ ] Set `IOCORS_ORIGIN` env trên server
- [ ] Tạo PR vào `dev` và merge
- [ ] Test thực tế trên test env:
  - [ ] `GET /teacher/my-class`
  - [ ] `GET /teacher/assessments?studentId=123`
  - [ ] `POST /teacher/assessments`
  - [ ] `GET /teacher/classes/:classId/student-health/assessments`
  - [ ] `PUT /teacher/classes/:classId/student-health/assessments`
  - [ ] Health Allergies CRUD
  - [ ] Health Medications CRUD
  - [ ] Health BMI CRUD

---

## 8. Phiên bản tài liệu

- **Tạo**: 10/07/2026
- **Branch**: `teacher-dashboard-apis`
- **Cập nhật**: 2026-07-10 — thêm Student Assessments (Phiếu bé ngoan), Socket.io CORS
