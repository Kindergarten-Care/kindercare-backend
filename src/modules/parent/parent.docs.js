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


