/**
 * @swagger
 * /api/v1/teacher/classes/{classId}/students/detailed:
 *   get:
 *     summary: Retrieve a detailed list of active students in a specific class
 *     description: Fetches all active students belonging to the specified class ID. The response includes the student's personal information, latest health records, and associated parent details.
 *     tags:
 *       - Teachers
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the class (e.g., 1 for Mầm 1).
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the detailed list of active students.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Detailed student list retrieved successfully"
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
 *                         example: "Nguyễn Minh Khang"
 *                       dateOfBirth:
 *                         type: integer
 *                         description: Unix timestamp of birth date
 *                         example: 1684108800
 *                       gender:
 *                         type: string
 *                         example: "Nam"
 *                       allergies:
 *                         type: string
 *                         example: "Dị ứng lạc"
 *                       enrollmentStatus:
 *                         type: string
 *                         example: "Active"
 *                       avatarUrl:
 *                         type: string
 *                         nullable: true
 *                         example: "https://media.kindercare.app/Student_Avatar.jpg"
 *                       latestHealthRecord:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           recordId:
 *                             type: integer
 *                             example: 1
 *                           termPeriod:
 *                             type: string
 *                             example: "HK1 2026"
 *                           height:
 *                             type: number
 *                             format: float
 *                             example: 110.5
 *                           weight:
 *                             type: number
 *                             format: float
 *                             example: 20.2
 *                           bmi:
 *                             type: number
 *                             format: float
 *                             example: 16.5
 *                       parents:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             parentId:
 *                               type: integer
 *                               example: 4
 *                             fullName:
 *                               type: string
 *                               example: "Nguyễn Anh Tuấn"
 *                             relationship:
 *                               type: string
 *                               example: "Ba"
 *                             phoneNumber:
 *                               type: string
 *                               example: "0911111111"
 *                             isPrimary:
 *                               type: boolean
 *                               example: true
 *       400:
 *         description: Bad Request - Invalid classId format.
 *       404:
 *         description: Not Found - Class does not exist.
 *       500:
 *         description: Internal Server Error.
 */

// Dòng code này bắt buộc phải có để hệ thống nhận diện file này là một Module hợp lệ
export const teacherDocs = {};