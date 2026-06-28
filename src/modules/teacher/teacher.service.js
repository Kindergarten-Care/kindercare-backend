import pool from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { isJtiUsed, markJtiUsed } from '../../utils/qrTokenCache.js';

export const processAttendanceScan = async (qrToken) => {
  // Step 1 & 2: Verify signature and expiry
  let payload;
  try {
    payload = jwt.verify(qrToken, process.env.QR_TOKEN_SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Mã QR đã hết hạn, yêu cầu phụ huynh làm mới');
    }
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mã QR không hợp lệ');
  }

  // Step 3: Check jti not already used (replay attack prevention)
  if (isJtiUsed(payload.jti)) {
    throw new ApiError(httpStatus.CONFLICT, 'Mã QR đã được sử dụng');
  }

  const studentId = parseInt(payload.sub, 10);
  const now = Math.floor(Date.now() / 1000);

  // Step 4: Query today's attendance record
  const todayDate = new Date(now * 1000);
  const todayMidnight = Math.floor(
    Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()) / 1000
  );

  const [attendanceRows] = await pool.query(
    `SELECT AttendanceID, CheckInTime, CheckOutTime, Status
     FROM Attendances
     WHERE StudentID = ? AND AttendanceDate = ?`,
    [studentId, todayMidnight]
  );

  const existing = attendanceRows[0] || null;

  // Step 5: Determine attendance type
  let attendanceType;
  if (!existing) {
    attendanceType = 'checkin';
  } else if (existing.CheckInTime && !existing.CheckOutTime) {
    attendanceType = 'checkout';
  } else if (existing.CheckInTime && existing.CheckOutTime) {
    throw new ApiError(httpStatus.CONFLICT, 'Bé đã điểm danh đủ cả ngày');
  } else {
    // Has record but no CheckInTime (absent/excused/holiday) — allow checkin
    attendanceType = 'checkin';
  }

  // Step 6: Mark jti as used before DB write (prevents concurrent replays)
  markJtiUsed(payload.jti, payload.exp);

  // Step 7: Write attendance to DB
  if (attendanceType === 'checkin') {
    if (!existing) {
      await pool.query(
        `INSERT INTO Attendances (StudentID, AttendanceDate, Status, CheckInTime)
         VALUES (?, ?, 'Present', ?)`,
        [studentId, todayMidnight, now]
      );
    } else {
      await pool.query(
        `UPDATE Attendances SET CheckInTime = ?, Status = 'Present' WHERE AttendanceID = ?`,
        [now, existing.AttendanceID]
      );
    }
  } else {
    await pool.query(
      `UPDATE Attendances SET CheckOutTime = ? WHERE AttendanceID = ?`,
      [now, existing.AttendanceID]
    );
  }

  // Fetch student info for response
  const [studentRows] = await pool.query(
    `SELECT
       s.StudentID  AS studentId,
       s.FullName   AS fullName,
       c.ClassName  AS className,
       cp.CampusName AS campusName
     FROM Students s
     LEFT JOIN Classes c   ON s.ClassID = c.ClassID
     LEFT JOIN Buildings b ON c.BuildingID = b.BuildingID
     LEFT JOIN Campuses cp ON b.CampusID = cp.CampusID
     WHERE s.StudentID = ?`,
    [studentId]
  );

  const student = studentRows[0];
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thông tin học sinh');
  }

  // Format time as HH:MM in UTC+7
  const utc7 = now + 7 * 3600;
  const d = new Date(utc7 * 1000);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');

  return {
    studentId: student.studentId,
    fullName: student.fullName,
    className: student.className,
    campusName: student.campusName,
    attendanceType,
    time: `${hh}:${mm}`,
  };
};
