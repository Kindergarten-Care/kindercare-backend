/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication operations
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: General Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Username
 *                 example: admin_it
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: admin_it
 *                         roleId:
 *                           type: integer
 *                           example: 1
 *                         roleName:
 *                           type: string
 *                           example: Admin
 *                         fullName:
 *                           type: string
 *                           nullable: true
 *                           example: John Doe
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account disabled
 */

/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Admin Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Username
 *                 example: admin_it
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                         username:
 *                           type: string
 *                         roleId:
 *                           type: integer
 *                         roleName:
 *                           type: string
 *                         fcmToken:
 *                           type: string
 *                           nullable: true
 *                         fullName:
 *                           type: string
 *                           nullable: true
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Access denied or account disabled
 */

/**
 * @swagger
 * /auth/principal/login:
 *   post:
 *     summary: Principal Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Username
 *                 example: hieutruong_mai
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                         username:
 *                           type: string
 *                         roleId:
 *                           type: integer
 *                         roleName:
 *                           type: string
 *                         fcmToken:
 *                           type: string
 *                           nullable: true
 *                         fullName:
 *                           type: string
 *                           nullable: true
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Access denied or account disabled
 */

/**
 * @swagger
 * /auth/teacher/login:
 *   post:
 *     summary: Teacher Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Username
 *                 example: gv_lan
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                         username:
 *                           type: string
 *                         roleId:
 *                           type: integer
 *                         roleName:
 *                           type: string
 *                         fcmToken:
 *                           type: string
 *                           nullable: true
 *                         fullName:
 *                           type: string
 *                           nullable: true
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Access denied or account disabled
 */

/**
 * @swagger
 * /auth/parent/login:
 *   post:
 *     summary: Parent Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Username, email, or phone number
 *                 example: ph_tuan
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                         username:
 *                           type: string
 *                         roleId:
 *                           type: integer
 *                         roleName:
 *                           type: string
 *                         fcmToken:
 *                           type: string
 *                           nullable: true
 *                         fullName:
 *                           type: string
 *                           nullable: true
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Access denied or account disabled
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
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
 *                   example: Logout successful
 *                 data:
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Invalid or expired token
 */
