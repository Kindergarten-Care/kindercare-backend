import cron from 'node-cron';
import pool from '../config/db.js';
import logger from '../config/logger.js';

const markAbsentStudents = async () => {
  // Lấy ngày hôm nay theo giờ Việt Nam (UTC+7)
  const nowVN = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const todayTimestamp = Math.floor(
    Date.UTC(nowVN.getUTCFullYear(), nowVN.getUTCMonth(), nowVN.getUTCDate()) / 1000
  );

  try {
    const [result] = await pool.query(
      `INSERT INTO Attendances (StudentID, AttendanceDate, Status)
       SELECT s.StudentID, ?, 'Absent'
       FROM Students s
       WHERE s.EnrollmentStatus = 'Active'
         AND NOT EXISTS (
           SELECT 1 FROM Attendances a
           WHERE a.StudentID = s.StudentID AND a.AttendanceDate = ?
         )
         AND NOT EXISTS (
           SELECT 1 FROM LeaveRequests lr
           WHERE lr.StudentID = s.StudentID
             AND lr.Status = 'Approved'
             AND ? BETWEEN lr.FromDate AND lr.ToDate
         )`,
      [todayTimestamp, todayTimestamp, todayTimestamp]
    );

    logger.info(`[AttendanceCron] Đã đánh dấu ${result.affectedRows} học sinh vắng không phép (date: ${todayTimestamp})`);
  } catch (error) {
    logger.error(`[AttendanceCron] Lỗi: ${error.message}`);
  }
};

// Chạy lúc 17:30 giờ Việt Nam, Thứ 2 - Thứ 6
cron.schedule('30 17 * * 1-5', markAbsentStudents, {
  timezone: 'Asia/Ho_Chi_Minh',
});

logger.info('[AttendanceCron] Đã đăng ký cron điểm danh (17:30 ICT, T2-T6)');
