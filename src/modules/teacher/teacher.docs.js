/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: Teacher-specific operations (Dashboard, Profile, Leave Requests, and Attendance)
 */

/**
 * @swagger
 * /teacher/classes:
 *   get:
 *     summary: Get Teacher Classes
 *     description: Retrieve all classes assigned to the logged-in teacher, including the count of active students in each class.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of assigned classes
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
 *                   example: Lấy danh sách lớp học của giáo viên thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       classId:
 *                         type: integer
 *                         example: 1
 *                       className:
 *                         type: string
 *                         example: Mầm 1
 *                       studentCount:
 *                         type: integer
 *                         example: 15
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not a teacher
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /teacher/classes/{classId}/menu:
 *   get:
 *     summary: Get Class Meal Menu
 *     description: Retrieve the meal menu for a specific class on a target date. Teachers can only view the menu for classes they are assigned to.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the class
 *       - in: query
 *         name: date
 *         schema:
 *           type: integer
 *         description: Unix timestamp in seconds (start of the day) to query. Defaults to today.
 *         example: 1784160000
 *     responses:
 *       200:
 *         description: Successfully retrieved the class meal menu
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
 *                   example: Lấy thực đơn lớp học thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       menuId:
 *                         type: integer
 *                         example: 1
 *                       classId:
 *                         type: integer
 *                         example: 1
 *                       menuDate:
 *                         type: integer
 *                         example: 1784160000
 *                       mealType:
 *                         type: string
 *                         example: Bữa trưa
 *                       dishName:
 *                         type: string
 *                         example: Cơm + canh + thịt
 *                       calories:
 *                         type: integer
 *                         nullable: true
 *                         example: 450
 *                       nutritionalDetails:
 *                         type: string
 *                         nullable: true
 *                         example: Giàu protein và vitamin
 *       400:
 *         description: Bad Request - Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher is not assigned to the class
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /teacher/classes/{classId}/schedule:
 *   get:
 *     summary: Get Class Daily Schedule
 *     description: Retrieve the daily activity schedule for a specific class on a target date. Teachers can only view the schedule for classes they are assigned to.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the class
 *       - in: query
 *         name: date
 *         schema:
 *           type: integer
 *         description: Unix timestamp in seconds (start of the day) to query. Defaults to today.
 *         example: 1784160000
 *     responses:
 *       200:
 *         description: Successfully retrieved the class daily schedule
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
 *                   example: Lấy lịch trình sinh hoạt lớp học thành công
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
 *                         example: Đón trẻ tại cổng trường A
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
 *         description: Bad Request - Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher is not assigned to the class
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /teacher/dashboard:
 *   get:
 *     summary: Get Teacher Dashboard statistics
 *     description: Retrieve dashboard data for all classes assigned to the logged-in teacher, including student count, today's attendance stats, and pending leave requests count.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved teacher dashboard stats
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
 *                   example: Lấy dữ liệu dashboard giáo viên thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     todayDate:
 *                       type: integer
 *                       example: 1784160000
 *                       description: Start of today in Unix timestamp (seconds)
 *                     classes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           classId:
 *                             type: integer
 *                             example: 1
 *                           className:
 *                             type: string
 *                             example: Mầm 1
 *                           stats:
 *                             type: object
 *                             properties:
 *                               totalStudents:
 *                                 type: integer
 *                                 example: 15
 *                               attendance:
 *                                 type: object
 *                                 properties:
 *                                   present:
 *                                     type: integer
 *                                     example: 12
 *                                   absent:
 *                                     type: integer
 *                                     example: 1
 *                                   excused:
 *                                     type: integer
 *                                     example: 2
 *                                   noAttendance:
 *                                     type: integer
 *                                     example: 0
 *                               pendingLeavesCount:
 *                                 type: integer
 *                                 example: 1
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a teacher
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /teacher/profile:
 *   get:
 *     summary: Get Teacher Profile
 *     description: Retrieve detailed profile details of the authenticated teacher.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved teacher profile details
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
 *                   example: Lấy thông tin hồ sơ giáo viên thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     teacherId:
 *                       type: integer
 *                       example: 3
 *                     username:
 *                       type: string
 *                       example: gv_lan
 *                     avatarUrl:
 *                       type: string
 *                       nullable: true
 *                       example: https://example.com/avatar.jpg
 *                     fullName:
 *                       type: string
 *                       example: Nguyễn Thị Lan
 *                     phoneNumber:
 *                       type: string
 *                       example: 0901234567
 *                     email:
 *                       type: string
 *                       example: lan.nguyen@kindercare.edu.vn
 *                     dateOfBirth:
 *                       type: integer
 *                       example: 642729600
 *                     gender:
 *                       type: string
 *                       example: Nữ
 *                     idCard:
 *                       type: string
 *                       example: 079190001234
 *                     address:
 *                       type: string
 *                       example: 123 Nguyễn Huệ, Quận 1
 *                     professionalRank:
 *                       type: string
 *                       example: Hạng III
 *                     workStatus:
 *                       type: string
 *                       example: Active
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Teacher profile not found
 *       500:
 *         description: Internal Server Error
 * 
 * /api/teacher/classes/{classId}/assessments:
 *   get:
 *     summary: Get student assessments (Phiếu bé ngoan) for a class
 *     description: Retrieve all student assessments for a specific class in a specific month.
 *     tags: [Teacher - Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Class ID
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *         description: Assessment month in MM-YYYY format (e.g. 05-2026)
 *     responses:
 *       200:
 *         description: Successfully retrieved student assessments
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher not assigned to class
 * 
 *   post:
 *     summary: Submit student assessments
 *     description: Upsert (insert or update) assessments for multiple students in a class. This will also send a push notification to the parents.
 *     tags: [Teacher - Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - assessments
 *             properties:
 *               month:
 *                 type: string
 *                 example: 05-2026
 *               assessments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - studentId
 *                   properties:
 *                     studentId:
 *                       type: integer
 *                       example: 1
 *                     physicalScore:
 *                       type: integer
 *                       example: 5
 *                     cognitiveScore:
 *                       type: integer
 *                       example: 4
 *                     languageScore:
 *                       type: integer
 *                       example: 5
 *                     socioEmotionalScore:
 *                       type: integer
 *                       example: 5
 *                     aestheticScore:
 *                       type: integer
 *                       example: 4
 *                     teacherComment:
 *                       type: string
 *                       example: Bé rất ngoan và vâng lời cô
 *     responses:
 *       200:
 *         description: Successfully updated assessments
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 * 
 *   put:
 *     summary: Update Teacher Profile
 *     description: Update profile fields of the authenticated teacher.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nguyễn Thị Lan
 *               phoneNumber:
 *                 type: string
 *                 example: 0901234567
 *               email:
 *                 type: string
 *                 example: lan.nguyen@kindercare.edu.vn
 *               dateOfBirth:
 *                 type: integer
 *                 example: 642729600
 *               gender:
 *                 type: string
 *                 example: Nữ
 *               idCard:
 *                 type: string
 *                 example: 079190001234
 *               address:
 *                 type: string
 *                 example: 123 Nguyễn Huệ, Quận 1
 *               avatarUrl:
 *                 type: string
 *                 example: https://example.com/new-avatar.jpg
 *     responses:
 *       200:
 *         description: Successfully updated teacher profile details
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
 *                   example: Cập nhật thông tin hồ sơ giáo viên thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     teacherId:
 *                       type: integer
 *                       example: 3
 *                     username:
 *                       type: string
 *                       example: gv_lan
 *                     avatarUrl:
 *                       type: string
 *                       example: https://example.com/new-avatar.jpg
 *                     fullName:
 *                       type: string
 *                       example: Nguyễn Thị Lan
 *                     phoneNumber:
 *                       type: string
 *                       example: 0901234567
 *                     email:
 *                       type: string
 *                       example: lan.nguyen@kindercare.edu.vn
 *                     dateOfBirth:
 *                       type: integer
 *                       example: 642729600
 *                     gender:
 *                       type: string
 *                       example: Nữ
 *                     idCard:
 *                       type: string
 *                       example: 079190001234
 *                     address:
 *                       type: string
 *                       example: 123 Nguyễn Huệ, Quận 1
 *                     professionalRank:
 *                       type: string
 *                       example: Hạng III
 *                     workStatus:
 *                       type: string
 *                       example: Active
 *       400:
 *         description: Bad Request - Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /teacher/leave-requests:
 *   get:
 *     summary: Get Leave Requests
 *     description: Retrieve all leave requests submitted for students in the classes taught by this teacher.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Approved, Rejected]
 *         description: Filter leave requests by status
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of leave requests
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
 *                   example: Lấy danh sách đơn phép thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       requestId:
 *                         type: integer
 *                         example: 5
 *                       studentId:
 *                         type: integer
 *                         example: 1
 *                       studentName:
 *                         type: string
 *                         example: Nguyễn Minh Khang
 *                       studentAvatar:
 *                         type: string
 *                         nullable: true
 *                         example: https://example.com/avatar.jpg
 *                       className:
 *                         type: string
 *                         example: Mầm 1
 *                       parentId:
 *                         type: integer
 *                         example: 4
 *                       parentName:
 *                         type: string
 *                         example: Nguyễn Anh Tuấn
 *                       fromDate:
 *                         type: integer
 *                         example: 1783987200
 *                       toDate:
 *                         type: integer
 *                         example: 1784073600
 *                       reason:
 *                         type: string
 *                         example: Bé bị sốt phát ban cần nghỉ ngơi
 *                       evidenceUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://example.com/evidence.jpg
 *                       status:
 *                         type: string
 *                         example: Pending
 *                       isMealFeeDeducted:
 *                         type: integer
 *                         example: 0
 *                       parentNotes:
 *                         type: string
 *                         nullable: true
 *                         example: Mong cô thông cảm
 *                       approverId:
 *                         type: integer
 *                         nullable: true
 *                         example: 5
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /teacher/leave-requests/{requestId}:
 *   get:
 *     summary: Get Leave Request Detail
 *     description: Retrieve detailed information about a specific leave request submitted for a student in the classes taught by this teacher.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the leave request
 *     responses:
 *       200:
 *         description: Successfully retrieved the leave request detail
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
 *                   example: Lấy chi tiết đơn phép thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     requestId:
 *                       type: integer
 *                       example: 5
 *                     studentId:
 *                       type: integer
 *                       example: 1
 *                     studentName:
 *                       type: string
 *                       example: Nguyễn Minh Khang
 *                     studentAvatar:
 *                       type: string
 *                       nullable: true
 *                       example: https://example.com/avatar.jpg
 *                     className:
 *                       type: string
 *                       example: Mầm 1
 *                     parentId:
 *                       type: integer
 *                       example: 4
 *                     parentName:
 *                       type: string
 *                       example: Nguyễn Anh Tuấn
 *                     parentPhone:
 *                       type: string
 *                       nullable: true
 *                       example: 0901234567
 *                     fromDate:
 *                       type: integer
 *                       example: 1783987200
 *                     toDate:
 *                       type: integer
 *                       example: 1784073600
 *                     reason:
 *                       type: string
 *                       example: Bé bị sốt phát ban cần nghỉ ngơi
 *                     evidenceUrl:
 *                       type: string
 *                       nullable: true
 *                       example: https://example.com/evidence.jpg
 *                     status:
 *                       type: string
 *                       example: Pending
 *                     isMealFeeDeducted:
 *                       type: integer
 *                       example: 0
 *                     parentNotes:
 *                       type: string
 *                       nullable: true
 *                       example: Mong cô giáo thông cảm
 *                     approverId:
 *                       type: integer
 *                       nullable: true
 *                       example: 5
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request - Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Leave request not found or not assigned to this teacher
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /teacher/leave-requests/{requestId}/status:
 *   put:
 *     summary: Approve or Reject a Leave Request
 *     description: Update the status of a specific student leave request to either 'Approved' or 'Rejected'. Teachers can only update status for students in their assigned classes.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the leave request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Approved, Rejected, Đã duyệt, Không duyệt]
 *                 example: Approved
 *     responses:
 *       200:
 *         description: Successfully updated leave request status
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
 *                   example: Cập nhật trạng thái đơn phép thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     requestId:
 *                       type: string
 *                       example: "5"
 *                     status:
 *                       type: string
 *                       example: Approved
 *       400:
 *         description: Bad Request - Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher is not assigned to the student's class
 *       404:
 *         description: Leave request not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /teacher/attendance/quick:
 *   post:
 *     summary: Submit quick attendance
 *     description: Submit or update attendance records in bulk for students in a specific class on a target date.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - attendanceData
 *             properties:
 *               classId:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: integer
 *                 description: Unix timestamp in seconds (start of the day). Defaults to today if not provided.
 *                 example: 1784160000
 *               attendanceData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - studentId
 *                     - status
 *                   properties:
 *                     studentId:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       enum: [Present, Absent, Excused, Có mặt, Vắng, Phép]
 *                       example: Present
 *                     checkInTime:
 *                       type: integer
 *                       nullable: true
 *                       example: 1784187000
 *                     checkOutTime:
 *                       type: integer
 *                       nullable: true
 *                       example: 1784221200
 *                     pickedUpBy:
 *                       type: string
 *                       nullable: true
 *                       example: Nguyễn Anh Tuấn
 *     responses:
 *       200:
 *         description: Successfully recorded attendance in bulk
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
 *                   example: Điểm danh nhanh thành công
 *       400:
 *         description: Bad Request - Validation failed or student not in class
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher is not assigned to the class
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /teacher/classes/{classId}/students:
 *   get:
 *     summary: Get detailed student list with attendance and leave status
 *     description: Retrieve all active students in a specific class with their attendance records and any active leave requests for a target date.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the class
 *       - in: query
 *         name: date
 *         schema:
 *           type: integer
 *         description: Unix timestamp in seconds (start of the day) to query attendance. Defaults to today.
 *         example: 1784160000
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of students with attendance status
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
 *                   example: Lấy danh sách học sinh kèm trạng thái điểm danh thành công
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
 *                       avatarUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://example.com/avatar.png
 *                       status:
 *                         type: string
 *                         nullable: true
 *                         example: Present
 *                       checkInTime:
 *                         type: integer
 *                         nullable: true
 *                         example: 1784187000
 *                       checkOutTime:
 *                         type: integer
 *                         nullable: true
 *                         example: 1784221200
 *                       healthNote:
 *                         type: string
 *                         nullable: true
 *                         example: Bé có biểu hiện hơi mệt buổi sáng
 *                       leaveRequest:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           requestId:
 *                             type: integer
 *                             example: 5
 *                           status:
 *                             type: string
 *                             example: Approved
 *                           reason:
 *                             type: string
 *                             example: Bé bị sốt cần nghỉ ngơi
 *       400:
 *         description: Bad Request - Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher is not assigned to the class
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /teacher/attendance/meals:
 *   post:
 *     summary: Submit quick meal logs
 *     description: Submit or update meal intake status in bulk for students in a specific class on a target date.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - mealData
 *             properties:
 *               classId:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: integer
 *                 description: Unix timestamp in seconds (start of the day). Defaults to today if not provided.
 *                 example: 1784160000
 *               mealData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - studentId
 *                     - eatingStatus
 *                   properties:
 *                     studentId:
 *                       type: integer
 *                       example: 1
 *                     eatingStatus:
 *                       type: string
 *                       enum: [Ăn hết, Ăn chậm, Không ăn, Ăn ngoan]
 *                       example: Ăn hết
 *     responses:
 *       200:
 *         description: Successfully recorded meal logs in bulk
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
 *                   example: Ghi nhận bữa ăn thành công
 *       400:
 *         description: Bad Request - Validation failed or student not in class
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher is not assigned to the class
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /teacher/classes/{classId}/medical-requests:
 *   get:
 *     summary: Get Medical Requests
 *     description: Retrieve all medical requests for a specific class, optionally filtered by date.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Class ID
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter by date (timestamp in seconds)
 *     responses:
 *       200:
 *         description: Successfully retrieved medical requests
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 * 
 * /teacher/medical-requests/{requestId}:
 *   put:
 *     summary: Update Medical Request Status
 *     description: Update the status and teacher note for a specific medical request.
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medical Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Administered, Cancelled]
 *               teacherNote:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated medical request
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not Found
 */
