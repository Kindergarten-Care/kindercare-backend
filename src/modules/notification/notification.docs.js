/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: |
 *     Push notifications and FCM device token registry management.
 *
 *     **Real-time delivery via Socket.IO**
 *
 *     In addition to FCM push and the REST endpoints below, every notification created by
 *     `sendPushToUser` is also emitted in real time over Socket.IO to the recipient's private room.
 *
 *     - Connect: `io(SERVER_URL, { auth: { token: <JWT access token> } })`
 *     - Server verifies the JWT and joins the socket to room `user:${userId}`
 *     - Event name: `new_notification`
 *     - Payload shape matches the notification objects returned by `GET /notifications`
 *       (`notifId`, `userId`, `title`, `message`, `type`, `isRead`, `isCritical`, `dataPayload` as a JSON string, `createdAt`, `updatedAt`)
 *     - `dataPayload` is JSON-stringified; parse it client-side to read fields like `type`, `studentId`, etc.
 *     - Real-time delivery only reaches clients with an active socket connection (e.g. app in foreground);
 *       FCM push covers background/killed app state.
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
 * /notifications:
 *   get:
 *     summary: Lấy danh sách thông báo của người dùng
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thông báo
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
 *                   example: Lấy danh sách thông báo thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       notifId:
 *                         type: integer
 *                         example: 1
 *                       userId:
 *                         type: integer
 *                         example: 10
 *                       title:
 *                         type: string
 *                         example: Thông báo điểm danh
 *                       message:
 *                         type: string
 *                         example: Bé Nguyễn Văn A đã được điểm danh vào lúc 07:45
 *                       type:
 *                         type: string
 *                         example: ATTENDANCE
 *                       isRead:
 *                         type: integer
 *                         example: 0
 *                       isCritical:
 *                         type: integer
 *                         example: 0
 *                       dataPayload:
 *                         type: object
 *                         nullable: true
 *                         example: { "studentId": "123", "type": "ATTENDANCE" }
 *                       createdAt:
 *                         type: integer
 *                         example: 1719532800
 *                       updatedAt:
 *                         type: integer
 *                         example: 1719532800
 *       401:
 *         description: Unauthorized
 *
 * /notifications/read-all:
 *   put:
 *     summary: Đánh dấu tất cả thông báo là đã đọc
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
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
 *                   example: Đã đánh dấu tất cả là đã đọc
 *       401:
 *         description: Unauthorized
 *
 * /notifications/{id}/read:
 *   put:
 *     summary: Đánh dấu một thông báo là đã đọc
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thông báo (notifId)
 *         example: 1
 *     responses:
 *       200:
 *         description: Thành công
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
 *                   example: Đã đánh dấu đã đọc
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Không tìm thấy thông báo
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
 * 
 * /notifications:
 *   delete:
 *     summary: Delete all notifications of the authenticated user
 *     description: Permanently delete all notifications belonging to the currently logged-in user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted all notifications
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
 *                   example: Xóa tất cả thông báo thành công
 *       401:
 *         description: Unauthorized
 * 
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a specific notification
 *     description: Permanently delete a single notification by its ID for the authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the notification to delete (notifId)
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully deleted the notification
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
 *                   example: Xóa thông báo thành công
 *       400:
 *         description: Bad Request - invalid ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found or does not belong to the user
 * */

