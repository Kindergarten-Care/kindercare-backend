import admin from '../../config/firebase.js';
import pool from '../../config/db.js';
import logger from '../../config/logger.js';

/**
 * Send push notification to a specific user.
 * It writes the notification to the DB and triggers FCM multicast for all of their registered devices.
 * Removes expired/invalid tokens automatically.
 *
 * @param {number} userId - The ID of the recipient user.
 * @param {string} title - Notification title.
 * @param {string} body - Notification body/message text.
 * @param {object} [dataPayload] - Optional extra metadata payload (values must be strings).
 * @returns {Promise<void>}
 */
export const sendPushToUser = async (userId, title, body, dataPayload = {}) => {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // 1. Insert history trail into the pre-existing Notifications table
    const type = dataPayload.type || 'System';
    await pool.query(
      `INSERT INTO Notifications (UserID, Title, Message, Type, IsRead, IsCritical, CreatedAt) 
       VALUES (?, ?, ?, ?, 0, 0, ?)`,
      [userId, title, body, type, currentTimestamp]
    );

    // 2. Extract multi-device tracking registration tokens from DB
    const [tokens] = await pool.query(
      'SELECT DeviceToken FROM fcm_tokens WHERE UserID = ?',
      [userId]
    );

    if (!tokens || tokens.length === 0) {
      logger.info(`[FCM Engine] No registered device tokens found for UserID: ${userId}`);
      return;
    }

    const registrationTokens = tokens.map((t) => t.DeviceToken);

    // 3. Assemble structural Multicast notification schema
    // Ensure all data payload values are strings (FCM requirement)
    const stringifiedData = {};
    for (const [key, value] of Object.entries(dataPayload)) {
      stringifiedData[key] = String(value);
    }

    const message = {
      notification: { title, body },
      data: stringifiedData,
      tokens: registrationTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    logger.info(`[FCM Engine] Delivered ${response.successCount} messages, failed ${response.failureCount} messages for UserID: ${userId}`);

    // 4. Automatically filter and prune expired or uninstalled device tokens
    if (response.failureCount > 0) {
      const badTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errCode = resp.error?.code;
          if (
            errCode === 'messaging/invalid-registration-token' ||
            errCode === 'messaging/registration-token-not-registered'
          ) {
            badTokens.push(registrationTokens[idx]);
          }
        }
      });

      if (badTokens.length > 0) {
        await pool.query('DELETE FROM fcm_tokens WHERE DeviceToken IN (?)', [badTokens]);
        logger.info(`[FCM Engine] Pruned ${badTokens.length} uninstalled/expired registration tokens.`);
      }
    }
  } catch (error) {
    logger.error(`[FCM Engine] Delivery runtime thread failure for UserID ${userId}: ${error.message}`);
  }
};
