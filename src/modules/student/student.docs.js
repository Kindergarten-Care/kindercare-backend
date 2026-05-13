/**
 * @openapi
 * /student:
 *   get:
 *     summary: Retrieve a list of all students
 *     description: Fetch all student records from the database, ordered by full name.
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Fetch all students successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       StudentID:
 *                         type: integer
 *                       FullName:
 *                         type: string
 *                       DateOfBirth:
 *                         type: string
 *                         format: date
 *                       Gender:
 *                         type: string
 *                       Allergies:
 *                         type: string
 *                       EnrollmentStatus:
 *                         type: string
 *                       ClassID:
 *                         type: integer
 */
