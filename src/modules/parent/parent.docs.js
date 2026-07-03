// ─────────────────────────────────────────────────────────────
//  TAG DEFINITIONS
// ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   - name: "Parent - Profile"
 *     description: "Parent own profile and children overview"
 *   - name: "Parent - Child Info"
 *     description: "Detailed info of a specific child (profile, health, assessments, attendance, daily activities)"
 *   - name: "Parent - Classroom"
 *     description: "Class-level content: schedule, lessons, albums, newsfeeds, menu"
 *   - name: "Parent - Requests"
 *     description: "Leave requests and medication requests"
 *   - name: "Parent - Authorizations"
 *     description: "Proxy pickup/drop-off authorizations and QR attendance token"
 */

// ─────────────────────────────────────────────────────────────
//  GROUP 1 · Parent - Profile
//  GET  /parent/profile
//  PATCH /parent/profile
//  GET  /parent/children
// ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /parent/profile:
 *   get:
 *     summary: Get own profile
 *     description: Retrieve the full profile of the currently authenticated parent.
 *     tags: ["Parent - Profile"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved parent profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy thông tin phụ huynh thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     parentId:
 *                       type: integer
 *                       example: 4
 *                     fullName:
 *                       type: string
 *                       example: Nguyễn Anh Tuấn
 *                     dateOfBirth:
 *                       type: integer
 *                       nullable: true
 *                       description: Unix timestamp (seconds)
 *                       example: 631584000
 *                     phoneNumber:
 *                       type: string
 *                       example: 0911111111
 *                     email:
 *                       type: string
 *                       nullable: true
 *                       example: tuan.nguyen@gmail.com
 *                     idCard:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     job:
 *                       type: string
 *                       nullable: true
 *                       example: Kỹ sư
 *                     address:
 *                       type: string
 *                       nullable: true
 *                       example: 65 Huỳnh Thúc Kháng, Q1
 *                     avatarUrl:
 *                       type: string
 *                       nullable: true
 *                       example: https://media.kindercare.app/Avatar/Parent%20Avatar/avatar.jpg
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent
 *       404:
 *         description: Not Found - parent profile not found
 *       500:
 *         description: Internal Server Error
 *   patch:
 *     summary: Update own profile
 *     description: Update one or more fields of the authenticated parent's profile. All body fields are optional. Send as multipart/form-data when uploading an avatar image.
 *     tags: ["Parent - Profile"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyễn Anh Tuấn
 *               dateOfBirth:
 *                 type: integer
 *                 description: Unix timestamp (seconds)
 *                 example: 631584000
 *               phoneNumber:
 *                 type: string
 *                 example: 0911111111
 *               email:
 *                 type: string
 *                 example: tuan.nguyen@gmail.com
 *               idCard:
 *                 type: string
 *                 example: 079090001234
 *               job:
 *                 type: string
 *                 example: Kỹ sư
 *               address:
 *                 type: string
 *                 example: 65 Huỳnh Thúc Kháng, Q1
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image (jpg, jpeg, png, webp, gif — max 5 MB)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Cập nhật thông tin phụ huynh thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     parentId:
 *                       type: integer
 *                       example: 4
 *                     fullName:
 *                       type: string
 *                       example: Nguyễn Anh Tuấn
 *                     dateOfBirth:
 *                       type: integer
 *                       nullable: true
 *                       description: Unix timestamp (seconds)
 *                       example: 631584000
 *                     phoneNumber:
 *                       type: string
 *                       example: 0911111111
 *                     email:
 *                       type: string
 *                       nullable: true
 *                       example: tuan.nguyen@gmail.com
 *                     idCard:
 *                       type: string
 *                       nullable: true
 *                       example: 079090001234
 *                     job:
 *                       type: string
 *                       nullable: true
 *                       example: Kỹ sư
 *                     address:
 *                       type: string
 *                       nullable: true
 *                       example: 65 Huỳnh Thúc Kháng, Q1
 *                     avatarUrl:
 *                       type: string
 *                       nullable: true
 *                       example: https://media.kindercare.app/parents/parents-profile-avatar/1782901725329-816008711.jpg
 *       400:
 *         description: Bad Request - no fields provided or invalid file type
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children:
 *   get:
 *     summary: Get all children of the logged-in parent
 *     description: Retrieve a list of all children linked to the authenticated parent, including class, campus, building, grade, and teacher details.
 *     tags: ["Parent - Profile"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved children list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách con thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentId:
 *                         type: integer
 *                         example: 1
 *                       fullName:
 *                         type: string
 *                         example: Nguyễn Minh Khang
 *                       dateOfBirth:
 *                         type: integer
 *                         example: 1684108800
 *                       gender:
 *                         type: string
 *                         example: Nam
 *                       allergies:
 *                         type: string
 *                         nullable: true
 *                         example: Dị ứng lạc
 *                       admissionDate:
 *                         type: integer
 *                         nullable: true
 *                         example: 1781359832
 *                       enrollmentStatus:
 *                         type: string
 *                         example: Active
 *                       avatarUrl:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       classId:
 *                         type: integer
 *                         example: 1
 *                       className:
 *                         type: string
 *                         example: Mầm 1
 *                       gradeName:
 *                         type: string
 *                         example: Mầm
 *                       academicYearName:
 *                         type: string
 *                         example: Niên khóa 2026-2027
 *                       buildingId:
 *                         type: integer
 *                         example: 1
 *                       buildingName:
 *                         type: string
 *                         example: Tòa A (Khối Mầm)
 *                       campusId:
 *                         type: integer
 *                         example: 1
 *                       campusName:
 *                         type: string
 *                         example: Cơ sở 1 - Quận 1
 *                       campusAddress:
 *                         type: string
 *                         example: 65 Huỳnh Thúc Kháng, Bến Nghé, Q1
 *                       relationship:
 *                         type: string
 *                         example: Ba
 *                       isPrimary:
 *                         type: integer
 *                         example: 1
 *                       teachers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             teacherId:
 *                               type: integer
 *                               example: 3
 *                             fullName:
 *                               type: string
 *                               example: Nguyễn Thị Lan
 *                             phoneNumber:
 *                               type: string
 *                               example: 0901234567
 *                             email:
 *                               type: string
 *                               example: lan.nguyen@kindercare.edu.vn
 *                             gender:
 *                               type: string
 *                               example: Nữ
 *                             roleInClass:
 *                               type: string
 *                               example: Giáo viên trưởng
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/change-password:
 *   patch:
 *     summary: Change own password
 *     description: Change the password of the authenticated parent. Requires the current password for verification.
 *     tags: ["Parent - Profile"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The parent's current password
 *                 example: OldPass123
 *               newPassword:
 *                 type: string
 *                 description: New password (minimum 6 characters, must differ from current)
 *                 example: NewPass456
 *               confirmNewPassword:
 *                 type: string
 *                 description: Must match newPassword exactly
 *                 example: NewPass456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Đổi mật khẩu thành công
 *                 data:
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: "Bad Request — one of: missing fields | mật khẩu xác nhận không khớp | mật khẩu mới < 6 ký tự | mật khẩu mới trùng mật khẩu cũ | mật khẩu hiện tại sai"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent
 *       404:
 *         description: Not Found - account not found
 *       500:
 *         description: Internal Server Error
 */

// ─────────────────────────────────────────────────────────────
//  GROUP 2 · Parent - Child Info
//  GET  /parent/children/{studentId}
//  GET  /parent/children/{studentId}/relatives
//  GET  /parent/children/{studentId}/health-records
//  GET  /parent/children/{studentId}/assessments
//  GET  /parent/children/{studentId}/attendance
//  GET  /parent/children/{studentId}/daily-activities
// ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /parent/children/{studentId}:
 *   get:
 *     summary: Get detailed info of a single child
 *     description: Retrieve full details of a specific child belonging to the authenticated parent, including class, grade, campus, building and teacher list.
 *     tags: ["Parent - Child Info"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved student detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy thông tin học sinh thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     studentId:
 *                       type: integer
 *                       example: 1
 *                     fullName:
 *                       type: string
 *                       example: Nguyễn Minh Khang
 *                     dateOfBirth:
 *                       type: integer
 *                       example: 1684108800
 *                     gender:
 *                       type: string
 *                       example: Nam
 *                     allergies:
 *                       type: string
 *                       nullable: true
 *                       example: Dị ứng lạc
 *                     admissionDate:
 *                       type: integer
 *                       nullable: true
 *                       example: 1781082000
 *                     enrollmentStatus:
 *                       type: string
 *                       example: Active
 *                     avatarUrl:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     classId:
 *                       type: integer
 *                       example: 1
 *                     className:
 *                       type: string
 *                       example: Mầm 1
 *                     gradeId:
 *                       type: integer
 *                       example: 1
 *                     gradeName:
 *                       type: string
 *                       example: Mầm
 *                     academicYearId:
 *                       type: integer
 *                       example: 1
 *                     academicYearName:
 *                       type: string
 *                       example: Niên khóa 2026-2027
 *                     buildingId:
 *                       type: integer
 *                       example: 1
 *                     buildingName:
 *                       type: string
 *                       example: Tòa A (Khối Mầm)
 *                     campusId:
 *                       type: integer
 *                       example: 1
 *                     campusName:
 *                       type: string
 *                       example: Cơ sở 1 - Quận 1
 *                     campusAddress:
 *                       type: string
 *                       example: 65 Huỳnh Thúc Kháng, Bến Nghé, Q1
 *                     teachers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           teacherId:
 *                             type: integer
 *                             example: 16
 *                           fullName:
 *                             type: string
 *                             example: Trần Hoàng Anh
 *                           phoneNumber:
 *                             type: string
 *                             example: 0977111222
 *                           email:
 *                             type: string
 *                             example: hoanganh.tran@kindercare.edu.vn
 *                           gender:
 *                             type: string
 *                             example: Nữ
 *                           roleInClass:
 *                             type: string
 *                             example: Giáo viên trưởng
 *       400:
 *         description: Bad Request - studentId is not a valid number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - student does not belong to the logged-in parent
 *       404:
 *         description: Not Found - student not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/relatives:
 *   get:
 *     summary: Get relatives (guardians) of a child
 *     description: Retrieve all parents/guardians linked to a specific child. Only accessible by a parent already associated with that child. Primary contact is listed first.
 *     tags: ["Parent - Child Info"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved relatives list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách người thân của học sinh thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       parentId:
 *                         type: integer
 *                         example: 17
 *                       fullName:
 *                         type: string
 *                         example: Lê Minh Tuấn
 *                       dateOfBirth:
 *                         type: integer
 *                         nullable: true
 *                         description: Unix timestamp (seconds)
 *                         example: 631584000
 *                       phoneNumber:
 *                         type: string
 *                         example: 0988777666
 *                       email:
 *                         type: string
 *                         nullable: true
 *                         example: minhtuan.le@gmail.com
 *                       idCard:
 *                         type: string
 *                         nullable: true
 *                         example: 079088001234
 *                       job:
 *                         type: string
 *                         nullable: true
 *                         example: Kiến trúc sư
 *                       address:
 *                         type: string
 *                         nullable: true
 *                         example: 102 Nguyễn Đình Chiểu, Quận 3, TP.HCM
 *                       avatarUrl:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       relationship:
 *                         type: string
 *                         example: Ba
 *                       isPrimary:
 *                         type: integer
 *                         description: "1 = primary contact, 0 = secondary"
 *                         example: 1
 *       400:
 *         description: Bad Request - studentId is not a valid number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - student does not belong to the logged-in parent
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/weekly-timetable:
 *   get:
 *     summary: Get weekly timetable and themes for a child's class
 *     description: Retrieve the monthly theme, weekly theme, and full weekly schedule details (lessons/activities) for the class of a given student. Defaults to the current date if not specified. Only accessible by parents associated with the child.
 *     tags: ["Parent - Child Info"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 1
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Unix timestamp in seconds to specify a custom target date
 *         example: 1783008683
 *     responses:
 *       200:
 *         description: Successfully retrieved weekly timetable and themes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy thời khóa biểu tuần của học sinh thành công
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     monthlyScheduleId:
 *                       type: integer
 *                       example: 1
 *                     month:
 *                       type: integer
 *                       example: 10
 *                     year:
 *                       type: integer
 *                       example: 2026
 *                     monthTheme:
 *                       type: string
 *                       example: "Vòng Tay Gia Đình & Lễ Hội Sắc Màu"
 *                     weeklyScheduleId:
 *                       type: integer
 *                       example: 1
 *                     weekOrder:
 *                       type: integer
 *                       example: 1
 *                     weekTheme:
 *                       type: string
 *                       example: "Tuần 1: Tổ ấm của bé (Yêu thương gia đình)"
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           scheduleDetailId:
 *                             type: integer
 *                             example: 1
 *                           dayOfWeek:
 *                             type: string
 *                             enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                             example: Monday
 *                           startTime:
 *                             type: string
 *                             example: "09:00:00"
 *                           endTime:
 *                             type: string
 *                             example: "10:15:00"
 *                           activityName:
 *                             type: string
 *                             example: "Vẽ tranh ngôi nhà"
 *                           details:
 *                             type: string
 *                             nullable: true
 *                             example: "Bé vẽ và tô màu ngôi nhà của mình"
 *                           location:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                           activityType:
 *                             type: string
 *                             enum: [pickup, meal, study, nap, play, dropoff, other]
 *                             example: study
 *       400:
 *         description: Bad Request - invalid studentId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - student does not belong to the logged-in parent
 *       404:
 *         description: Not Found - student not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/health-records:
 *   get:
 *     summary: Get health records of a child
 *     description: Retrieve all developmental health records (height, weight, BMI by term period) of a child. Only accessible by parents associated with the child.
 *     tags: ["Parent - Child Info"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 19
 *     responses:
 *       200:
 *         description: Successfully retrieved health records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách chỉ số sức khỏe của bé thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       recordId:
 *                         type: integer
 *                         example: 1
 *                       studentId:
 *                         type: integer
 *                         example: 19
 *                       termPeriod:
 *                         type: string
 *                         example: 2026-04
 *                       height:
 *                         type: string
 *                         example: "130.00"
 *                       weight:
 *                         type: string
 *                         example: "28.00"
 *                       bmi:
 *                         type: string
 *                         example: "16.60"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/assessments:
 *   get:
 *     summary: Get assessments of a child
 *     description: Retrieve monthly assessment scores (physical, cognitive, language, social-emotional, aesthetic) and teacher comments. Filter by month using the optional `month` query param.
 *     tags: ["Parent - Child Info"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 19
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: string
 *           pattern: '^(0[1-9]|1[0-2])-\d{4}$'
 *         description: "Month filter in MM-YYYY format (e.g. 06-2026)"
 *         example: 06-2026
 *     responses:
 *       200:
 *         description: Successfully retrieved assessments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách đánh giá của bé thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       assessmentId:
 *                         type: integer
 *                         example: 1
 *                       studentId:
 *                         type: integer
 *                         example: 19
 *                       assessmentMonth:
 *                         type: string
 *                         example: 06-2026
 *                       physicalScore:
 *                         type: integer
 *                         nullable: true
 *                         example: 5
 *                       cognitiveScore:
 *                         type: integer
 *                         nullable: true
 *                         example: 4
 *                       languageScore:
 *                         type: integer
 *                         nullable: true
 *                         example: 5
 *                       socioEmotionalScore:
 *                         type: integer
 *                         nullable: true
 *                         example: 4
 *                       aestheticScore:
 *                         type: integer
 *                         nullable: true
 *                         example: 5
 *                       teacherComment:
 *                         type: string
 *                         nullable: true
 *                         example: Bé tham gia hoạt động hăng hái và phát triển tốt các kỹ năng.
 *                       createdAt:
 *                         type: integer
 *                         example: 1781740800
 *       400:
 *         description: Bad Request - invalid studentId or month format (expected MM-YYYY)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/attendance:
 *   get:
 *     summary: Get attendance records of a child
 *     description: Retrieve attendance history (check-in/out times, status, who dropped off / picked up) of a child. Supports optional date range filters.
 *     tags: ["Parent - Child Info"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 19
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: integer
 *         description: Start date filter as Unix timestamp (seconds)
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: integer
 *         description: End date filter as Unix timestamp (seconds)
 *     responses:
 *       200:
 *         description: Successfully retrieved attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy thông tin điểm danh của bé thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       attendanceId:
 *                         type: integer
 *                         example: 1
 *                       studentId:
 *                         type: integer
 *                         example: 19
 *                       attendanceDate:
 *                         type: integer
 *                         example: 1778803200
 *                       status:
 *                         type: string
 *                         example: Present
 *                       checkInTime:
 *                         type: integer
 *                         nullable: true
 *                         example: 1778830200
 *                       checkOutTime:
 *                         type: integer
 *                         nullable: true
 *                         example: 1778862600
 *                       droppedOffBy:
 *                         type: string
 *                         nullable: true
 *                         example: Bố
 *                       droppedOffAvatarUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://media.kindercare.app/parents/avatar.png
 *                       pickedUpBy:
 *                         type: string
 *                         nullable: true
 *                         example: Bà nội
 *                       pickedUpAvatarUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://media.kindercare.app/proxy/avatar.png
 *                       checkedInByTeacherId:
 *                         type: integer
 *                         nullable: true
 *                         example: 5
 *                       checkedOutByTeacherId:
 *                         type: integer
 *                         nullable: true
 *                         example: 5
 *                       proxyAuthorizationId:
 *                         type: integer
 *                         nullable: true
 *                         example: 12
 *       400:
 *         description: Bad Request - invalid parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/daily-activities:
 *   get:
 *     summary: Get daily activity log of a child
 *     description: Retrieve the daily behavior record (meal statuses, nap, hygiene, teacher notes) for a child on a specific date. Defaults to today if not specified.
 *     tags: ["Parent - Child Info"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 1
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Target date as Unix timestamp (seconds). Defaults to today.
 *     responses:
 *       200:
 *         description: Successfully retrieved daily activity log
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy nhật ký hoạt động ngày của bé thành công
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     activityId:
 *                       type: integer
 *                       example: 1
 *                     studentId:
 *                       type: integer
 *                       example: 1
 *                     logDate:
 *                       type: string
 *                       example: 2026-06-22
 *                     breakfastStatus:
 *                       type: string
 *                       nullable: true
 *                       example: Ăn hết
 *                     lunchStatus:
 *                       type: string
 *                       nullable: true
 *                       example: Ăn hết
 *                     napStatus:
 *                       type: string
 *                       nullable: true
 *                       example: Ngủ ngoan
 *                     snackStatus:
 *                       type: string
 *                       nullable: true
 *                       example: Ăn hết
 *                     hygieneStatus:
 *                       type: string
 *                       example: Tốt
 *                     teacherNote:
 *                       type: string
 *                       nullable: true
 *                       example: Hôm nay Khang rất ngoan, tự xúc cơm không cần cô đút.
 *                     activityStatus:
 *                       type: string
 *                       nullable: true
 *                       example: Vui chơi tích cực
 *                     recordedBy:
 *                       type: integer
 *                       nullable: true
 *                       example: 5
 *                     updatedAt:
 *                       type: integer
 *                       example: 1782669357
 *                     teacherName:
 *                       type: string
 *                       nullable: true
 *                       example: Nguyễn Thị Lan
 *       400:
 *         description: Bad Request - invalid studentId or date parameter
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/badges:
 *   get:
 *     summary: Get badges of a child
 *     description: Retrieve all reward badges earned by a specific child, sorted by most recently earned first.
 *     tags: ["Parent - Child Info"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved badges
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách huy hiệu của bé thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentBadgeId:
 *                         type: integer
 *                         example: 1
 *                       studentId:
 *                         type: integer
 *                         example: 1
 *                       dateEarned:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-06-15T08:00:00.000Z"
 *                       badgeId:
 *                         type: integer
 *                         example: 2
 *                       badgeName:
 *                         type: string
 *                         example: Bé ngoan tuần này
 *                       badgeImageUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://media.kindercare.app/badges/good-kid.png
 *                       criteriaType:
 *                         type: string
 *                         enum: [WEEKLY, MONTHLY, SPECIAL]
 *                         example: WEEKLY
 *       400:
 *         description: Bad Request - studentId is not a valid number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - student does not belong to the logged-in parent
 *       500:
 *         description: Internal Server Error
 */

// ─────────────────────────────────────────────────────────────
//  GROUP 3 · Parent - Classroom
//  GET  /parent/children/{studentId}/daily-schedule
//  GET  /parent/children/{studentId}/daily-lessons
//  GET  /parent/children/{studentId}/daily-albums
//  GET  /parent/children/{studentId}/newsfeeds
//  GET  /parent/children/{studentId}/menu
// ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /parent/children/{studentId}/daily-schedule:
 *   get:
 *     summary: Get daily schedule of a child's class
 *     description: Retrieve the day's activity schedule (study, play, meal, nap, pickup/dropoff, etc.) for the child's class. Defaults to today.
 *     tags: ["Parent - Classroom"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 1
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Target date as Unix timestamp (seconds). UTC midnight of that date is used. Defaults to today.
 *     responses:
 *       200:
 *         description: Successfully retrieved daily schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy thời khóa biểu ngày của bé thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dailyScheduleId:
 *                         type: integer
 *                         example: 1
 *                       classId:
 *                         type: integer
 *                         example: 1
 *                       scheduleDate:
 *                         type: integer
 *                         example: 1784160000
 *                       startTime:
 *                         type: integer
 *                         example: 1784187000
 *                       endTime:
 *                         type: integer
 *                         example: 1784188800
 *                       activityName:
 *                         type: string
 *                         example: Đón bé & Chào hỏi
 *                       details:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       location:
 *                         type: string
 *                         nullable: true
 *                         example: Cổng A
 *                       activityType:
 *                         type: string
 *                         enum: [pickup, meal, study, nap, play, dropoff, other]
 *                         example: pickup
 *                       status:
 *                         type: string
 *                         enum: [Chưa diễn ra, Đang diễn ra, Xong]
 *                         example: Xong
 *       400:
 *         description: Bad Request - invalid studentId or date parameter
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/daily-lessons:
 *   get:
 *     summary: Get daily lessons of a child's class
 *     description: Retrieve the academic lessons (subject, title, details, icon type) taught in the child's class on a given date. Defaults to today.
 *     tags: ["Parent - Classroom"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 1
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Target date as Unix timestamp (seconds). Defaults to today.
 *     responses:
 *       200:
 *         description: Successfully retrieved daily lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách bài học ngày của bé thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lessonLogId:
 *                         type: integer
 *                         example: 1
 *                       classId:
 *                         type: integer
 *                         example: 1
 *                       lessonDate:
 *                         type: integer
 *                         example: 1783987200
 *                       subjectName:
 *                         type: string
 *                         example: TẠO HÌNH
 *                       lessonTitle:
 *                         type: string
 *                         example: Học vẽ hình tròn
 *                       details:
 *                         type: string
 *                         example: Bé vẽ mặt trời, bánh xe và bóng bay.
 *                       iconType:
 *                         type: string
 *                         example: draw
 *                       createdAt:
 *                         type: integer
 *                         example: 1781359832
 *                       updatedAt:
 *                         type: integer
 *                         example: 1781359832
 *       400:
 *         description: Bad Request - invalid studentId or date parameter
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/daily-albums:
 *   get:
 *     summary: Get daily photo albums of a child's class
 *     description: Retrieve photo albums (caption, date, photos with URL and description) published by teachers for the child's class on a given date. Defaults to today.
 *     tags: ["Parent - Classroom"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 1
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Target date as Unix timestamp (seconds). Defaults to today.
 *     responses:
 *       200:
 *         description: Successfully retrieved daily albums
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách album ảnh ngày của bé thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       albumId:
 *                         type: integer
 *                         example: 1
 *                       classId:
 *                         type: integer
 *                         example: 1
 *                       teacherId:
 *                         type: integer
 *                         example: 5
 *                       albumDate:
 *                         type: integer
 *                         example: 1782172800
 *                       caption:
 *                         type: string
 *                         nullable: true
 *                         example: Bé tham gia dã ngoại ngoài trời
 *                       createdAt:
 *                         type: integer
 *                         example: 1782215794
 *                       updatedAt:
 *                         type: integer
 *                         example: 1782215794
 *                       photos:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             photoId:
 *                               type: integer
 *                               example: 1
 *                             albumId:
 *                               type: integer
 *                               example: 1
 *                             photoUrl:
 *                               type: string
 *                               example: https://picsum.photos/400/600
 *                             description:
 *                               type: string
 *                               nullable: true
 *                               example: Bé chơi đu quay
 *                             createdAt:
 *                               type: integer
 *                               example: 1782215794
 *       400:
 *         description: Bad Request - invalid studentId or date parameter
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/newsfeeds:
 *   get:
 *     summary: Get class newsfeeds of a child's class
 *     description: Retrieve all newsfeed posts (content, media URL, teacher info) published in the child's class.
 *     tags: ["Parent - Classroom"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved newsfeeds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách bản tin lớp học thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       postId:
 *                         type: integer
 *                         example: 1
 *                       classId:
 *                         type: integer
 *                         example: 1
 *                       teacherId:
 *                         type: integer
 *                         example: 5
 *                       content:
 *                         type: string
 *                         example: Hôm nay các bé học vẽ rất hăng say!
 *                       mediaUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://media.kindercare.app/daily-albums/photo.jpg
 *                       postedAt:
 *                         type: integer
 *                         example: 1782400606
 *                       teacherName:
 *                         type: string
 *                         example: Nguyễn Thị Lan
 *                       teacherAvatarUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://media.kindercare.app/Avatar/Teacher%20Avatar/avatar1.jpg
 *       400:
 *         description: Bad Request - invalid studentId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/menu:
 *   get:
 *     summary: Get daily menu of a child's class
 *     description: Retrieve the meal menu (dish names, calories, nutritional info per meal type) for the child's class on a given date. Defaults to today.
 *     tags: ["Parent - Classroom"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 1
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Target date as Unix timestamp (seconds). Defaults to today.
 *     responses:
 *       200:
 *         description: Successfully retrieved daily menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy thực đơn ngày của bé thành công
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     menuId:
 *                       type: integer
 *                       example: 1
 *                     classId:
 *                       type: integer
 *                       example: 1
 *                     menuDate:
 *                       type: integer
 *                       example: 1782172800
 *                     weekNumber:
 *                       type: integer
 *                       example: 27
 *                     year:
 *                       type: integer
 *                       example: 2026
 *                     menuName:
 *                       type: string
 *                       nullable: true
 *                       example: Thực đơn tuần 1 tháng 7
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           menuDetailId:
 *                             type: integer
 *                             example: 1
 *                           mealType:
 *                             type: string
 *                             example: Breakfast
 *                           dishName:
 *                             type: string
 *                             example: Cháo lươn đồng hạt sen
 *                           calories:
 *                             type: integer
 *                             nullable: true
 *                             example: null
 *                           nutritionalDetails:
 *                             type: string
 *                             nullable: true
 *                             example: Protein, Canxi
 *       400:
 *         description: Bad Request - invalid studentId or date parameter
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

// ─────────────────────────────────────────────────────────────
//  GROUP 4 · Parent - Requests
//  POST  /parent/leave-requests
//  GET   /parent/children/{studentId}/leave-requests
//  PATCH /parent/leave-requests/{requestId}/cancel
//  POST  /parent/medication-requests
//  GET   /parent/children/{studentId}/medication-requests
//  PATCH /parent/medication-requests/{medRequestId}/cancel
// ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /parent/leave-requests:
 *   post:
 *     summary: Create a leave request
 *     description: Submit a leave request for a child. A push notification is automatically sent to all teachers of the child's class upon creation.
 *     tags: ["Parent - Requests"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - fromDate
 *               - toDate
 *               - reason
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 19
 *               fromDate:
 *                 type: integer
 *                 description: Start date as Unix timestamp (seconds)
 *                 example: 1781827200
 *               toDate:
 *                 type: integer
 *                 description: End date as Unix timestamp (seconds)
 *                 example: 1781913599
 *               reason:
 *                 type: string
 *                 description: "Category: Bệnh/Ốm | Việc gia đình | Du lịch / nghỉ phép | Khám bệnh định kỳ | Lý do khác"
 *                 example: Bệnh/Ốm
 *               parentNotes:
 *                 type: string
 *                 nullable: true
 *                 example: Bé bị sốt nhẹ, gia đình xin phép nghỉ hôm nay.
 *               evidence:
 *                 type: string
 *                 format: binary
 *                 description: Optional supporting document image (max 5 MB)
 *     responses:
 *       201:
 *         description: Leave request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Tạo đơn xin nghỉ phép thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     requestId:
 *                       type: integer
 *                       example: 22
 *                     studentId:
 *                       type: integer
 *                       example: 19
 *                     parentId:
 *                       type: integer
 *                       example: 6
 *                     fromDate:
 *                       type: integer
 *                       example: 1781827200
 *                     toDate:
 *                       type: integer
 *                       example: 1781913599
 *                     reason:
 *                       type: string
 *                       example: Bệnh/Ốm
 *                     evidenceUrl:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     status:
 *                       type: string
 *                       example: Pending
 *                     approverId:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *                     isMealFeeDeducted:
 *                       type: integer
 *                       example: 0
 *                     parentNotes:
 *                       type: string
 *                       nullable: true
 *                       example: Bé bị sốt nhẹ, gia đình xin phép nghỉ hôm nay.
 *                     createdAt:
 *                       type: integer
 *                       example: 1781827200
 *                     updatedTime:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: Bad Request - invalid or missing parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/leave-requests:
 *   get:
 *     summary: Get leave requests of a child
 *     description: Retrieve all leave request history of a child. Only accessible by parents associated with the child.
 *     tags: ["Parent - Requests"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 19
 *     responses:
 *       200:
 *         description: Successfully retrieved leave requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách đơn xin nghỉ phép của bé thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       requestId:
 *                         type: integer
 *                         example: 1
 *                       studentId:
 *                         type: integer
 *                         example: 19
 *                       parentId:
 *                         type: integer
 *                         example: 6
 *                       fromDate:
 *                         type: integer
 *                         example: 1782172800
 *                       toDate:
 *                         type: integer
 *                         example: 1782431999
 *                       reason:
 *                         type: string
 *                         example: Bệnh/Ốm
 *                       evidenceUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://media.kindercare.app/parents/student-leave-evidences/evidence.jpg
 *                       status:
 *                         type: string
 *                         example: Pending
 *                       approverId:
 *                         type: integer
 *                         nullable: true
 *                         example: null
 *                       isMealFeeDeducted:
 *                         type: integer
 *                         example: 0
 *                       parentNotes:
 *                         type: string
 *                         nullable: true
 *                         example: Bé bị sốt nhẹ.
 *                       createdAt:
 *                         type: integer
 *                         example: 1781740800
 *                       updatedTime:
 *                         type: integer
 *                         nullable: true
 *                         example: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/leave-requests/{requestId}/cancel:
 *   patch:
 *     summary: Cancel a pending leave request
 *     description: Cancel a leave request currently in "Pending" status. Only the parent who created it may cancel.
 *     tags: ["Parent - Requests"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the leave request
 *         example: 22
 *     responses:
 *       200:
 *         description: Leave request cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Hủy đơn xin nghỉ phép thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     requestId:
 *                       type: integer
 *                       example: 22
 *                     status:
 *                       type: string
 *                       example: Cancelled
 *                     updatedTime:
 *                       type: integer
 *                       example: 1781827200
 *       400:
 *         description: Bad Request - request is not in Pending status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user did not create this request
 *       404:
 *         description: Not Found - leave request not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/medication-requests:
 *   post:
 *     summary: Create a medication request
 *     description: Submit medication instructions for a child for a specific day. A push notification is sent to all teachers in the child's class upon creation.
 *     tags: ["Parent - Requests"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - requestDate
 *               - medicineDetails
 *               - dosage
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 26
 *               requestDate:
 *                 type: integer
 *                 description: Date of request as Unix timestamp (seconds)
 *                 example: 1778803200
 *               medicineDetails:
 *                 type: string
 *                 example: Men tiêu hóa BioGaia
 *               dosage:
 *                 type: string
 *                 example: Nhỏ 5 giọt
 *               frequency:
 *                 type: string
 *                 nullable: true
 *                 example: 2 lần/ngày
 *               timeToTake:
 *                 type: string
 *                 nullable: true
 *                 example: Sau ăn trưa
 *               parentNote:
 *                 type: string
 *                 nullable: true
 *                 example: Tất cả thuốc để trong ba lô
 *               medicineImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional prescription/medicine image (max 5 MB)
 *     responses:
 *       201:
 *         description: Medication request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Tạo dặn dò thuốc thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     medRequestId:
 *                       type: integer
 *                       example: 2
 *                     studentId:
 *                       type: integer
 *                       example: 26
 *                     parentId:
 *                       type: integer
 *                       example: 6
 *                     requestDate:
 *                       type: integer
 *                       example: 1778803200
 *                     medicineDetails:
 *                       type: string
 *                       example: Men tiêu hóa BioGaia
 *                     dosage:
 *                       type: string
 *                       example: Nhỏ 5 giọt
 *                     status:
 *                       type: string
 *                       example: Pending
 *                     teacherNote:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     frequency:
 *                       type: string
 *                       nullable: true
 *                       example: 2 lần/ngày
 *                     timeToTake:
 *                       type: string
 *                       nullable: true
 *                       example: Sau ăn trưa
 *                     parentNote:
 *                       type: string
 *                       nullable: true
 *                       example: Tất cả thuốc để trong ba lô
 *                     updatedTime:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: Bad Request - invalid or missing parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/medication-requests:
 *   get:
 *     summary: Get medication requests of a child
 *     description: Retrieve all medication request history (medicine name, dosage, status, teacher note) of a child.
 *     tags: ["Parent - Requests"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 19
 *     responses:
 *       200:
 *         description: Successfully retrieved medication requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách dặn dò thuốc của bé thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       medRequestId:
 *                         type: integer
 *                         example: 1
 *                       studentId:
 *                         type: integer
 *                         example: 19
 *                       parentId:
 *                         type: integer
 *                         example: 6
 *                       requestDate:
 *                         type: integer
 *                         example: 1778803200
 *                       medicineDetails:
 *                         type: string
 *                         example: Men tiêu hóa BioGaia
 *                       dosage:
 *                         type: string
 *                         example: Nhỏ 5 giọt
 *                       medicineImageUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://media.kindercare.app/parents/student-medication-requests/medicine.jpg
 *                       status:
 *                         type: string
 *                         example: Pending
 *                       teacherNote:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       frequency:
 *                         type: string
 *                         nullable: true
 *                         example: 2 lần/ngày
 *                       timeToTake:
 *                         type: string
 *                         nullable: true
 *                         example: Sau ăn trưa
 *                       parentNote:
 *                         type: string
 *                         nullable: true
 *                         example: Tất cả thuốc để trong ba lô
 *                       updatedTime:
 *                         type: integer
 *                         nullable: true
 *                         example: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a parent or not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/medication-requests/{medRequestId}/cancel:
 *   patch:
 *     summary: Cancel a pending medication request
 *     description: Cancel all pending medication requests in the group associated with the given ID. Only the parent who created it may cancel.
 *     tags: ["Parent - Requests"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: medRequestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the medication request to cancel
 *         example: 2
 *     responses:
 *       200:
 *         description: Medication request cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Hủy dặn dò thuốc thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       medRequestId:
 *                         type: integer
 *                         example: 2
 *                       status:
 *                         type: string
 *                         example: Cancelled
 *                       updatedTime:
 *                         type: integer
 *                         example: 1778803200
 *       400:
 *         description: Bad Request - request is not in Pending status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user did not create this request
 *       404:
 *         description: Not Found - medication request not found
 *       500:
 *         description: Internal Server Error
 */

// ─────────────────────────────────────────────────────────────
//  GROUP 5 · Parent - Authorizations
//  GET   /parent/children/{studentId}/qr-token
//  POST  /parent/proxy-authorizations
//  GET   /parent/children/{studentId}/proxy-authorizations
//  PATCH /parent/proxy-authorizations/{authorizationId}/cancel
// ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /parent/children/{studentId}/qr-token:
 *   get:
 *     summary: Generate QR attendance token for a child
 *     description: Generate a signed JWT (HS256) to be rendered as a QR code for teacher attendance scanning. Token expires in 60 seconds — frontend should refresh on each expiry.
 *     tags: ["Parent - Authorizations"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 19
 *     responses:
 *       200:
 *         description: QR token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Tạo mã QR điểm danh thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Signed JWT to render as QR code
 *                       example: eyJhbGciOiJIUzI1NiJ9...
 *                     expiresAt:
 *                       type: integer
 *                       description: Token expiry as Unix timestamp (seconds)
 *                       example: 1719532860
 *                     ttl:
 *                       type: integer
 *                       description: Time-to-live in seconds
 *                       example: 60
 *       400:
 *         description: Bad Request - invalid studentId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - student does not belong to this parent
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/proxy-authorizations:
 *   post:
 *     summary: Create a proxy pickup/drop-off authorization
 *     description: Authorize another person to check-in or check-out a child on a specific date. A push notification is sent to all teachers in the child's class upon creation.
 *     tags: ["Parent - Authorizations"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - authorizationDate
 *               - type
 *               - proxyName
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 19
 *               authorizationDate:
 *                 type: integer
 *                 description: Unix timestamp (seconds) of the authorization day
 *                 example: 1782824107
 *               type:
 *                 type: string
 *                 enum: [checkin, checkout, both]
 *                 example: checkout
 *               proxyName:
 *                 type: string
 *                 example: Nguyễn Văn B
 *               proxyPhone:
 *                 type: string
 *                 example: "0901234567"
 *               proxyIDCard:
 *                 type: string
 *                 example: "079123456789"
 *               notes:
 *                 type: string
 *                 example: Là chú của bé, đi xe Lead đỏ
 *               proxyPhoto:
 *                 type: string
 *                 format: binary
 *                 description: Portrait photo of the proxy person (max 5 MB)
 *     responses:
 *       201:
 *         description: Proxy authorization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Đăng ký ủy quyền đưa đón thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     authorizationId:
 *                       type: integer
 *                       example: 12
 *       400:
 *         description: Bad Request - validation failed or invalid format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - student does not belong to this parent
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/proxy-authorizations:
 *   get:
 *     summary: Get proxy authorizations of a child
 *     description: Retrieve all proxy pickup/drop-off authorizations submitted by the logged-in parent for a specific child.
 *     tags: ["Parent - Authorizations"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 19
 *     responses:
 *       200:
 *         description: Successfully retrieved proxy authorizations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách ủy quyền đón hộ thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       authorizationId:
 *                         type: integer
 *                         example: 12
 *                       studentId:
 *                         type: integer
 *                         example: 19
 *                       parentId:
 *                         type: integer
 *                         example: 4
 *                       authorizationDate:
 *                         type: integer
 *                         description: Unix timestamp of the authorization day
 *                         example: 1782824107
 *                       type:
 *                         type: string
 *                         enum: [checkin, checkout, both]
 *                         example: checkout
 *                       proxyName:
 *                         type: string
 *                         example: Nguyễn Văn B
 *                       proxyPhone:
 *                         type: string
 *                         example: "0901234567"
 *                       proxyIDCard:
 *                         type: string
 *                         example: "079123456789"
 *                       proxyPhotoUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://media.kindercare.app/parents/proxy-photos/168910291.jpg
 *                       notes:
 *                         type: string
 *                         nullable: true
 *                         example: Là chú của bé, đi xe Lead đỏ
 *                       status:
 *                         type: string
 *                         enum: [Approved, Cancelled, Completed]
 *                         example: Approved
 *                       createdAt:
 *                         type: integer
 *                         example: 1782810000
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - student does not belong to this parent
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/proxy-authorizations/{authorizationId}/cancel:
 *   patch:
 *     summary: Cancel a proxy authorization
 *     description: Cancel an active proxy authorization. Only allowed when status is "Approved" and the authorization date has not yet passed.
 *     tags: ["Parent - Authorizations"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: authorizationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the proxy authorization
 *         example: 12
 *     responses:
 *       200:
 *         description: Proxy authorization cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Hủy ủy quyền đón hộ thành công
 *       400:
 *         description: Bad Request - authorization already cancelled or completed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - record does not belong to the logged-in parent's child
 *       404:
 *         description: Not Found - proxy authorization not found
 *       500:
 *         description: Internal Server Error
 */
