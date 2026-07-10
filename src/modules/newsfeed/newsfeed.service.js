import pool from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';

export const getNewsfeedsByClass = async (classId, teacherId) => {
  const [rows] = await pool.query(
    `SELECT 
       n.PostID AS postId,
       n.ClassID AS classId,
       n.TeacherID AS teacherId,
       n.Content AS content,
       n.MediaURL AS mediaUrl,
       n.PostedAt AS postedAt,
       t.FullName AS teacherName,
       u.AvatarURL AS teacherAvatar
     FROM Newsfeeds n
     LEFT JOIN Teachers t ON n.TeacherID = t.TeacherID
     LEFT JOIN Users u ON t.UserID = u.UserID
     WHERE n.ClassID = ?
     ORDER BY n.PostedAt DESC`,
    [classId]
  );
  return rows;
};

export const createNewsfeed = async (classId, teacherId, content, mediaUrl) => {
  const now = Math.floor(Date.now() / 1000);
  const [result] = await pool.query(
    `INSERT INTO Newsfeeds (ClassID, TeacherID, Content, MediaURL, PostedAt)
     VALUES (?, ?, ?, ?, ?)`,
    [classId, teacherId, content, mediaUrl || null, now]
  );
  return {
    postId: result.insertId,
    classId,
    teacherId,
    content,
    mediaUrl,
    postedAt: now,
  };
};

export const deleteNewsfeed = async (postId, teacherId) => {
  const [result] = await pool.query(
    `DELETE FROM Newsfeeds WHERE PostID = ? AND TeacherID = ?`,
    [postId, teacherId]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy bài đăng hoặc bạn không có quyền xóa');
  }
};
