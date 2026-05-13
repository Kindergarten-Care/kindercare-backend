/**
 * @openapi
 * /invoice/student/{studentId}:
 *   get:
 *     summary: Get student invoices
 *     description: Retrieve all invoices associated with a specific student ID, including tuition and meal fees.
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the student to fetch invoices for.
 *     responses:
 *       200:
 *         description: Successfully retrieved student invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       InvoiceID:
 *                         type: integer
 *                       StudentID:
 *                         type: integer
 *                       BillingMonth:
 *                         type: string
 *                       TuitionFee:
 *                         type: string
 *                       ExpectedMealFee:
 *                         type: string
 *                       TotalAmount:
 *                         type: string
 *                       PaymentStatus:
 *                         type: string
 *                         enum: [Paid, Unpaid]
 */
