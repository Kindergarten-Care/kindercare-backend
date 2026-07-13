/**
 * @swagger
 * tags:
 *   name: TeacherWeeklySchedule
 *   description: Quản lý thời khóa biểu theo tháng/tuần của lớp (MonthlySchedule, WeeklySchedule, import CSV)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WeekMetaDto:
 *       type: object
 *       properties:
 *         weekOrder:
 *           type: integer
 *           example: 1
 *         startDate:
 *           type: string
 *           description: dd/MM
 *           example: "06/07"
 *         endDate:
 *           type: string
 *           description: dd/MM
 *           example: "10/07"
 *         label:
 *           type: string
 *           example: "Tuần 1 (06/07 - 10/07)"
 *     MonthlyScheduleDto:
 *       type: object
 *       nullable: true
 *       properties:
 *         monthlyScheduleId:
 *           type: integer
 *         classId:
 *           type: integer
 *         month:
 *           type: integer
 *         year:
 *           type: integer
 *         monthTheme:
 *           type: string
 *         createdAt:
 *           type: integer
 *           description: Epoch seconds
 *         updatedAt:
 *           type: integer
 *           description: Epoch seconds
 *     WeeklyScheduleItemDto:
 *       type: object
 *       properties:
 *         scheduleDetailId:
 *           type: integer
 *         weeklyScheduleId:
 *           type: integer
 *         dayOfWeek:
 *           type: string
 *           enum: [Monday, Tuesday, Wednesday, Thursday, Friday]
 *         startTime:
 *           type: string
 *           example: "08:00:00"
 *         endTime:
 *           type: string
 *           example: "09:00:00"
 *         activityName:
 *           type: string
 *         details:
 *           type: string
 *           nullable: true
 *         location:
 *           type: string
 *           nullable: true
 *         activityType:
 *           type: string
 *           enum: [pickup, meal, study, nap, play, dropoff, other]
 *     WeeklyScheduleDto:
 *       type: object
 *       properties:
 *         weeklyScheduleId:
 *           type: integer
 *         monthlyScheduleId:
 *           type: integer
 *         weekOrder:
 *           type: integer
 *         weekTheme:
 *           type: string
 *         createdAt:
 *           type: integer
 *           description: Epoch seconds
 *         updatedAt:
 *           type: integer
 *           description: Epoch seconds
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WeeklyScheduleItemDto'
 */

/**
 * @swagger
 * /teacher/classes/{classId}/monthly-schedule/weeks/{year}/{month}:
 *   get:
 *     summary: Lấy danh sách tuần (thứ 2 - thứ 6) trong một tháng
 *     tags: [TeacherWeeklySchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: year
 *         required: true
 *         schema: { type: integer, minimum: 2020, maximum: 2100 }
 *       - in: path
 *         name: month
 *         required: true
 *         schema: { type: integer, minimum: 1, maximum: 12 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/WeekMetaDto' }
 *       400: { description: Tham số không hợp lệ }
 */

/**
 * @swagger
 * /teacher/classes/{classId}/monthly-schedule/{year}/{month}:
 *   get:
 *     summary: Lấy thời khóa biểu của cả tháng (kèm tất cả các tuần và chi tiết)
 *     description: >
 *       Trả về 200 với monthlySchedule = null và weeks = [] nếu tháng đó chưa có dữ liệu.
 *     tags: [TeacherWeeklySchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: year
 *         required: true
 *         schema: { type: integer, minimum: 2020, maximum: 2100 }
 *       - in: path
 *         name: month
 *         required: true
 *         schema: { type: integer, minimum: 1, maximum: 12 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     monthlySchedule: { $ref: '#/components/schemas/MonthlyScheduleDto' }
 *                     weeks:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/WeeklyScheduleDto' }
 *                     weeksInMonth:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/WeekMetaDto' }
 *       400: { description: Tham số không hợp lệ }
 *       403: { description: Giáo viên không được phân công dạy lớp này }
 */

/**
 * @swagger
 * /teacher/classes/{classId}/monthly-schedule:
 *   post:
 *     summary: Tạo/cập nhật chủ đề tháng (MonthlySchedule) cho lớp
 *     tags: [TeacherWeeklySchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [month, year, monthTheme]
 *             properties:
 *               month: { type: integer, minimum: 1, maximum: 12 }
 *               year: { type: integer, minimum: 2020, maximum: 2100 }
 *               monthTheme: { type: string, maxLength: 255, example: "Chủ đề: Gia đình" }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     monthlyScheduleId: { type: integer }
 *                     action: { type: string, enum: [Created, Updated] }
 *       400: { description: Validation failed }
 *       403: { description: Giáo viên không được phân công dạy lớp này }
 */

/**
 * @swagger
 * /teacher/classes/{classId}/weekly-schedule:
 *   post:
 *     summary: Lưu (tạo/cập nhật) thời khóa biểu một tuần cùng danh sách hoạt động
 *     description: Chế độ replace - toàn bộ WeeklyScheduleDetails cũ của tuần này sẽ bị xóa và thay bằng `items` mới.
 *     tags: [TeacherWeeklySchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [monthlyScheduleId, weekOrder, weekTheme]
 *             properties:
 *               monthlyScheduleId: { type: integer }
 *               weekOrder: { type: integer, minimum: 1, maximum: 5 }
 *               weekTheme: { type: string, maxLength: 255, example: "Bé yêu động vật" }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [dayOfWeek, startTime, endTime, activityName]
 *                   properties:
 *                     dayOfWeek: { type: string, enum: [Monday, Tuesday, Wednesday, Thursday, Friday] }
 *                     startTime: { type: string, example: "08:00" }
 *                     endTime: { type: string, example: "09:00" }
 *                     activityName: { type: string, maxLength: 255 }
 *                     activityType:
 *                       type: string
 *                       enum: [pickup, meal, study, nap, play, dropoff, other]
 *                       default: other
 *                     details: { type: string, nullable: true }
 *                     location: { type: string, maxLength: 100, nullable: true }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     weeklyScheduleId: { type: integer }
 *                     action: { type: string, enum: [Created, Updated] }
 *       400: { description: Validation failed (vd endTime phải lớn hơn startTime) }
 *       403: { description: Giáo viên không được phân công dạy lớp này }
 */

/**
 * @swagger
 * /teacher/classes/{classId}/weekly-schedule/{wsId}:
 *   get:
 *     summary: Lấy chi tiết thời khóa biểu của một tuần theo WeeklyScheduleID
 *     tags: [TeacherWeeklySchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: wsId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/WeeklyScheduleDto' }
 *       400: { description: Tham số không hợp lệ }
 *       403: { description: Giáo viên không được phân công dạy lớp này }
 *       404: { description: Không tìm thấy thời khóa biểu tuần }
 *
 *   delete:
 *     summary: Xóa thời khóa biểu của một tuần (cascade xóa các hoạt động liên quan)
 *     tags: [TeacherWeeklySchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: wsId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     success: { type: boolean, example: true }
 *       400: { description: Tham số không hợp lệ }
 *       403: { description: Giáo viên không được phân công dạy lớp này }
 */

/**
 * @swagger
 * /teacher/classes/{classId}/weekly-schedule/preview-csv:
 *   post:
 *     summary: Xem trước dữ liệu từ file CSV thời khóa biểu (chưa lưu vào DB)
 *     description: |
 *       CSV header bắt buộc (không phân biệt hoa/thường): WeekOrder, DayOfWeek, StartTime, EndTime, ActivityName.
 *       Header tùy chọn: ActivityType, Details, Location.
 *     tags: [TeacherWeeklySchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File CSV (tối đa 5MB)
 *     responses:
 *       200:
 *         description: Parse CSV thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           weekOrder: { type: integer }
 *                           dayOfWeek: { type: string }
 *                           startTime: { type: string }
 *                           endTime: { type: string }
 *                           activityName: { type: string }
 *                           activityType: { type: string }
 *                           details: { type: string, nullable: true }
 *                           location: { type: string, nullable: true }
 *                     errors:
 *                       type: array
 *                       items: { type: string }
 *                       description: Danh sách lỗi theo từng dòng bị bỏ qua
 *                     byWeek:
 *                       type: object
 *                       description: Items được nhóm theo weekOrder (key là weekOrder dạng string)
 *                     totalRows:
 *                       type: integer
 *                       description: Số dòng hợp lệ đã parse được
 *       400: { description: Thiếu file / sai định dạng CSV / classId không hợp lệ }
 *       403: { description: Giáo viên không được phân công dạy lớp này }
 */

/**
 * @swagger
 * /teacher/classes/{classId}/weekly-schedule/import-csv:
 *   post:
 *     summary: Import file CSV và ghi thẳng vào thời khóa biểu (theo từng tuần)
 *     description: |
 *       Với mỗi WeekOrder xuất hiện trong CSV: nếu WeeklySchedule đã tồn tại thì replace toàn bộ
 *       WeeklyScheduleDetails cũ, nếu chưa có thì tự tạo mới WeeklySchedule (WeekTheme mặc định "Tuần {n}").
 *     tags: [TeacherWeeklySchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, monthlyScheduleId]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File CSV (tối đa 5MB)
 *               monthlyScheduleId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Import CSV thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: integer
 *                       description: Số dòng import thành công
 *                     failed:
 *                       type: integer
 *                       description: Số dòng lỗi/bị bỏ qua
 *                     errors:
 *                       type: array
 *                       items: { type: string }
 *       400: { description: Thiếu file / sai định dạng CSV / monthlyScheduleId không hợp lệ }
 *       403: { description: Giáo viên không được phân công dạy lớp này }
 */
