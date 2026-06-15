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
