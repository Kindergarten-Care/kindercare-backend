/**
 * @swagger
 * tags:
 *   name: Parent
 *   description: Parent-dashboard specific operations
 */

/**
 * @swagger
 * /parent/children:
 *   get:
 *     summary: Get children of the logged-in parent
 *     description: Retrieve detailed information of all children associated with the currently authenticated parent.
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of children
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
 *                               example: Lead
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/profile:
 *   get:
 *     summary: Get profile of the logged-in parent
 *     description: Retrieve detailed profile information of the currently authenticated parent.
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the parent profile
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
 *                     phoneNumber:
 *                       type: string
 *                       example: 0911111111
 *                     email:
 *                       type: string
 *                       example: tuan.nguyen@gmail.com
 *                     idCard:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     job:
 *                       type: string
 *                       example: Kỹ sư
 *                     address:
 *                       type: string
 *                       example: 65 Huỳnh Thúc Kháng, Q1
 *                     avatarUrl:
 *                       type: string
 *                       nullable: true
 *                       example: https://media.kindercare.app/Avatar/Parent%20Avatar/534926184_1951092382389301_2242079378559548722_n.jpg
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent
 *       404:
 *         description: Not Found - parent profile not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/health-records:
 *   get:
 *     summary: Get health records of a child
 *     description: Retrieve all developmental health records (height, weight, BMI, term period) of a child associated with the authenticated parent.
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *     responses:
 *       200:
 *         description: Successfully retrieved child health records
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
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/leave-requests:
 *   post:
 *     summary: Create a leave request
 *     description: Submit a new leave request for a child. Only accessible by parents associated with the child.
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 description: ID of the child student
 *                 example: 19
 *               fromDate:
 *                 type: integer
 *                 description: Start date of leave as Unix timestamp in seconds
 *                 example: 1781827200
 *               toDate:
 *                 type: integer
 *                 description: End date of leave as Unix timestamp in seconds
 *                 example: 1781913599
 *               reason:
 *                 type: string
 *                 description: Category of leave (e.g., Bệnh/Ốm, Việc gia đình, Du lịch / nghỉ phép, Khám bệnh định kỳ, Bé đi tiêm chủng định kỳ, Lý do khác)
 *                 example: Bệnh/Ốm
 *               evidenceUrl:
 *                 type: string
 *                 nullable: true
 *                 description: URL to medical certificate or other supporting documents
 *                 example: null
 *               parentNotes:
 *                 type: string
 *                 nullable: true
 *                 description: Detailed notes or messages from the parent
 *                 example: Bé Khang bị sốt nhẹ từ đêm qua, gia đình xin phép thầy Huy cho bé nghỉ hôm nay để theo dõi thêm ạ.
 *     responses:
 *       201:
 *         description: Leave request successfully created
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
 *                       example: Bé Khang bị sốt nhẹ từ đêm qua, gia đình xin phép thầy Huy cho bé nghỉ hôm nay để theo dõi thêm ạ.
 *       400:
 *         description: Bad Request - invalid or missing parameters
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/medication-requests:
 *   post:
 *     summary: Create a medication request
 *     description: Submit medication details and dosage instructions for a child. Only accessible by parents associated with the child.
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *                 description: ID of the child student
 *                 example: 26
 *               requestDate:
 *                 type: integer
 *                 description: Date of the request as Unix timestamp in seconds
 *                 example: 1778803200
 *               medicineDetails:
 *                 type: string
 *                 description: Detailed name and description of the medicine
 *                 example: Men tiêu hóa BioGaia
 *               dosage:
 *                 type: string
 *                 description: Instructions on dosage
 *                 example: Nhỏ 5 giọt
 *               frequency:
 *                 type: string
 *                 description: Frequency of taking the medicine per day
 *                 nullable: true
 *                 example: 2 lần
 *               timeToTake:
 *                 type: string
 *                 description: Specific timing to take the medicine (e.g. Sau ăn sáng, Sau ăn trưa)
 *                 nullable: true
 *                 example: Sau ăn trưa
 *               parentNote:
 *                 type: string
 *                 description: General note or instructions for the teacher
 *                 nullable: true
 *                 example: Tất cả thuốc để trong ba lô
 *     responses:
 *       201:
 *         description: Medication request successfully created
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
 *                       example: 2 lần
 *                     timeToTake:
 *                       type: string
 *                       nullable: true
 *                       example: Sau ăn trưa
 *                     parentNote:
 *                       type: string
 *                       nullable: true
 *                       example: Tất cả thuốc để trong ba lô
 *       400:
 *         description: Bad Request - invalid or missing parameters
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/attendance:
 *   get:
 *     summary: Get attendance records of a child
 *     description: Retrieve all attendance history (check-in/out times, status, pickup information) of a child. Only accessible by parents associated with the child.
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the child student
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: integer
 *         description: Start date filter as Unix timestamp in seconds
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: integer
 *         description: End date filter as Unix timestamp in seconds
 *     responses:
 *       200:
 *         description: Successfully retrieved child attendance records
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
 *                         example: 20
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
 *                       pickedUpBy:
 *                         type: string
 *                         nullable: true
 *                         example: Bà nội
 *       400:
 *         description: Bad Request - invalid parameters
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/leave-requests:
 *   get:
 *     summary: Get leave requests of a child
 *     description: Retrieve all leave request history of a child. Only accessible by parents associated with the child.
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the child student
 *     responses:
 *       200:
 *         description: Successfully retrieved child leave requests
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
 *                         example: Lý do khác
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
 *                         example: Thèm thuốc quá nên nghỉ học. Yêu cầu nhà trường mua thuốc cho bé uống.
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/medication-requests:
 *   get:
 *     summary: Get medication requests of a child
 *     description: Retrieve all medication request history (medicine, dosage, status, note, etc.) of a child. Only accessible by parents associated with the child.
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the child student
 *     responses:
 *       200:
 *         description: Successfully retrieved child medication requests
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
 *                         example: 2 lần
 *                       timeToTake:
 *                         type: string
 *                         nullable: true
 *                         example: Sau ăn trưa
 *                       parentNote:
 *                         type: string
 *                         nullable: true
 *                         example: Tất cả thuốc để trong ba lô
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */





