import pool from '../../config/db.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';

export const registerToken = async (req, res) => {
  const { token, deviceType } = req.body;
  const userId = req.user.userId;
  const now = Math.floor(Date.now() / 1000);

  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token là bắt buộc');
  }

  await pool.query(
    `INSERT INTO fcm_tokens (UserID, DeviceToken, DeviceType, CreatedAt, UpdatedAt)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE UpdatedAt = ?`,
    [userId, token, deviceType || 'web', now, now, now]
  );

  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, null, 'Đăng ký thiết bị thành công'));
};

export const getFirebaseConfig = async (_req, res) => {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };
  res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, config, 'Lấy cấu hình Firebase thành công'));
};

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const [rows] = await pool.query(
      `SELECT
         NotifID    AS notifId,
         UserID     AS userId,
         Title      AS title,
         Message    AS message,
         Type       AS type,
         IsRead     AS isRead,
         IsCritical AS isCritical,
         DataPayload AS dataPayload,
         CreatedAt  AS createdAt,
         UpdatedAt  AS updatedAt
       FROM Notifications
       WHERE UserID = ?
       ORDER BY CreatedAt DESC`,
      [userId]
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, rows, 'Lấy danh sách thông báo thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const notifId = parseInt(req.params.id, 10);
    const now = Math.floor(Date.now() / 1000);

    if (isNaN(notifId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'notifId không hợp lệ');
    }

    const [result] = await pool.query(
      `UPDATE Notifications SET IsRead = 1, UpdatedAt = ? WHERE NotifID = ? AND UserID = ?`,
      [now, notifId, userId]
    );

    if (result.affectedRows === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thông báo');
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Đã đánh dấu đã đọc')
    );
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const now = Math.floor(Date.now() / 1000);

    await pool.query(
      `UPDATE Notifications SET IsRead = 1, UpdatedAt = ? WHERE UserID = ? AND IsRead = 0`,
      [now, userId]
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Đã đánh dấu tất cả là đã đọc')
    );
  } catch (error) {
    next(error);
  }
};
