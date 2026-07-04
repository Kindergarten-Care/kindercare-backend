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
 *     description: For every student with an Active tuition plan, generates a TUITION invoice if the cycle is due, and always generates a MONTHLY invoice. Idempotent — safe to run multiple times for the same billingMonth (relies on UNIQUE(StudentID, BillingMonth, InvoiceType)). Intended for manual triggering during testing; in production it also runs automatically via cron at 00:05 on day 1 of each month.
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
