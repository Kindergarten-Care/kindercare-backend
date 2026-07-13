// ─────────────────────────────────────────────────────────────
//  TAG DEFINITIONS
// ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   - name: "Billing"
 *     description: "Tuition plans, monthly invoices, surcharges and payments (Principal)"
 */

// ─────────────────────────────────────────────────────────────
//  GROUP 1 · Billing - Tuition Plans
//  POST /billing/students/:studentId/tuition-plan
// ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /billing/students/{studentId}/tuition-plan:
 *   post:
 *     summary: Register a tuition plan for a student
 *     description: Snapshots the student's MonthlyTuition (from BaseFees of the class's academic year), creates a StudentTuitionPlans record, and generates the first TUITION invoice for the starting cycle.
 *     tags: ["Billing"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 19
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [packageId]
 *             properties:
 *               packageId:
 *                 type: integer
 *                 example: 2
 *               startMonth:
 *                 type: string
 *                 description: "'MM-YYYY'. Default = current month."
 *                 example: "08-2026"
 *     responses:
 *       201:
 *         description: Tuition plan registered successfully
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
 *                   example: Đăng ký gói học phí thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     plan:
 *                       type: object
 *                       properties:
 *                         PlanID:
 *                           type: integer
 *                           example: 1
 *                         StudentID:
 *                           type: integer
 *                           example: 19
 *                         PackageID:
 *                           type: integer
 *                           example: 2
 *                         StartMonth:
 *                           type: string
 *                           example: "08-2026"
 *                         MonthlyTuitionSnapshot:
 *                           type: number
 *                           example: 4500000
 *                     tuitionInvoice:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         invoiceId:
 *                           type: integer
 *                           example: 8
 *                         tuitionFee:
 *                           type: number
 *                           example: 13500000
 *                         discountAmount:
 *                           type: number
 *                           example: 0
 *                         periodRange:
 *                           type: string
 *                           example: "08-2026 - 10-2026"
 *                         billingMonth:
 *                           type: string
 *                           example: "08-2026"
 *                     monthlyInvoice:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         invoiceId:
 *                           type: integer
 *                           example: 9
 *                         billingMonth:
 *                           type: string
 *                           example: "08-2026"
 *                         expectedMealFee:
 *                           type: number
 *                           example: 1495000
 *                         extracurricularFee:
 *                           type: number
 *                           example: 0
 *                         refundAmount:
 *                           type: number
 *                           example: 0
 *       400:
 *         description: Bad Request - missing packageId or no BaseFees configured for the student's academic year
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a principal
 *       404:
 *         description: Not Found - student or package not found
 *       500:
 *         description: Internal Server Error
 */

// ─────────────────────────────────────────────────────────────
//  GROUP 2 · Billing - Run Monthly Cron
//  POST /billing/run-monthly
// ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /billing/run-monthly:
 *   post:
 *     summary: Run monthly billing for the whole school
 *     description: >
 *       For every student with an Active tuition plan, generates a TUITION invoice if the cycle
 *       is due, and always generates a MONTHLY invoice. Generated invoices start as drafts
 *       (Published=0, DueDate=NULL) — they are invisible to parents until a principal reviews and
 *       publishes them via PATCH /billing/invoices/publish. Idempotent — safe to run multiple
 *       times for the same billingMonth (relies on UNIQUE(StudentID, BillingMonth, InvoiceType)).
 *       Can be called at any time during the month (not just day 1) to demo/test the flow without
 *       waiting for the real cron — omit billingMonth to default to the current month. This same
 *       endpoint is also what the cron calls automatically at 00:05 on day 1 of each month.
 *     tags: ["Billing"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               billingMonth:
 *                 type: string
 *                 description: "'MM-YYYY'. Default = current month."
 *                 example: "08-2026"
 *     responses:
 *       200:
 *         description: Monthly billing run completed
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
 *                   example: Chạy hóa đơn hàng tháng thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     billingMonth:
 *                       type: string
 *                       example: "08-2026"
 *                     generated:
 *                       type: object
 *                       properties:
 *                         tuition:
 *                           type: integer
 *                           example: 3
 *                         monthly:
 *                           type: integer
 *                           example: 42
 *                     skipped:
 *                       type: integer
 *                       description: Count of invoices skipped because they already existed (idempotent re-run)
 *                       example: 0
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a principal
 *       500:
 *         description: Internal Server Error
 */

// ─────────────────────────────────────────────────────────────
//  GROUP 3 · Billing - Surcharge
//  PATCH /billing/invoices/:invoiceId/surcharge
// ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /billing/invoices/{invoiceId}/surcharge:
 *   patch:
 *     summary: Add a surcharge to an invoice
 *     description: Adds (accumulates) an amount onto the invoice's Surcharge column. TotalAmount recalculates automatically as a generated column.
 *     tags: ["Billing"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100000
 *               note:
 *                 type: string
 *                 example: "Phụ thu hoạt động dã ngoại"
 *     responses:
 *       200:
 *         description: Surcharge added successfully
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
 *                   example: Thêm phụ thu thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoice:
 *                       type: object
 *                       description: Full updated Invoices row (raw DB column names)
 *       400:
 *         description: Bad Request - missing amount
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a principal
 *       404:
 *         description: Not Found - invoice not found
 *       500:
 *         description: Internal Server Error
 */

// ─────────────────────────────────────────────────────────────
//  GROUP 4 · Billing - Due Date
//  PATCH /billing/invoices/:invoiceId/due-date
// ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /billing/invoices/{invoiceId}/due-date:
 *   patch:
 *     summary: Update the due date of an invoice
 *     description: Manually overrides an invoice's DueDate (e.g. to grant a payment extension). Resets ReminderSentAt and OverdueReminderSentAt so the daily reminder cron re-evaluates against the new due date instead of skipping it as already-notified.
 *     tags: ["Billing"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dueDate]
 *             properties:
 *               dueDate:
 *                 type: string
 *                 description: "'YYYY-MM-DD', interpreted at 00:00 GMT+7"
 *                 example: "2026-08-20"
 *     responses:
 *       200:
 *         description: Due date updated successfully
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
 *                   example: Cập nhật hạn đóng thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoice:
 *                       type: object
 *                       description: Full updated Invoices row (raw DB column names)
 *       400:
 *         description: Bad Request - missing or invalid dueDate (must be YYYY-MM-DD)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a principal
 *       404:
 *         description: Not Found - invoice not found
 *       500:
 *         description: Internal Server Error
 */

// ─────────────────────────────────────────────────────────────
//  GROUP 5 · Billing - Publish (draft → visible to parents)
//  PATCH /billing/invoices/publish
//  PATCH /billing/invoices/:invoiceId/publish
// ─────────────────────────────────────────────────────────────

/**
 * @swagger
 * /billing/invoices/publish:
 *   patch:
 *     summary: Publish all draft TUITION/MONTHLY invoices of a billing month
 *     description: >
 *       TUITION and MONTHLY invoices are created as drafts (Published=0, DueDate=NULL) by the
 *       monthly billing cron so a principal can review/correct them (e.g. via the surcharge or
 *       due-date endpoints) before parents ever see them. This endpoint publishes every remaining
 *       draft of a given billingMonth: sets Published=1, PublishedAt=now, and DueDate=now+10 days
 *       — the due date is anchored to the actual publish time, not a fixed day of the billing
 *       month, so a late review never shortens the parent's payment window. EXTRACURRICULAR
 *       invoices are never affected — they are published immediately when created and are not
 *       part of this review workflow.
 *     tags: ["Billing"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [billingMonth]
 *             properties:
 *               billingMonth:
 *                 type: string
 *                 description: "'MM-YYYY'"
 *                 example: "08-2026"
 *     responses:
 *       200:
 *         description: Invoices published successfully
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
 *                   example: "Đã công khai 42 hóa đơn"
 *                 data:
 *                   type: object
 *                   properties:
 *                     billingMonth:
 *                       type: string
 *                       example: "08-2026"
 *                     publishedCount:
 *                       type: integer
 *                       example: 42
 *       400:
 *         description: Bad Request - missing billingMonth
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a principal
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /billing/invoices/{invoiceId}/publish:
 *   patch:
 *     summary: Publish a single draft TUITION/MONTHLY invoice
 *     description: >
 *       Use after correcting an individual invoice (surcharge, etc.) instead of publishing the
 *       whole month. Sets Published=1, PublishedAt=now, DueDate=now+10 days. Rejects
 *       EXTRACURRICULAR invoices (not part of this workflow) and invoices already published.
 *     tags: ["Billing"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 9
 *     responses:
 *       200:
 *         description: Invoice published successfully
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
 *                   example: Công khai hóa đơn thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoice:
 *                       type: object
 *                       description: Full updated Invoices row (raw DB column names)
 *       400:
 *         description: Bad Request - invoice is EXTRACURRICULAR or already published
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user is not a principal
 *       404:
 *         description: Not Found - invoice not found
 *       500:
 *         description: Internal Server Error
 */
