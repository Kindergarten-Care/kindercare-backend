import pool from '../../config/db.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';

/**
 * Register or update device FCM token.
 * 
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
export const registerToken = async (req, res) => {
  const { token, deviceType } = req.body;
  const userId = req.user.userId;
  const now = Math.floor(Date.now() / 1000);

  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token property is required.');
  }

  // Upsert token in fcm_tokens
  await pool.query(
    `INSERT INTO fcm_tokens (UserID, DeviceToken, DeviceType, CreatedAt, UpdatedAt) 
     VALUES (?, ?, ?, ?, ?) 
     ON DUPLICATE KEY UPDATE UpdatedAt = ?`,
    [userId, token, deviceType || 'web', now, now, now]
  );

  res.status(httpStatus.OK).send(new ApiResponse(httpStatus.OK, null, 'Device token registered/synchronized.'));
};

/**
 * Retrieve Firebase client credentials configuration.
 * 
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
export const getFirebaseConfig = async (req, res) => {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };
  res.status(httpStatus.OK).send(new ApiResponse(httpStatus.OK, config, 'Firebase client configuration retrieved.'));
};
