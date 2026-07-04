import { getMessaging } from 'firebase-admin/messaging';
import firebaseApp from '../../config/firebase.js';
import pool from '../../config/db.js';
import logger from '../../config/logger.js';
import { emitNotificationToUser } from '../../config/socket.js';

export const sendPushToUser = async (userId, title, body, dataPayload = {}, isCritical = false) => {
  try {
    const now = Math.floor(Date.now() / 1000);

    // 1. Persist notification log to DB
    const [result] = await pool.query(
      `INSERT INTO Notifications (UserID, Title, Message, Type, IsRead, IsCritical, DataPayload, CreatedAt, UpdatedAt)
       VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)`,
      [userId, title, body, dataPayload.type || 'GENERAL', isCritical ? 1 : 0, JSON.stringify(dataPayload), now, now]
    );

    // 2. Emit real-time socket event to the user's private room
    const newNotification = {
      notifId:     result.insertId,
      userId,
      title,
      message:     body,
      type:        dataPayload.type || 'GENERAL',
      isRead:      0,
      isCritical:  isCritical ? 1 : 0,
      dataPayload: JSON.stringify(dataPayload),
      createdAt:   now,
      updatedAt:   now,
    };
    emitNotificationToUser(userId, newNotification);

    // 3. Get registered device tokens
    const [tokens] = await pool.query('SELECT DeviceToken FROM fcm_tokens WHERE UserID = ?', [userId]);

    if (!tokens || tokens.length === 0) {
      logger.info(`[FCM] No registered tokens for UserID: ${userId}`);
      return;
    }

    const tokenList = tokens.map((t) => t.DeviceToken);

    // 4. Stringify all data values (FCM requirement)
    const stringifiedData = {};
    for (const [key, value] of Object.entries(dataPayload)) {
      stringifiedData[key] = String(value);
    }
    stringifiedData.isCritical = String(isCritical);

    // 5. Send multicast
    const message = {
      notification: { title, body },
      data: stringifiedData,
      tokens: tokenList,
      android: { priority: isCritical ? 'high' : 'normal' },
      apns: { headers: { 'apns-priority': isCritical ? '10' : '5' } },
    };

    const response = await getMessaging(firebaseApp).sendEachForMulticast(message);
    logger.info(`[FCM] Sent ${response.successCount} ok, ${response.failureCount} failed for UserID: ${userId}`);

    // 6. Prune invalid tokens
    if (response.failureCount > 0) {
      const badTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const code = resp.error?.code;
          if (
            code === 'messaging/invalid-registration-token' ||
            code === 'messaging/registration-token-not-registered'
          ) {
            badTokens.push(tokenList[idx]);
          }
        }
      });

      if (badTokens.length > 0) {
        await pool.query('DELETE FROM fcm_tokens WHERE DeviceToken IN (?)', [badTokens]);
        logger.info(`[FCM] Pruned ${badTokens.length} invalid tokens.`);
      }
    }
  } catch (error) {
    logger.error(`[FCM] sendPushToUser failed for UserID ${userId}: ${error.message}`);
  }
};

