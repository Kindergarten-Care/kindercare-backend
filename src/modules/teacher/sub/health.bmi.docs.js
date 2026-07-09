/**
 * @swagger
 * tags:
 *   name: TeacherHealthBMI
 *   description: Quản lý chỉ số BMI (Height/Weight → BE tự tính) theo kỳ
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BmiLogDto:
 *       type: object
 *       properties:
 *         recordId:
 *           type: integer
 *           nullable: true
 *           description: RecordID của bản ghi BMI mới nhất (null nếu học sinh chưa đo kỳ này)
 *         studentId:
 *           type: integer
 *         studentName:
 *           type: string
 *         avatarUrl:
 *           type: string
 *           nullable: true
 *         termPeriod:
 *           type: string
 *           example: "2026-07"
 *         height:
 *           type: number
 *           nullable: true
 *           description: Chiều cao (cm)
 *         weight:
 *           type: number
 *           nullable: true
 *           description: Cân nặng (kg)
 *         bmi:
 *           type: number
 *           nullable: true
 *           description: BMI = weight / (height/100)^2, làm tròn 2 chữ số
 *         notes:
 *           type: string
 *           nullable: true
 *         measuredAt:
 *           type: integer
 *           nullable: true
 *           description: Epoch seconds
 *         history:
 *           type: array
 *           description: Lịch sử tất cả bản ghi BMI của học sinh trong kỳ này (bao gồm bản cũ đã bị upsert)
 *           items:
 *             $ref: '#/components/schemas/BmiLogDto'
 */

/**
 * @swagger
 * /teacher/classes/{classId}/student-health/bmi:
 *   get:
 *     summary: Lấy danh sách BMI theo kỳ của cả lớp
 *     tags: [TeacherHealthBMI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: termPeriod
 *         required: true
 *         schema: { type: string, pattern: '^\d{4}-(0[1-9]|1[0-2])$' }
 *         example: "2026-07"
 *       - in: query
 *         name: studentId
 *         required: false
 *         schema: { type: integer }
 *         description: Lọc 1 học sinh
 *       - in: query
 *         name: includeOverwritten
 *         required: false
 *         schema: { type: boolean, default: true }
 *         description: Có trả về lịch sử các bản ghi cũ đã bị upsert hay không
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
 *                     logs:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/BmiLogDto' }
 *
 *   post:
 *     summary: Tạo 1 bản ghi BMI (BE tự tính BMI từ height/weight)
 *     tags: [TeacherHealthBMI]
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
 *             required: [studentId, termPeriod, height, weight]
 *             properties:
 *               studentId: { type: integer }
 *               termPeriod: { type: string, example: "2026-07" }
 *               height: { type: number, minimum: 50, maximum: 200, description: "cm" }
 *               weight: { type: number, minimum: 3,  maximum: 100, description: "kg" }
 *               notes: { type: string, maxLength: 1000 }
 *               measuredAt: { type: integer, description: "Epoch seconds (optional, default = now)" }
 *     responses:
 *       201:
 *         description: Created
 *       400: { description: Validation failed }
 *       403: { description: Teacher not assigned to class / Student not in class }
 *       404: { description: Student not found }
 *
 *   put:
 *     summary: Batch upsert BMI theo kỳ (cho nhiều học sinh cùng lúc)
 *     description: |
 *       - Với mỗi record (studentId, termPeriod): nếu đã có bản ghi IsLatest=1 → set IsLatest=0 rồi INSERT bản mới với IsLatest=1 (giữ lịch sử).
 *       - Validate tất cả studentId phải thuộc class & Active; nếu có 1 cái không hợp lệ → toàn bộ transaction rollback.
 *     tags: [TeacherHealthBMI]
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
 *             required: [termPeriod, records]
 *             properties:
 *               termPeriod: { type: string, example: "2026-07" }
 *               records:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [studentId, height, weight]
 *                   properties:
 *                     studentId: { type: integer }
 *                     height: { type: number, minimum: 50, maximum: 200 }
 *                     weight: { type: number, minimum: 3,  maximum: 100 }
 *                     notes: { type: string, maxLength: 1000 }
 *                     measuredAt: { type: integer }
 *     responses:
 *       200:
 *         description: OK - trả về danh sách BMI mới nhất của cả lớp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     logs:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/BmiLogDto' }
 *       400: { description: Validation failed or invalid studentIds }
 *       403: { description: Teacher not assigned to class }
 */

/**
 * @swagger
 * /teacher/classes/{classId}/student-health/bmi/item/{logId}:
 *   patch:
 *     summary: Sửa 1 bản ghi BMI (BE sẽ tính lại BMI nếu height/weight đổi)
 *     tags: [TeacherHealthBMI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: logId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               height: { type: number, minimum: 50, maximum: 200 }
 *               weight: { type: number, minimum: 3,  maximum: 100 }
 *               notes:  { type: string, maxLength: 1000 }
 *     responses:
 *       200:
 *         description: OK
 *       400: { description: Validation failed }
 *       403: { description: Not authorized for this class }
 *       404: { description: BMI log not found }
 *
 *   delete:
 *     summary: Xóa 1 bản ghi BMI (xóa cứng)
 *     tags: [TeacherHealthBMI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: logId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 *       403: { description: Not authorized }
 *       404: { description: Not found }
 */