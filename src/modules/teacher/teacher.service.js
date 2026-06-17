import pool from '../../config/db.js';

/**
 * Get all classes assigned to a teacher
 * @param {number} teacherId 
 * @returns {Promise<Array>} Classes
 */
export const getTeacherClasses = async (teacherId) => {
  const query = `
    SELECT ct.ClassID AS classId, c.ClassName AS className
    FROM ClassTeachers ct
    JOIN Classes c ON ct.ClassID = c.ClassID
    WHERE ct.TeacherID = ?
  `;
  const [rows] = await pool.query(query, [teacherId]);
  return rows;
};

/**
 * Get today's attendance stats for a specific class
 * @param {number} classId 
 * @param {number} todayTimestamp Unix timestamp (seconds) for start of day
 * @returns {Promise<Object>} Attendance statistics
 */
export const getClassDashboardStats = async (classId, todayTimestamp) => {
  const [totalResult] = await pool.query(
    'SELECT COUNT(*) AS totalStudents FROM Students WHERE ClassID = ? AND EnrollmentStatus = "Active"',
    [classId]
  );
  const totalStudents = totalResult[0]?.totalStudents || 0;

  const attendanceQuery = `
    SELECT 
      SUM(CASE WHEN a.Status IN ('Present', 'Có mặt') THEN 1 ELSE 0 END) AS presentCount,
      SUM(CASE WHEN a.Status IN ('Absent', 'Vắng', 'Vắng không phép') THEN 1 ELSE 0 END) AS absentCount,
      SUM(CASE WHEN a.Status IN ('Excused', 'Vắng có phép', 'Phép') THEN 1 ELSE 0 END) AS excusedCount
    FROM Students s
    LEFT JOIN Attendances a ON s.StudentID = a.StudentID AND a.AttendanceDate = ?
    WHERE s.ClassID = ? AND s.EnrollmentStatus = "Active"
  `;
  const [attendanceResult] = await pool.query(attendanceQuery, [todayTimestamp, classId]);
  const present = Number(attendanceResult[0]?.presentCount || 0);
  const absent = Number(attendanceResult[0]?.absentCount || 0);
  const excused = Number(attendanceResult[0]?.excusedCount || 0);
  const noAttendance = Math.max(0, totalStudents - (present + absent + excused));

  return {
    totalStudents,
    present,
    absent,
    excused,
    noAttendance,
  };
};

/**
 * Get pending leave requests count for a class
 * @param {number} classId 
 * @returns {Promise<number>} Count of pending leaves
 */
export const getPendingLeaveRequestsCount = async (classId) => {
  const query = `
    SELECT COUNT(*) AS pendingCount
    FROM LeaveRequests lr
    JOIN Students s ON lr.StudentID = s.StudentID
    WHERE s.ClassID = ? AND lr.Status = 'Pending'
  `;
  const [rows] = await pool.query(query, [classId]);
  return rows[0]?.pendingCount || 0;
};

/**
 * Get profile of a teacher
 * @param {number} teacherId 
 * @returns {Promise<Object|null>} Teacher profile
 */
export const getTeacherProfile = async (teacherId) => {
  const query = `
    SELECT 
      t.TeacherID AS teacherId,
      u.Username AS username,
      u.AvatarURL AS avatarUrl,
      t.FullName AS fullName,
      t.PhoneNumber AS phoneNumber,
      t.Email AS email,
      t.DateOfBirth AS dateOfBirth,
      t.Gender AS gender,
      t.IDCard AS idCard,
      t.Address AS address,
      t.ProfessionalRank AS professionalRank,
      t.WorkStatus AS workStatus
    FROM Teachers t
    JOIN Users u ON t.TeacherID = u.UserID
    WHERE t.TeacherID = ?
  `;
  const [rows] = await pool.query(query, [teacherId]);
  return rows[0] || null;
};

/**
 * Update teacher profile details in database
 * @param {number} teacherId 
 * @param {Object} data Update fields
 * @returns {Promise<Object>} Updated profile
 */
export const updateTeacherProfile = async (teacherId, data) => {
  const { fullName, phoneNumber, email, dateOfBirth, gender, idCard, address, avatarUrl } = data;
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const updateTeacherQuery = `
      UPDATE Teachers 
      SET FullName = ?, PhoneNumber = ?, Email = ?, DateOfBirth = ?, Gender = ?, IDCard = ?, Address = ?
      WHERE TeacherID = ?
    `;
    await connection.query(updateTeacherQuery, [
      fullName,
      phoneNumber,
      email,
      dateOfBirth,
      gender,
      idCard,
      address,
      teacherId
    ]);

    if (avatarUrl !== undefined) {
      await connection.query(
        'UPDATE Users SET AvatarURL = ? WHERE UserID = ?',
        [avatarUrl, teacherId]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return getTeacherProfile(teacherId);
};

/**
 * Get leave requests for a teacher's classes
 * @param {number} teacherId 
 * @param {string} [status] Optional filter by status
 * @returns {Promise<Array>} Leave requests
 */
export const getLeaveRequestsForTeacher = async (teacherId, status) => {
  let query = `
    SELECT 
      lr.RequestID AS requestId,
      lr.StudentID AS studentId,
      s.FullName AS studentName,
      c.ClassName AS className,
      lr.ParentID AS parentId,
      p.FullName AS parentName,
      lr.FromDate AS fromDate,
      lr.ToDate AS toDate,
      lr.Reason AS reason,
      lr.EvidenceURL AS evidenceUrl,
      lr.Status AS status,
      lr.IsMealFeeDeducted AS isMealFeeDeducted
    FROM LeaveRequests lr
    JOIN Students s ON lr.StudentID = s.StudentID
    JOIN Classes c ON s.ClassID = c.ClassID
    JOIN ClassTeachers ct ON c.ClassID = ct.ClassID
    LEFT JOIN Parents p ON lr.ParentID = p.ParentID
    WHERE ct.TeacherID = ?
  `;

  const params = [teacherId];
  if (status) {
    query += ' AND lr.Status = ?';
    params.push(status);
  }

  query += ' ORDER BY lr.RequestID DESC';

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get detailed leave request by ID
 * @param {number} requestId 
 * @returns {Promise<Object|null>} Leave request with student's ClassID
 */
export const getLeaveRequestById = async (requestId) => {
  const query = `
    SELECT lr.*, s.ClassID AS classId
    FROM LeaveRequests lr
    JOIN Students s ON lr.StudentID = s.StudentID
    WHERE lr.RequestID = ?
  `;
  const [rows] = await pool.query(query, [requestId]);
  return rows[0] || null;
};

/**
 * Check if a teacher is assigned to a specific class
 * @param {number} teacherId 
 * @param {number} classId 
 * @returns {Promise<boolean>} True if assigned
 */
export const isTeacherAssignedToClass = async (teacherId, classId) => {
  const query = `
    SELECT 1 
    FROM ClassTeachers 
    WHERE TeacherID = ? AND ClassID = ?
  `;
  const [rows] = await pool.query(query, [teacherId, classId]);
  return rows.length > 0;
};

/**
 * Update the status and approver of a leave request
 * @param {number} requestId 
 * @param {string} status 
 * @param {number} teacherId 
 * @returns {Promise<boolean>} True if updated
 */
export const updateLeaveRequestStatus = async (requestId, status, teacherId) => {
  const query = `
    UPDATE LeaveRequests
    SET Status = ?, ApproverID = ?
    WHERE RequestID = ?
  `;
  const [result] = await pool.query(query, [status, teacherId, requestId]);
  return result.affectedRows > 0;
};

/**
 * Upsert attendance record for a student on a specific date
 * @param {number} studentId 
 * @param {number} date 
 * @param {string} status 
 * @param {number} [checkInTime] 
 * @param {number} [checkOutTime] 
 * @param {string} [pickedUpBy] 
 */
export const upsertAttendance = async (studentId, date, status, checkInTime = null, checkOutTime = null, pickedUpBy = null) => {
  const checkQuery = 'SELECT AttendanceID FROM Attendances WHERE StudentID = ? AND AttendanceDate = ?';
  const [rows] = await pool.query(checkQuery, [studentId, date]);

  if (rows.length > 0) {
    const updateQuery = `
      UPDATE Attendances
      SET Status = ?, CheckInTime = ?, CheckOutTime = ?, PickedUpBy = ?
      WHERE StudentID = ? AND AttendanceDate = ?
    `;
    await pool.query(updateQuery, [status, checkInTime, checkOutTime, pickedUpBy, studentId, date]);
  } else {
    const insertQuery = `
      INSERT INTO Attendances (StudentID, AttendanceDate, Status, CheckInTime, CheckOutTime, PickedUpBy)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertQuery, [studentId, date, status, checkInTime, checkOutTime, pickedUpBy]);
  }
};

/**
 * Check if a student belongs to a specific class
 * @param {number} studentId 
 * @param {number} classId 
 * @returns {Promise<boolean>} True if student is in the class
 */
export const isStudentInClass = async (studentId, classId) => {
  const query = 'SELECT 1 FROM Students WHERE StudentID = ? AND ClassID = ?';
  const [rows] = await pool.query(query, [studentId, classId]);
  return rows.length > 0;
};

/**
 * Get student details of a class with attendance status and active leave request for a specific date
 * @param {number} classId
 * @param {number} dateTimestamp
 * @returns {Promise<Array>} List of students with attendance and leave status
 */
export const getClassStudentsAttendance = async (classId, dateTimestamp) => {
  const query = `
    SELECT 
      s.StudentID AS studentId,
      s.FullName AS fullName,
      s.AvatarURL AS avatarUrl,
      a.Status AS status,
      a.CheckInTime AS checkInTime,
      a.CheckOutTime AS checkOutTime,
      (
        SELECT lr.RequestID
        FROM LeaveRequests lr
        WHERE lr.StudentID = s.StudentID AND ? BETWEEN lr.FromDate AND lr.ToDate
        ORDER BY lr.RequestID DESC
        LIMIT 1
      ) AS leaveRequestId,
      (
        SELECT lr.Status
        FROM LeaveRequests lr
        WHERE lr.StudentID = s.StudentID AND ? BETWEEN lr.FromDate AND lr.ToDate
        ORDER BY lr.RequestID DESC
        LIMIT 1
      ) AS leaveRequestStatus,
      (
        SELECT lr.Reason
        FROM LeaveRequests lr
        WHERE lr.StudentID = s.StudentID AND ? BETWEEN lr.FromDate AND lr.ToDate
        ORDER BY lr.RequestID DESC
        LIMIT 1
      ) AS leaveRequestReason,
      (
        SELECT da.TeacherNote
        FROM DailyActivities da
        WHERE da.StudentID = s.StudentID AND da.ActivityDate = ?
        LIMIT 1
      ) AS healthNote
    FROM Students s
    LEFT JOIN Attendances a ON s.StudentID = a.StudentID AND a.AttendanceDate = ?
    WHERE s.ClassID = ? AND s.EnrollmentStatus = 'Active'
    ORDER BY s.FullName
  `;
  const [rows] = await pool.query(query, [
    dateTimestamp,
    dateTimestamp,
    dateTimestamp,
    dateTimestamp,
    dateTimestamp,
    classId
  ]);

  return rows.map(row => ({
    studentId: row.studentId,
    fullName: row.fullName,
    avatarUrl: row.avatarUrl,
    status: row.status || null,
    checkInTime: row.checkInTime ? Number(row.checkInTime) : null,
    checkOutTime: row.checkOutTime ? Number(row.checkOutTime) : null,
    healthNote: row.healthNote || null,
    leaveRequest: row.leaveRequestId ? {
      requestId: row.leaveRequestId,
      status: row.leaveRequestStatus,
      reason: row.leaveRequestReason
    } : null
  }));
};
