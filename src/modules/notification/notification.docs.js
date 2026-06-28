/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Push notifications and FCM device token registry management
 */

/**
 * @swagger
 * /notifications/register-token:
 *   post:
 *     summary: Register or synchronize FCM device token
 *     description: Associate an FCM registration token with the authenticated user for multi-device push notification delivery.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: The Firebase Cloud Messaging registration token.
 *                 example: "fcm_mock_token_string_alpha_numeric_key_123"
 *               deviceType:
 *                 type: string
 *                 description: Type of device (e.g., web, ios, android).
 *                 default: "web"
 *                 example: "web"
 *     responses:
 *       200:
 *         description: Device registered/synchronized successfully
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
 *                   example: "Device token registered/synchronized."
 *       400:
 *         description: Missing token property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Token property is required."
 *       401:
 *         description: Unauthorized - missing or invalid token
 * 
 * /notifications/firebase-config:
 *   get:
 *     summary: Retrieve Firebase client SDK configuration parameters
 *     description: Retrieve public Firebase project configuration credentials required for initializing the client Firebase Web SDK.
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Configuration parameters successfully retrieved
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
 *                   example: "Firebase client configuration retrieved."
 *                 data:
 *                   type: object
 *                   properties:
 *                     apiKey:
 *                       type: string
 *                       example: "AIzaSyA1_TEST_MOCK_KEY_XYZ"
 *                     authDomain:
 *                       type: string
 *                       example: "kindercare-test.firebaseapp.com"
 *                     projectId:
 *                       type: string
 *                       example: "kindercare-test"
 *                     storageBucket:
 *                       type: string
 *                       example: "kindercare-test.appspot.com"
 *                     messagingSenderId:
 *                       type: string
 *                       example: "1111111111"
 *                     appId:
 *                       type: string
 *                       example: "1:1111111111:web:testabc123"
 */
