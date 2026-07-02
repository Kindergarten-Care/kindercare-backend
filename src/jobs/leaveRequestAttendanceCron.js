import cron from 'node-cron';
import pool from '../config/db.js';
import logger from '../config/logger.js';

const getTodayTimestampVN = () => {
  const nowVN = new Date(Date.now() + 7 * 60 * 60 * 1000);
  return Math.floor(
    Date.UTC(nowVN.getUTCFullYear(), nowVN.getUTCMonth(), nowVN.getUTCDate()) / 1000
  );
};

const isWeekendVN = (timestamp) => {
  const day = new Date(timestamp * 1000).getUTCDay();
  return day === 0 || day === 6;
};

const applyLeaveRequestAttendance = async () => {
  const todayTimestamp = getTodayTimestampVN();

  if (isWeekendVN(todayTimestamp)) {
    logger.info('[LeaveRequestAttendanceCron] Bỏ qua vì hôm nay là Thứ 7/Chủ nhật');
    return;
  }

  try {
    // Chỉ xử lý đơn đã được duyệt (Approved) -> đánh dấu Excused (vắng có phép).
    // Đơn bị từ chối (Rejected) không cần xử lý ở đây: học sinh vẫn phải đi học bình
    // thường, nếu vắng thì attendanceCron.js (17:30) đã tự đánh Absent.
    const [leaveRequests] = await pool.query(
      `SELECT RequestID, StudentID
       FROM LeaveRequests
       WHERE Status = 'Approved'
         AND ? BETWEEN FromDate AND ToDate`,
      [todayTimestamp]
    );

    let updatedCount = 0;

    for (const lr of leaveRequests) {
      const [existing] = await pool.query(
        'SELECT AttendanceID FROM Attendances WHERE StudentID = ? AND AttendanceDate = ?',
        [lr.StudentID, todayTimestamp]
      );

      if (existing.length > 0) {
        continue;
      }

      await pool.query(
        `INSERT INTO Attendances (StudentID, AttendanceDate, Status)
         VALUES (?, ?, 'Excused')`,
        [lr.StudentID, todayTimestamp]
      );
      updatedCount += 1;
    }

    logger.info(
      `[LeaveRequestAttendanceCron] Đã đánh dấu Excused cho ${updatedCount}/${leaveRequests.length} học sinh có đơn nghỉ được duyệt (date: ${todayTimestamp})`
    );
  } catch (error) {
    logger.error(`[LeaveRequestAttendanceCron] Lỗi: ${error.message}`);
  }
};

// Chạy lúc 01:00 giờ Việt Nam, Thứ 2 - Thứ 6
cron.schedule('0 1 * * 1-5', applyLeaveRequestAttendance, {
  timezone: 'Asia/Ho_Chi_Minh',
});

logger.info('[LeaveRequestAttendanceCron] Đã đăng ký cron điểm danh theo đơn xin nghỉ (01:00 ICT, T2-T6)');
