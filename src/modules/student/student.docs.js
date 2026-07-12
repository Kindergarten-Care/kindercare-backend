/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student roster list operations (attendance, medications, and details)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StudentRosterDto:
 *       type: object
 *       properties:
 *         studentId:
 *           type: integer
 *           description: Unique ID of the student
 *         fullName:
 *           type: string
 *           description: Full name of the student
 *         nickname:
 *           type: string
 *           nullable: true
 *           description: Nickname of the student
 *         team:
 *           type: string
 *           nullable: true
 *           description: Team or group assignment of the student
 *         classId:
 *           type: integer
 *           nullable: true
 *           description: Associated class ID
 */

/**
 * @swagger
 * /students/{studentId}/attendance-history:
 *   get:
 *     summary: Retrieve monthly attendance history for a student
 *     description: Returns daily attendance records for the specified month mapped to clean status states (PRESENT, PERMISSION_ABSENCE, UNEXCUSED_ABSENCE).
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{4}-(0[1-9]|1[0-2])$'
 *         example: "2026-07"
 *         description: Month query in YYYY-MM format
 *     responses:
 *       200:
 *         description: Successfully retrieved attendance history
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
 *                   example: "Tải lịch sử chuyên cần thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2026-07-09"
 *                       status:
 *                         type: string
 *                         enum: [PRESENT, PERMISSION_ABSENCE, UNEXCUSED_ABSENCE]
 *                         example: "PRESENT"
 *       400:
 *         description: Validation failed or missing parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (requires Principal or Teacher role)
 *       404:
 *         description: Student not found
 * 
 * /students/{studentId}/medications/today:
 *   get:
 *     summary: Retrieve today's medication requests for a student
 *     description: Returns medications scheduled to be administered to the student today.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Successfully retrieved today's medication list
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
 *                   example: "Tải danh sách đơn thuốc hôm nay thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       medRequestId:
 *                         type: integer
 *                       studentId:
 *                         type: integer
 *                       parentId:
 *                         type: integer
 *                       medicineName:
 *                         type: string
 *                       dosage:
 *                         type: string
 *                       frequency:
 *                         type: string
 *                       scheduledTime:
 *                         type: string
 *                       parentNote:
 *                         type: string
 *                       status:
 *                         type: string
 *                       notes:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (requires Principal or Teacher role)
 *       404:
 *         description: Student not found
 * 
 * /students/{studentId}:
 *   patch:
 *     summary: Update a student's nickname and/or team assignment
 *     description: Allows teachers or principals to update student nickname and team.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 maxLength: 50
 *                 nullable: true
 *                 example: "Bin"
 *               team:
 *                 type: string
 *                 maxLength: 50
 *                 nullable: true
 *                 example: "Tổ 1"
 *     responses:
 *       200:
 *         description: Student details updated successfully
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
 *                   example: "Cập nhật thông tin học sinh thành công"
 *                 data:
 *                   $ref: '#/components/schemas/StudentRosterDto'
 *       400:
 *         description: Validation failed or missing parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (requires Principal or Teacher role)
 *       404:
 *         description: Student not found
 */
