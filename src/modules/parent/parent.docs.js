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
 *     description: Submit a new leave request for a child. Only accessible by parents associated with the child. After creation, a push notification is automatically sent to all teachers of the child's class.
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
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/leave-requests/{requestId}/cancel:
 *   patch:
 *     summary: Cancel a pending leave request
 *     description: Cancel a leave request that is currently in "Pending" status. Only accessible by the parent who created it.
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the leave request to cancel
 *     responses:
 *       200:
 *         description: Leave request successfully cancelled
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
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or did not create this request
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
 *     description: Submit medication details and dosage instructions for a child. Only accessible by parents associated with the child. After creation, a push notification is automatically sent to all teachers of the child's class.
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
 *                     updatedTime:
 *                       type: integer
 *                       nullable: true
 *                       example: null
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
 * /parent/medication-requests/{medRequestId}/cancel:
 *   patch:
 *     summary: Cancel a pending medication request group
 *     description: Cancel all pending medication requests in the group associated with the given medRequestId. Only accessible by the parent who created it.
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: medRequestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of one of the medication requests in the group to cancel
 *     responses:
 *       200:
 *         description: Medication request group successfully cancelled
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
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or did not create this request
 *       404:
 *         description: Not Found - medication request not found
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
  *                       droppedOffBy:
  *                         type: string
  *                         nullable: true
  *                         example: Bố
  *                       droppedOffAvatarUrl:
  *                         type: string
  *                         nullable: true
  *                         example: https://media.kindercare.app/parents/avatar.png
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
 *                       createdAt:
 *                         type: integer
 *                         example: 1781740800
 *                       updatedTime:
 *                         type: integer
 *                         nullable: true
 *                         example: null
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
 *                       updatedTime:
 *                         type: integer
 *                         nullable: true
 *                         example: null
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/assessments:
 *   get:
 *     summary: Get assessments of a child
 *     description: Retrieve all monthly assessment logs (physical, cognitive, language, social-emotional, aesthetic scores, and teacher comments) of a child. Only accessible by parents associated with the child.
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
 *         name: month
 *         required: false
 *         schema:
 *           type: string
 *           pattern: '^(0[1-9]|1[0-2])-\d{4}$'
 *         description: Month in MM-YYYY format to filter assessments (e.g. 06-2026)
 *     responses:
 *       200:
 *         description: Successfully retrieved child assessments
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
 *         description: Bad Request - invalid studentId or invalid month format (should be MM-YYYY)
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/daily-schedule:
 *   get:
 *     summary: Get daily schedule of a child's class
 *     description: Retrieve the daily activity schedule (study, play, meal, nap, pickup/dropoff times, activity details, location, status, etc.) for the class of a given child student. Defaults to the current date if not specified. Only accessible by parents associated with the child.
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
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Target date represented as a Unix timestamp in seconds. Midnight UTC of the corresponding date will be used. Defaults to the current date.
 *     responses:
 *       200:
 *         description: Successfully retrieved child daily schedule
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
 *         description: Bad Request - invalid studentId or invalid date parameter
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/daily-lessons:
 *   get:
 *     summary: Get daily lessons of a child's class
 *     description: Retrieve the daily academic lessons (subject name, lesson title, details, icon type, etc.) for the class of a given child student. Defaults to the current date if not specified. Only accessible by parents associated with the child.
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
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Target date represented as a Unix timestamp in seconds. Midnight UTC of the corresponding date will be used. Defaults to the current date.
 *     responses:
 *       200:
 *         description: Successfully retrieved child daily lessons
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
 *         description: Bad Request - invalid studentId or invalid date parameter
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/daily-albums:
 *   get:
 *     summary: Get daily albums of a child's class
 *     description: Retrieve the daily albums (caption, album date, and associated photo URLs) for the class of a given child student. Defaults to the current date if not specified. Only accessible by parents associated with the child.
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
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Target date represented as a Unix timestamp in seconds. Midnight UTC of the corresponding date will be used. Defaults to the current date.
 *     responses:
 *       200:
 *         description: Successfully retrieved child daily albums
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
 *         description: Bad Request - invalid studentId or invalid date parameter
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/newsfeeds:
 *   get:
 *     summary: Get class newsfeeds of a child's class
 *     description: Retrieve all newsfeeds (posts with content, media URL, posting time, and teacher details who posted the newsfeed) for the class of a given child student. Only accessible by parents associated with the child.
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
 *         description: Successfully retrieved child class newsfeeds
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
 *                         example: sfgsdf
 *                       mediaUrl:
 *                         type: string
 *                         nullable: true
 *                         example: https://images.unsplash.com/photo-1540479859555-17...
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
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/menu:
 *   get:
 *     summary: Get daily menu of a child's class
 *     description: Retrieve the daily menu (dishes served for different meal types, e.g., Breakfast, Lunch, Snack, with calories and nutritional details) for the class of a given child student. Defaults to the current date if not specified. Only accessible by parents associated with the child.
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
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Target date represented as a Unix timestamp in seconds. Midnight UTC of the corresponding date will be used. Defaults to the current date.
 *     responses:
 *       200:
 *         description: Successfully retrieved child daily menu
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
 *         description: Bad Request - invalid studentId or invalid date parameter
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/children/{studentId}/daily-activities:
 *   get:
 *     summary: Get daily activities of a child
 *     description: Retrieve the daily activity behaviors (breakfast status, lunch status, nap status, snack status, hygiene status, and teacher comments/notes) recorded for a child on a specific date. Defaults to the current date if not specified. Only accessible by parents associated with the child.
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
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Target date represented as a Unix timestamp in seconds. Midnight local of the corresponding date will be used. Defaults to the current date.
 *     responses:
 *       200:
 *         description: Successfully retrieved child daily activities
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
 *         description: Bad Request - invalid studentId or invalid date parameter
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a parent or is not associated with this child
 *       500:
 *         description: Internal Server Error
 */




/**
 * @swagger
 * /parent/children/{studentId}/qr-token:
 *   get:
 *     summary: Generate QR attendance token for a child
 *     description: Generate a signed JWT (HS256) to be displayed as a QR code for teacher attendance scanning. Token expires in 60 seconds. Frontend should refresh every 60 seconds.
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
 *                       description: Signed JWT string to be rendered as QR code
 *                       example: eyJhbGciOiJIUzI1NiJ9...
 *                     expiresAt:
 *                       type: integer
 *                       description: Token expiry as Unix timestamp in seconds
 *                       example: 1719532860
 *                     ttl:
 *                       type: integer
 *                       description: Time-to-live in seconds
 *                       example: 60
 *       400:
 *         description: Bad Request - invalid studentId
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       403:
 *         description: Forbidden - student does not belong to this parent
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /parent/proxy-authorizations:
 *   post:
 *     summary: Create a proxy authorization for a child
 *     description: Submit a new authorization request for another person to check-in or check-out a child student. Optionally uploads a portrait photo of the proxy.
 *     tags: [Parent]
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
 *                 description: ID of the child student
 *                 example: 19
 *               authorizationDate:
 *                 type: integer
 *                 description: Unix timestamp in seconds for the authorization day (start of day)
 *                 example: 1782824107
 *               type:
 *                 type: string
 *                 enum: [checkin, checkout, both]
 *                 description: Type of authorization (checkin = Morning drop-off, checkout = Afternoon pickup, both = Both)
 *                 example: checkout
 *               proxyName:
 *                 type: string
 *                 description: Full name of the proxy person
 *                 example: "Nguyễn Văn B"
 *               proxyPhone:
 *                 type: string
 *                 description: Phone number of the proxy person
 *                 example: "0901234567"
 *               proxyIDCard:
 *                 type: string
 *                 description: ID card number (CCCD/CMND) of the proxy person
 *                 example: "079123456789"
 *               notes:
 *                 type: string
 *                 description: Additional notes/description of the proxy person
 *                 example: "Là chú của bé, đi xe Lead đỏ"
 *               proxyPhoto:
 *                 type: string
 *                 format: binary
 *                 description: Portrait image file of the proxy person
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
 *                   example: "Đăng ký ủy quyền đưa đón thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     authorizationId:
 *                       type: integer
 *                       example: 12
 *       400:
 *         description: Bad Request - Validation failed or invalid format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Student does not belong to this parent
 *       500:
 *         description: Internal Server Error
 * 
 * /parent/children/{studentId}/proxy-authorizations:
 *   get:
 *     summary: Get proxy authorizations of a child
 *     description: Retrieve all active and past proxy authorizations submitted by the logged-in parent for a specific child student.
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
 *         example: 19
 *     responses:
 *       200:
 *         description: Successfully retrieved proxy authorizations list
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
 *                   example: "Lấy danh sách ủy quyền đón hộ thành công"
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
 *                         description: Unix timestamp of the day of authorization
 *                         example: 1782824107
 *                       type:
 *                         type: string
 *                         enum: [checkin, checkout, both]
 *                         example: checkout
 *                       proxyName:
 *                         type: string
 *                         example: "Nguyễn Văn B"
 *                       proxyPhone:
 *                         type: string
 *                         example: "0901234567"
 *                       proxyIDCard:
 *                         type: string
 *                         example: "079123456789"
 *                       proxyPhotoUrl:
 *                         type: string
 *                         nullable: true
 *                         example: "https://example.com/parents/proxy-photos/168910291.jpg"
 *                       notes:
 *                         type: string
 *                         nullable: true
 *                         example: "Là chú của bé, đi xe Lead đỏ"
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
 *         description: Forbidden - Student does not belong to this parent
 *       500:
 *         description: Internal Server Error
 * 
 * /parent/proxy-authorizations/{authorizationId}/cancel:
 *   patch:
 *     summary: Cancel a proxy authorization
 *     description: Cancel an active proxy authorization request. This is only allowed for requests with status 'Approved' that have not occurred yet.
 *     tags: [Parent]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: authorizationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the proxy authorization record
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
 *                   example: "Hủy ủy quyền đón hộ thành công"
 *       400:
 *         description: Bad Request - Authorization cannot be cancelled (e.g. already cancelled or completed)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Record does not belong to the logged-in parent's child
 *       404:
 *         description: Not Found - Proxy authorization not found
 *       500:
 *         description: Internal Server Error
 */
