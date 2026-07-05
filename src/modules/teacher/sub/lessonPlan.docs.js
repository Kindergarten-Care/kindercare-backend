/**
 * @swagger
 * tags:
 *   name: TeacherLessonPlans
 *   description: Teacher endpoints to author and manage weekly lesson plans (Giáo án).
 */

/**
 * @swagger
 * /teacher/lesson-plans:
 *   get:
 *     summary: List lesson plans for the logged-in teacher
 *     description: |
 *       Returns the lesson plans authored by the currently authenticated teacher.
 *       Supports filtering by status, class, and academic year.
 *     tags: [TeacherLessonPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Draft, Submitted, UnderReview, Approved, Rejected, RevisionRequested]
 *         description: Filter by workflow status
 *       - in: query
 *         name: classId
 *         schema:
 *           type: integer
 *         description: Filter by class id
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by calendar year, e.g. 2026
 *     responses:
 *       200:
 *         description: Successfully retrieved the lesson plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LessonPlanApiDto'
 *       400:
 *         description: Bad Request - Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not a teacher
 */

/**
 * @swagger
 * /teacher/lesson-plans/{id}:
 *   get:
 *     summary: Get detail of a lesson plan (with items)
 *     tags: [TeacherLessonPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lesson plan id
 *     responses:
 *       200:
 *         description: Successfully retrieved the lesson plan detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonPlanApiDto'
 *       404:
 *         description: Lesson plan not found or not owned by teacher
 */

/**
 * @swagger
 * /teacher/lesson-plans:
 *   post:
 *     summary: Create or update a lesson plan (upsert)
 *     description: |
 *       - If `lessonPlanId` is null/omitted, a new draft plan is created.
 *       - If `lessonPlanId` is provided and the plan is in `Draft` or
 *         `RevisionRequested`, the plan and ALL its items are overwritten.
 *       - Each call completely replaces `LessonPlanItems` for the plan.
 *     tags: [TeacherLessonPlans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonPlanUpsertRequest'
 *     responses:
 *       200:
 *         description: Lesson plan saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonPlanApiDto'
 *       400:
 *         description: Validation failed or status does not allow editing
 *       403:
 *         description: Teacher is not assigned to the supplied class
 *       409:
 *         description: Duplicate plan for the same (class, week, year)
 */

/**
 * @swagger
 * /teacher/lesson-plans/{id}/submit:
 *   post:
 *     summary: Submit a lesson plan for principal review
 *     tags: [TeacherLessonPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 description: Optional note addressed to the principal
 *     responses:
 *       200:
 *         description: Plan submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonPlanApiDto'
 *       400:
 *         description: Plan is not in a submittable state
 *       404:
 *         description: Lesson plan not found
 */

/**
 * @swagger
 * /teacher/lesson-plans/{id}/withdraw:
 *   post:
 *     summary: Withdraw a submitted lesson plan back to draft
 *     tags: [TeacherLessonPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan withdrawn successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonPlanApiDto'
 *       400:
 *         description: Plan is not in a withdrawable state
 *       404:
 *         description: Lesson plan not found
 */

/**
 * @swagger
 * /teacher/lesson-plans/{id}/items/{itemId}/complete:
 *   patch:
 *     summary: Mark a lesson-plan item (one period) as completed/uncompleted
 *     description: |
 *       Flipping `isCompleted` to true is only allowed when the parent plan
 *       is no longer in `Draft`/`RevisionRequested` (i.e. it must have been
 *       submitted, reviewed, or already approved).
 *     tags: [TeacherLessonPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isCompleted]
 *             properties:
 *               isCompleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Item updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LessonPlanItemApiDto'
 *       400:
 *         description: Plan status does not allow completion
 *       404:
 *         description: Plan or item not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LessonPlanStatus:
 *       type: string
 *       enum: [Draft, Submitted, UnderReview, Approved, Rejected, RevisionRequested]
 *     DayOfWeek:
 *       type: string
 *       enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *     LessonSubject:
 *       type: string
 *       enum: [lang, math, art, music, world, phys, other]
 *     LessonPlanItemApiDto:
 *       type: object
 *       properties:
 *         itemId:
 *           type: integer
 *           example: 8
 *         lessonPlanId:
 *           type: integer
 *           example: 2
 *         dayOfWeek:
 *           $ref: '#/components/schemas/DayOfWeek'
 *         subject:
 *           $ref: '#/components/schemas/LessonSubject'
 *         startTime:
 *           type: string
 *           nullable: true
 *           example: "08:45:00"
 *         endTime:
 *           type: string
 *           nullable: true
 *           example: "09:15:00"
 *         title:
 *           type: string
 *           example: "Quan sát các loài cá"
 *         objective:
 *           type: string
 *           nullable: true
 *         activityDetails:
 *           type: string
 *           nullable: true
 *         materials:
 *           type: string
 *           nullable: true
 *         teacherNote:
 *           type: string
 *           nullable: true
 *         isCompleted:
 *           type: boolean
 *         completedAt:
 *           type: integer
 *           nullable: true
 *           description: Epoch seconds
 *         orderIndex:
 *           type: integer
 *           example: 1
 *     LessonPlanApiDto:
 *       type: object
 *       properties:
 *         lessonPlanId:
 *           type: integer
 *         teacherId:
 *           type: integer
 *         teacherName:
 *           type: string
 *           nullable: true
 *         classId:
 *           type: integer
 *         className:
 *           type: string
 *           nullable: true
 *         yearId:
 *           type: integer
 *         weekNumber:
 *           type: integer
 *         year:
 *           type: integer
 *         weekStartDate:
 *           type: integer
 *           description: Epoch seconds (Monday 00:00)
 *         weekEndDate:
 *           type: integer
 *           description: Epoch seconds (Sunday 23:59)
 *         weekTheme:
 *           type: string
 *           nullable: true
 *         monthTheme:
 *           type: string
 *           nullable: true
 *         weeklyGoal:
 *           type: string
 *           nullable: true
 *         note:
 *           type: string
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/LessonPlanStatus'
 *         submittedAt:
 *           type: integer
 *           nullable: true
 *         reviewedById:
 *           type: integer
 *           nullable: true
 *         reviewedByName:
 *           type: string
 *           nullable: true
 *         reviewedAt:
 *           type: integer
 *           nullable: true
 *         reviewerComment:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: integer
 *         updatedAt:
 *           type: integer
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LessonPlanItemApiDto'
 *     LessonPlanUpsertRequest:
 *       type: object
 *       required: [classId, yearId, weekNumber, year, weekStartDate, weekEndDate]
 *       properties:
 *         lessonPlanId:
 *           type: integer
 *           nullable: true
 *           description: null when creating a new plan
 *         classId:
 *           type: integer
 *         yearId:
 *           type: integer
 *         weekNumber:
 *           type: integer
 *         year:
 *           type: integer
 *         weekStartDate:
 *           type: integer
 *         weekEndDate:
 *           type: integer
 *         weekTheme:
 *           type: string
 *           nullable: true
 *         monthTheme:
 *           type: string
 *           nullable: true
 *         weeklyGoal:
 *           type: string
 *           nullable: true
 *         note:
 *           type: string
 *           nullable: true
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             required: [dayOfWeek, subject, title]
 *             properties:
 *               dayOfWeek:
 *                 $ref: '#/components/schemas/DayOfWeek'
 *               subject:
 *                 $ref: '#/components/schemas/LessonSubject'
 *               startTime:
 *                 type: string
 *                 nullable: true
 *               endTime:
 *                 type: string
 *                 nullable: true
 *               title:
 *                 type: string
 *               objective:
 *                 type: string
 *                 nullable: true
 *               activityDetails:
 *                 type: string
 *                 nullable: true
 *               materials:
 *                 type: string
 *                 nullable: true
 *               teacherNote:
 *                 type: string
 *                 nullable: true
 *               orderIndex:
 *                 type: integer
 */