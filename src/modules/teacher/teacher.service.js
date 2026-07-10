import pool from '../../config/db.js';

/**
 * Get the single active class assigned to a teacher (only AcademicYears with IsActive = 1).
 * A teacher is assigned to at most one class at any given time.
 * @param {number} teacherId
 * @returns {Promise<Object|null>} Class info with academic year, or null if not assigned.
 */
export const getTeacherActiveClass = async (teacherId) => {
  const [rows] = await pool.query(
    `SELECT
        c.ClassID    AS classId,
        c.ClassName  AS className,
        c.GradeID    AS gradeId,
        c.YearID     AS yearId,
        ct.RoleInClass AS roleInClass,
        ay.YearName  AS academicYearName,
        ay.StartDate AS academicYearStartDate,
        ay.EndDate   AS academicYearEndDate,
        ay.IsActive  AS academicYearIsActive
     FROM ClassTeachers ct
     JOIN Classes       c  ON ct.ClassID = c.ClassID
     JOIN AcademicYears ay ON c.YearID    = ay.YearID
     WHERE ct.TeacherID  = ?
       AND ay.IsActive   = 1
     LIMIT 1`,
    [teacherId]
  );
  return rows[0] ?? null;
};

/**
 * Get all classes assigned to a teacher
 * @param {number} teacherId
 * @returns {Promise<Array>} Classes
 */
export const getTeacherClasses = async (teacherId) => {
  const query = `
    SELECT 
      ct.ClassID AS classId, 
      c.ClassName AS className,
      c.YearID AS yearId,
      (SELECT COUNT(*) FROM Students s WHERE s.ClassID = c.ClassID AND s.EnrollmentStatus = 'Active') AS studentCount
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
      SUM(CASE WHEN resolved_status IN ('Present', 'Có mặt') THEN 1 ELSE 0 END) AS presentCount,
      SUM(CASE WHEN resolved_status IN ('Absent', 'Vắng', 'Vắng không phép') THEN 1 ELSE 0 END) AS absentCount,
      SUM(CASE WHEN resolved_status IN ('Excused', 'Vắng có phép', 'Phép') THEN 1 ELSE 0 END) AS excusedCount
    FROM (
      SELECT 
        s.StudentID,
        COALESCE(a.Status, (
          SELECT CASE 
            WHEN lr.Status = 'Approved' THEN 'Excused'
            WHEN lr.Status = 'Rejected' THEN 'Absent'
            ELSE NULL 
          END
          FROM LeaveRequests lr
          WHERE lr.StudentID = s.StudentID AND ? BETWEEN lr.FromDate AND lr.ToDate
          ORDER BY lr.RequestID DESC
          LIMIT 1
        )) AS resolved_status
      FROM Students s
      LEFT JOIN Attendances a ON s.StudentID = a.StudentID AND a.AttendanceDate = ?
      WHERE s.ClassID = ? AND s.EnrollmentStatus = "Active"
    ) AS student_resolved
  `;
  const [attendanceResult] = await pool.query(attendanceQuery, [
    todayTimestamp,
    todayTimestamp,
    classId
  ]);
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
 * Get Teacher Work History
 */
export const getTeacherWorkHistory = async (teacherId) => {
  const query = `
    SELECT 
      HistoryID AS historyId,
      Title AS title,
      Tag AS tag,
      Description AS description,
      Kind AS kind,
      EventDate AS eventDate
    FROM TeacherWorkHistories
    WHERE TeacherID = ?
    ORDER BY EventDate DESC
  `;
  const [rows] = await pool.query(query, [teacherId]);
  return rows;
};

/**
 * Get Teacher Settings
 */
export const getTeacherSettings = async (userId) => {
  const query = `
    SELECT 
      EmailEnabled AS emailEnabled,
      PushEnabled AS pushEnabled,
      WeeklyReportEnabled AS weeklyReportEnabled
    FROM NotificationSettings
    WHERE UserID = ?
  `;
  const [rows] = await pool.query(query, [userId]);
  // Trả về default nếu chưa có setting
  if (rows.length === 0) {
    return {
      emailEnabled: 1,
      pushEnabled: 1,
      weeklyReportEnabled: 0
    };
  }
  return rows[0];
};

/**
 * Update Teacher Settings
 */
export const updateTeacherSettings = async (userId, settings) => {
  const { emailEnabled, pushEnabled, weeklyReportEnabled } = settings;
  const query = `
    INSERT INTO NotificationSettings (UserID, EmailEnabled, PushEnabled, WeeklyReportEnabled)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      EmailEnabled = VALUES(EmailEnabled),
      PushEnabled = VALUES(PushEnabled),
      WeeklyReportEnabled = VALUES(WeeklyReportEnabled)
  `;
  await pool.query(query, [userId, emailEnabled, pushEnabled, weeklyReportEnabled]);
  return true;
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
      s.ClassID AS classId,
      lr.StudentID AS studentId,
      s.FullName AS studentName,
      s.AvatarURL AS studentAvatar,
      c.ClassName AS className,
      lr.ParentID AS parentId,
      p.FullName AS parentName,
      lr.FromDate AS fromDate,
      lr.ToDate AS toDate,
      lr.Reason AS reason,
      lr.EvidenceURL AS evidenceUrl,
      lr.Status AS status,
      lr.IsMealFeeDeducted AS isMealFeeDeducted,
      lr.ParentNotes AS parentNotes,
      lr.ApproverID AS approverId,
      lr.CreatedAt AS createdAt
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
 * Get detailed leave request by ID and TeacherID
 * @param {number} requestId 
 * @param {number} teacherId 
 * @returns {Promise<Object|null>} Detailed leave request
 */
export const getLeaveRequestDetail = async (requestId, teacherId) => {
  const query = `
    SELECT 
      lr.RequestID AS requestId,
      s.ClassID AS classId,
      lr.StudentID AS studentId,
      s.FullName AS studentName,
      s.AvatarURL AS studentAvatar,
      c.ClassName AS className,
      lr.ParentID AS parentId,
      p.FullName AS parentName,
      p.PhoneNumber AS parentPhone,
      lr.FromDate AS fromDate,
      lr.ToDate AS toDate,
      lr.Reason AS reason,
      lr.EvidenceURL AS evidenceUrl,
      lr.Status AS status,
      lr.IsMealFeeDeducted AS isMealFeeDeducted,
      lr.ParentNotes AS parentNotes,
      lr.ApproverID AS approverId,
      lr.CreatedAt AS createdAt
    FROM LeaveRequests lr
    JOIN Students s ON lr.StudentID = s.StudentID
    JOIN Classes c ON s.ClassID = c.ClassID
    JOIN ClassTeachers ct ON c.ClassID = ct.ClassID
    LEFT JOIN Parents p ON lr.ParentID = p.ParentID
    WHERE lr.RequestID = ? AND ct.TeacherID = ?
  `;
  const [rows] = await pool.query(query, [requestId, teacherId]);
  return rows[0] || null;
};

/**
 * Get leave request by ID (internal use)
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
export const upsertAttendance = async (
  studentId, 
  date, 
  status, 
  checkInTime = null, 
  checkOutTime = null, 
  pickedUpByParentId = null,
  droppedOffByParentId = null,
  checkedInByTeacherId = null,
  checkedOutByTeacherId = null,
  proxyAuthorizationId = null
) => {
  const checkQuery = 'SELECT AttendanceID FROM Attendances WHERE StudentID = ? AND AttendanceDate = ?';
  const [rows] = await pool.query(checkQuery, [studentId, date]);

  if (rows.length > 0) {
    const updateQuery = `
      UPDATE Attendances
      SET Status = ?, CheckInTime = ?, CheckOutTime = ?, PickedUpByParentID = ?, DroppedOffByParentID = ?, CheckedInByTeacherID = ?, CheckedOutByTeacherID = ?, ProxyAuthorizationID = ?
      WHERE StudentID = ? AND AttendanceDate = ?
    `;
    await pool.query(updateQuery, [
      status, 
      checkInTime, 
      checkOutTime, 
      pickedUpByParentId, 
      droppedOffByParentId, 
      checkedInByTeacherId, 
      checkedOutByTeacherId, 
      proxyAuthorizationId, 
      studentId, 
      date
    ]);
  } else {
    const insertQuery = `
      INSERT INTO Attendances (StudentID, AttendanceDate, Status, CheckInTime, CheckOutTime, PickedUpByParentID, DroppedOffByParentID, CheckedInByTeacherID, CheckedOutByTeacherID, ProxyAuthorizationID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertQuery, [
      studentId, 
      date, 
      status, 
      checkInTime, 
      checkOutTime, 
      pickedUpByParentId, 
      droppedOffByParentId, 
      checkedInByTeacherId, 
      checkedOutByTeacherId, 
      proxyAuthorizationId
    ]);
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
      COALESCE(a.Status, (
        SELECT CASE 
          WHEN lr.Status = 'Approved' THEN 'Excused'
          WHEN lr.Status = 'Rejected' THEN 'Absent'
          ELSE NULL 
        END
        FROM LeaveRequests lr
        WHERE lr.StudentID = s.StudentID AND ? BETWEEN lr.FromDate AND lr.ToDate
        ORDER BY lr.RequestID DESC
        LIMIT 1
      )) AS status,
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
        SELECT pa.AuthorizationID
        FROM ProxyAuthorizations pa
        WHERE pa.StudentID = s.StudentID AND pa.AuthorizationDate = ? AND pa.Status = 'Approved'
        LIMIT 1
      ) AS proxyAuthorizationId,
      (
        SELECT pa.ProxyName
        FROM ProxyAuthorizations pa
        WHERE pa.StudentID = s.StudentID AND pa.AuthorizationDate = ? AND pa.Status = 'Approved'
        LIMIT 1
      ) AS proxyName,
      (
        SELECT pa.ProxyPhone
        FROM ProxyAuthorizations pa
        WHERE pa.StudentID = s.StudentID AND pa.AuthorizationDate = ? AND pa.Status = 'Approved'
        LIMIT 1
      ) AS proxyPhone,
      (
        SELECT pa.ProxyIDCard
        FROM ProxyAuthorizations pa
        WHERE pa.StudentID = s.StudentID AND pa.AuthorizationDate = ? AND pa.Status = 'Approved'
        LIMIT 1
      ) AS proxyIDCard,
      (
        SELECT pa.ProxyPhotoURL
        FROM ProxyAuthorizations pa
        WHERE pa.StudentID = s.StudentID AND pa.AuthorizationDate = ? AND pa.Status = 'Approved'
        LIMIT 1
      ) AS proxyPhotoUrl,
      (
        SELECT pa.Notes
        FROM ProxyAuthorizations pa
        WHERE pa.StudentID = s.StudentID AND pa.AuthorizationDate = ? AND pa.Status = 'Approved'
        LIMIT 1
      ) AS proxyNotes,
      (
        SELECT pa.Type
        FROM ProxyAuthorizations pa
        WHERE pa.StudentID = s.StudentID AND pa.AuthorizationDate = ? AND pa.Status = 'Approved'
        LIMIT 1
      ) AS proxyType,
      da.TeacherNote AS healthNote,
      da.BreakfastStatus AS breakfastStatus,
      da.LunchStatus AS lunchStatus,
      da.SnackStatus AS snackStatus,
      da.NapStatus AS napStatus,
      da.HygieneStatus AS hygieneStatus,
      da.TeacherNote AS teacherNote
    FROM Students s
    LEFT JOIN Attendances a ON s.StudentID = a.StudentID AND a.AttendanceDate = ?
    LEFT JOIN DailyActivities da ON s.StudentID = da.StudentID AND da.LogDate = FROM_UNIXTIME(?, '%Y-%m-%d')
    WHERE s.ClassID = ? AND s.EnrollmentStatus = 'Active'
    ORDER BY s.FullName
  `;
  const [rows] = await pool.query(query, [
    dateTimestamp, // 1: leave status
    dateTimestamp, // 2: leaveRequestId
    dateTimestamp, // 3: leaveRequestStatus
    dateTimestamp, // 4: leaveRequestReason
    dateTimestamp, // 5: proxyAuthorizationId
    dateTimestamp, // 6: proxyName
    dateTimestamp, // 7: proxyPhone
    dateTimestamp, // 8: proxyIDCard
    dateTimestamp, // 9: proxyPhotoUrl
    dateTimestamp, // 10: proxyNotes
    dateTimestamp, // 11: proxyType
    dateTimestamp, // 12: Attendances join
    dateTimestamp, // 13: DailyActivities join
    classId        // 14: classId
  ]);

  return rows.map(row => ({
    studentId: row.studentId,
    fullName: row.fullName,
    avatarUrl: row.avatarUrl,
    status: row.status || null,
    checkInTime: row.checkInTime ? Number(row.checkInTime) : null,
    checkOutTime: row.checkOutTime ? Number(row.checkOutTime) : null,
    healthNote: row.healthNote || null,
    breakfastStatus: row.breakfastStatus || null,
    lunchStatus: row.lunchStatus || null,
    snackStatus: row.snackStatus || null,
    napStatus: row.napStatus || null,
    hygieneStatus: row.hygieneStatus || null,
    teacherNote: row.teacherNote || null,
    leaveRequest: row.leaveRequestId ? {
      requestId: row.leaveRequestId,
      status: row.leaveRequestStatus,
      reason: row.leaveRequestReason
    } : null,
    hasProxy: row.proxyAuthorizationId ? true : false,
    proxyInfo: row.proxyAuthorizationId ? {
      authorizationId: row.proxyAuthorizationId,
      proxyName: row.proxyName,
      proxyPhone: row.proxyPhone,
      proxyIDCard: row.proxyIDCard,
      proxyPhotoUrl: row.proxyPhotoUrl,
      notes: row.proxyNotes,
      type: row.proxyType
    } : null
  }));
};

/**
 * Get class meal menu for a specific date
 * @param {number} classId 
 * @param {number} dateTimestamp Unix timestamp (seconds) for start of day
 * @returns {Promise<Array>} List of menu items
 */
export const getClassMenu = async (classId, dateTimestamp) => {
  const query = `
    SELECT 
      md.MenuDetailID AS menuDetailId,
      md.MenuID AS menuId,
      md.DayOfWeek AS dayOfWeek,
      md.MealType AS mealType,
      md.DishName AS dishName,
      md.Calories AS calories,
      md.NutritionalDetails AS nutritionalDetails
    FROM Menus m
    JOIN MenuDetails md ON m.MenuID = md.MenuID
    WHERE m.ClassID = ? 
      AND m.Year = YEAR(FROM_UNIXTIME(?))
      AND m.WeekNumber = WEEK(FROM_UNIXTIME(?), 1)
      AND md.DayOfWeek = DAYNAME(FROM_UNIXTIME(?))
    ORDER BY FIELD(md.MealType, 'Breakfast', 'Lunch', 'Snack')
  `;
  const [rows] = await pool.query(query, [classId, dateTimestamp, dateTimestamp, dateTimestamp]);
  return rows;
};

/**
 * Update class meal menu for a specific date
 * @param {number} classId 
 * @param {number} dateTimestamp Unix timestamp (seconds) for start of day
 * @param {Object} menuData - contains breakfastMenu, lunchMenu, afternoonSnackMenu
 * @returns {Promise<boolean>}
 */
export const updateClassMenu = async (classId, dateTimestamp, menuData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Find or create Menu for this week
    const findMenuQuery = `
      SELECT MenuID 
      FROM Menus 
      WHERE ClassID = ? 
        AND Year = YEAR(FROM_UNIXTIME(?))
        AND WeekNumber = WEEK(FROM_UNIXTIME(?), 1)
    `;
    const [menuRows] = await connection.query(findMenuQuery, [classId, dateTimestamp, dateTimestamp]);
    
    let menuId;
    if (menuRows.length > 0) {
      menuId = menuRows[0].MenuID;
    } else {
      const insertMenuQuery = `
        INSERT INTO Menus (ClassID, WeekNumber, Year, MenuName)
        VALUES (?, WEEK(FROM_UNIXTIME(?), 1), YEAR(FROM_UNIXTIME(?)), 'Thực đơn tuần')
      `;
      const [insertResult] = await connection.query(insertMenuQuery, [classId, dateTimestamp, dateTimestamp]);
      menuId = insertResult.insertId;
    }

    // Determine DayOfWeek in English
    const [dayRows] = await connection.query(`SELECT DAYNAME(FROM_UNIXTIME(?)) as dayName`, [dateTimestamp]);
    const dayOfWeek = dayRows[0].dayName;

    // Remove existing menu details for that day
    const deleteQuery = `DELETE FROM MenuDetails WHERE MenuID = ? AND DayOfWeek = ?`;
    await connection.query(deleteQuery, [menuId, dayOfWeek]);

    // Insert new menu details
    const insertQuery = `
      INSERT INTO MenuDetails (MenuID, DayOfWeek, MealType, DishName) 
      VALUES (?, ?, ?, ?)
    `;

    if (menuData.breakfastMenu) {
      await connection.query(insertQuery, [menuId, dayOfWeek, 'Breakfast', menuData.breakfastMenu]);
    }
    if (menuData.lunchMenu) {
      await connection.query(insertQuery, [menuId, dayOfWeek, 'Lunch', menuData.lunchMenu]);
    }
    if (menuData.afternoonSnackMenu) {
      await connection.query(insertQuery, [menuId, dayOfWeek, 'Snack', menuData.afternoonSnackMenu]);
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Upsert daily activity status for a student on a specific date
 */
export const upsertDailyActivity = async (studentId, dateTimestamp, data) => {
  const { breakfastStatus, lunchStatus, snackStatus, napStatus, hygieneStatus, teacherNote, photoUrl, activityStatus, recordedBy } = data;
  
  // Convert UNIX timestamp to YYYY-MM-DD string
  const dateObj = new Date(dateTimestamp * 1000);
  const logDate = dateObj.toISOString().split('T')[0];

  const checkQuery = 'SELECT ActivityID FROM DailyActivities WHERE StudentID = ? AND LogDate = ?';
  const [rows] = await pool.query(checkQuery, [studentId, logDate]);

  if (rows.length > 0) {
    const updateFields = [];
    const updateValues = [];
    if (breakfastStatus !== undefined) { updateFields.push('BreakfastStatus = ?'); updateValues.push(breakfastStatus); }
    if (lunchStatus !== undefined) { updateFields.push('LunchStatus = ?'); updateValues.push(lunchStatus); }
    if (snackStatus !== undefined) { updateFields.push('SnackStatus = ?'); updateValues.push(snackStatus); }
    if (napStatus !== undefined) { updateFields.push('NapStatus = ?'); updateValues.push(napStatus); }
    if (hygieneStatus !== undefined) { updateFields.push('HygieneStatus = ?'); updateValues.push(hygieneStatus); }
    if (teacherNote !== undefined) { updateFields.push('TeacherNote = ?'); updateValues.push(teacherNote); }
    if (photoUrl !== undefined) { updateFields.push('PhotoUrl = ?'); updateValues.push(photoUrl); }
    if (activityStatus !== undefined) { updateFields.push('ActivityStatus = ?'); updateValues.push(activityStatus); }
    if (recordedBy !== undefined) { updateFields.push('RecordedBy = ?'); updateValues.push(recordedBy); }

    updateFields.push('UpdatedAt = ?');
    updateValues.push(Math.floor(Date.now() / 1000));

    const updateQuery = `UPDATE DailyActivities SET ${updateFields.join(', ')} WHERE ActivityID = ?`;
    updateValues.push(rows[0].ActivityID);
    await pool.query(updateQuery, updateValues);
  } else {
    const insertQuery = `
      INSERT INTO DailyActivities (StudentID, LogDate, BreakfastStatus, LunchStatus, SnackStatus, NapStatus, HygieneStatus, TeacherNote, PhotoUrl, ActivityStatus, RecordedBy, UpdatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertQuery, [
      studentId, 
      logDate, 
      breakfastStatus || null, 
      lunchStatus || null, 
      snackStatus || null, 
      napStatus || null, 
      hygieneStatus || 'Bình thường', 
      teacherNote || null,
      photoUrl || null,
      activityStatus || null,
      recordedBy || null,
      Math.floor(Date.now() / 1000)
    ]);
  }
};

/**
 * Get daily schedule of a class on a target date
 * @param {number} classId 
 * @param {number} dateTimestamp Unix timestamp (seconds) for start of day
 * @returns {Promise<Array>} List of daily schedule items
 */
export const getClassSchedule = async (classId, dateTimestamp) => {
  const query = `
    SELECT 
      DailyScheduleID AS dailyScheduleId,
      ClassID AS classId,
      ScheduleDate AS scheduleDate,
      StartTime AS startTime,
      EndTime AS endTime,
      ActivityName AS activityName,
      Details AS details,
      Location AS location,
      ActivityType AS activityType,
      Status AS status
    FROM DailySchedules
    WHERE ClassID = ? AND ScheduleDate = ?
    ORDER BY StartTime ASC
  `;
  const [rows] = await pool.query(query, [classId, dateTimestamp]);
  return rows;
};

/**
 * Get class weekly schedule
 */
export const getWeeklySchedule = async (classId, dateTimestamp) => {
  const query = `
    SELECT 
      ms.Month AS month,
      ms.Year AS year,
      ms.MonthTheme AS monthTheme, 
      ws.WeekOrder AS weekOrder,
      ws.WeekTheme AS weekTheme, 
      wsd.DayOfWeek AS dayOfWeek, 
      wsd.StartTime AS startTime, 
      wsd.EndTime AS endTime, 
      wsd.ActivityName AS activityName, 
      wsd.ActivityType AS activityType, 
      wsd.Details AS details
    FROM MonthlySchedules ms
    JOIN WeeklySchedules ws ON ms.MonthlyScheduleID = ws.MonthlyScheduleID
    JOIN WeeklyScheduleDetails wsd ON ws.WeeklyScheduleID = wsd.WeeklyScheduleID
    WHERE ms.ClassID = ? AND ms.IsActive = 1
    ORDER BY ms.Year DESC, ms.Month DESC, ws.WeekOrder ASC, 
             FIELD(wsd.DayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
             wsd.StartTime ASC
  `;
  const [rows] = await pool.query(query, [classId]);
  
  if (!rows || rows.length === 0) {
    return null;
  }

  // Group the results
  const result = {
    month: rows[0].month,
    year: rows[0].year,
    monthTheme: rows[0].monthTheme,
    weeks: []
  };

  const weeksMap = new Map();

  rows.forEach(row => {
    if (!weeksMap.has(row.weekOrder)) {
      weeksMap.set(row.weekOrder, {
        weekOrder: row.weekOrder,
        weekTheme: row.weekTheme,
        days: {}
      });
    }
    const week = weeksMap.get(row.weekOrder);
    
    if (!week.days[row.dayOfWeek]) {
      week.days[row.dayOfWeek] = [];
    }
    
    week.days[row.dayOfWeek].push({
      startTime: row.startTime,
      endTime: row.endTime,
      activityName: row.activityName,
      activityType: row.activityType,
      details: row.details
    });
  });

  result.weeks = Array.from(weeksMap.values());
  return result;
};

/**
 * Get parent UserIDs for a specific class
 */
export const getClassParentsUserIds = async (classId) => {
  const query = `
    SELECT DISTINCT sp.ParentID AS userId
    FROM StudentParents sp
    JOIN Students s ON sp.StudentID = s.StudentID
    WHERE s.ClassID = ? AND s.EnrollmentStatus = 'Active'
  `;
  const [rows] = await pool.query(query, [classId]);
  return rows.map(r => r.userId);
};

/**
 * Get parent UserIDs for a specific student
 */
export const getStudentParentsUserIds = async (studentId) => {
  const query = `
    SELECT ParentID AS userId
    FROM StudentParents
    WHERE StudentID = ?
  `;
  const [rows] = await pool.query(query, [studentId]);
  return rows.map(r => r.userId);
};

/**
 * Get medical requests for a class
 */
export const getMedicalRequests = async (classId, dateTimestamp) => {
  let query = `
    SELECT 
      mr.MedRequestID AS requestId,
      mr.StudentID AS studentId,
      s.FullName AS studentName,
      s.AvatarURL AS studentAvatar,
      mr.ParentID AS parentId,
      p.FullName AS parentName,
      mr.RequestDate AS requestDate,
      mr.MedicineDetails AS medicineDetails,
      mr.Dosage AS dosage,
        mr.Frequency AS frequency,
        mr.TimeToTake AS timeToTake,
        mr.ParentNote AS parentNote,
        mr.MedicineImageURL AS medicineImageUrl,
      mr.Status AS status,
      mr.TeacherNote AS teacherNote
    FROM MedicationRequests mr
    JOIN Students s ON mr.StudentID = s.StudentID
    LEFT JOIN Parents p ON mr.ParentID = p.ParentID
    WHERE s.ClassID = ?
  `;
  const params = [classId];

  if (dateTimestamp) {
    query += ' AND mr.RequestDate = ?';
    params.push(dateTimestamp);
  }

  query += ' ORDER BY mr.MedRequestID DESC';

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get single medical request by ID
 */
export const getMedicalRequestById = async (requestId) => {
  const query = `
    SELECT 
      mr.*, s.ClassID AS classId 
    FROM MedicationRequests mr
    JOIN Students s ON mr.StudentID = s.StudentID
    WHERE mr.MedRequestID = ?
  `;
  const [rows] = await pool.query(query, [requestId]);
  return rows[0] || null;
};

/**
 * Update medical request status
 */
export const updateMedicalRequestStatus = async (requestId, status, teacherNote) => {
  let query = 'UPDATE MedicationRequests SET Status = ?';
  const params = [status];

  if (teacherNote !== undefined) {
    query += ', TeacherNote = ?';
    params.push(teacherNote);
  }

  query += ' WHERE MedRequestID = ?';
  params.push(requestId);

  const [result] = await pool.query(query, params);
  return result.affectedRows > 0;
};

/**
 * Create a newsfeed post
 */
export const createNewsfeedPost = async (classId, teacherId, content, mediaUrl) => {
  const query = `
    INSERT INTO Newsfeeds (ClassID, TeacherID, Content, MediaURL)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.query(query, [classId, teacherId, content, mediaUrl || null]);
  return result.insertId;
};

/**
 * Get newsfeeds for a class
 */
export const getNewsfeeds = async (classId) => {
  const query = `
    SELECT 
      n.PostID AS postId,
      n.Content AS content,
      n.MediaURL AS mediaUrl,
      n.PostedAt AS postedAt,
      t.FullName AS teacherName,
      u.AvatarURL AS teacherAvatar
    FROM Newsfeeds n
      JOIN Teachers t ON n.TeacherID = t.TeacherID
      JOIN Users u ON t.TeacherID = u.UserID
    WHERE n.ClassID = ?
    ORDER BY n.PostedAt DESC
  `;
  const [rows] = await pool.query(query, [classId]);
  return rows;
};

/**
 * Delete a newsfeed post
 */
export const deleteNewsfeedPost = async (postId, classId) => {
  const query = 'DELETE FROM Newsfeeds WHERE PostID = ? AND ClassID = ?';
  const [result] = await pool.query(query, [postId, classId]);
  return result.affectedRows > 0;
};

/**
 * Get detailed students for a class
 */
export const getClassDetailedStudents = async (classId) => {
  // MariaDB 10.4 không hỗ trợ JSON_OBJECT / JSON_ARRAYAGG ổn định — tách thành
  // 2 truy vấn con đơn giản rồi ghép nối ở tầng JS.
  const studentsQuery = `
    SELECT
      s.StudentID AS studentId,
      s.FullName AS fullName,
      s.DateOfBirth AS dateOfBirth,
      s.Gender AS gender,
      s.Allergies AS allergies,
      s.AvatarURL AS avatarUrl
    FROM Students s
    WHERE s.ClassID = ? AND s.EnrollmentStatus = 'Active'
    ORDER BY s.FullName
  `;
  const [students] = await pool.query(studentsQuery, [classId]);

  if (students.length === 0) {
    return [];
  }

  const studentIds = students.map((s) => s.studentId);

  // Build dynamic IN clause (?, ?, ...) once
  const placeholders = studentIds.map(() => '?').join(',');

  // Latest health record per student (chỉ lấy 1 record mới nhất)
  const healthQuery = `
    SELECT hr.StudentID AS studentId,
           hr.Height AS height, hr.Weight AS weight, hr.BMI AS bmi
      FROM HealthRecords hr
     INNER JOIN (
        SELECT StudentID, MAX(RecordID) AS maxRecordId
          FROM HealthRecords
         WHERE StudentID IN (${placeholders})
         GROUP BY StudentID
     ) latest ON latest.StudentID = hr.StudentID AND latest.maxRecordId = hr.RecordID
  `;
  const [healthRows] = await pool.query(healthQuery, studentIds);
  const healthByStudent = new Map(healthRows.map((h) => [h.studentId, h]));

  // All parents of all students in one query
  const parentsQuery = `
    SELECT sp.StudentID AS studentId,
           p.ParentID AS parentId,
           p.FullName AS fullName,
           p.PhoneNumber AS phone,
           p.Email AS email,
           sp.Relationship AS relationship,
           sp.IsPrimary AS isPrimary,
           p.AvatarURL AS avatarUrl
      FROM StudentParents sp
      JOIN Parents p ON sp.ParentID = p.ParentID
     WHERE sp.StudentID IN (${placeholders})
     ORDER BY sp.StudentID, sp.IsPrimary DESC, p.ParentID
  `;
  const [parentRows] = await pool.query(parentsQuery, studentIds);
  const parentsByStudent = new Map();
  for (const pr of parentRows) {
    if (!parentsByStudent.has(pr.studentId)) {
      parentsByStudent.set(pr.studentId, []);
    }
    parentsByStudent.get(pr.studentId).push({
      parentId: pr.parentId,
      fullName: pr.fullName,
      phone: pr.phone,
      email: pr.email,
      relationship: pr.relationship,
      isPrimary: !!pr.isPrimary,
      avatarUrl: pr.avatarUrl,
    });
  }

  return students.map((row) => {
    const health = healthByStudent.get(row.studentId);
    let healthObj = null;
    if (health) {
      let { height, weight, bmi } = health;
      if (height != null) height = Number(height);
      if (weight != null) weight = Number(weight);
      if (bmi == null && height && weight && height > 0) {
        const heightInMeters = height / 100;
        bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
      } else if (bmi != null) {
        bmi = Number(bmi);
      }
      healthObj = { height, weight, bmi };
    }

    return {
      studentId: row.studentId,
      fullName: row.fullName,
      dateOfBirth: row.dateOfBirth ? Number(row.dateOfBirth) : null,
      gender: row.gender,
      allergies: row.allergies,
      avatarUrl: row.avatarUrl,
      health: healthObj,
      parents: parentsByStudent.get(row.studentId) || [],
    };
  });
};

/**
 * Get class assessments for a specific month
 */
export const getClassAssessments = async (classId, month) => {
  const query = `
    SELECT 
      s.StudentID AS studentId,
      s.FullName AS fullName,
      s.AvatarURL AS avatarUrl,
      a.AssessmentID AS assessmentId,
      a.PhysicalScore AS physicalScore,
      a.CognitiveScore AS cognitiveScore,
      a.LanguageScore AS languageScore,
      a.SocioEmotionalScore AS socioEmotionalScore,
      a.AestheticScore AS aestheticScore,
      a.TeacherComment AS teacherComment
    FROM Students s
    LEFT JOIN StudentAssessments a ON s.StudentID = a.StudentID AND a.AssessmentMonth = ?
    WHERE s.ClassID = ? AND s.EnrollmentStatus = 'Active'
    ORDER BY s.FullName ASC
  `;
  const [rows] = await pool.query(query, [month, classId]);
  
  return rows.map(row => {
    let assessment = null;
    if (row.assessmentId) {
      assessment = {
        assessmentId: row.assessmentId,
        physicalScore: row.physicalScore,
        cognitiveScore: row.cognitiveScore,
        languageScore: row.languageScore,
        socioEmotionalScore: row.socioEmotionalScore,
        aestheticScore: row.aestheticScore,
        teacherComment: row.teacherComment
      };
    }
    
    return {
      studentId: row.studentId,
      fullName: row.fullName,
      avatarUrl: row.avatarUrl,
      assessment
    };
  });
};

/**
 * Upsert student assessment for a specific month
 */
export const upsertStudentAssessment = async (studentId, month, physicalScore, cognitiveScore, languageScore, socioEmotionalScore, aestheticScore, teacherComment) => {
  // Try to find if an assessment already exists
  const [existing] = await pool.query(
    'SELECT AssessmentID FROM StudentAssessments WHERE StudentID = ? AND AssessmentMonth = ?', 
    [studentId, month]
  );
  
  if (existing.length > 0) {
    const assessmentId = existing[0].AssessmentID;
    const updateQuery = `
      UPDATE StudentAssessments
      SET PhysicalScore = ?, CognitiveScore = ?, LanguageScore = ?, 
          SocioEmotionalScore = ?, AestheticScore = ?, TeacherComment = ?
      WHERE AssessmentID = ?
    `;
    await pool.query(updateQuery, [
      physicalScore, cognitiveScore, languageScore, 
      socioEmotionalScore, aestheticScore, teacherComment, 
      assessmentId
    ]);
  } else {
    const insertQuery = `
      INSERT INTO StudentAssessments (
        StudentID, AssessmentMonth, PhysicalScore, CognitiveScore, 
        LanguageScore, SocioEmotionalScore, AestheticScore, TeacherComment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertQuery, [
      studentId, month, physicalScore, cognitiveScore, 
      languageScore, socioEmotionalScore, aestheticScore, teacherComment
    ]);
  }
};

/**
 * Get all available reward badges
 */
export const getRewardBadges = async () => {
  const query = `
    SELECT 
      BadgeID AS badgeId,
      BadgeName AS badgeName,
      BadgeImageURL AS badgeImageUrl,
      CriteriaType AS criteriaType
    FROM RewardBadges
  `;
  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Get weekly rewards awarded to a class for a specific week and year
 */
export const getWeeklyRewards = async (classId, weekNumber, year) => {
  const query = `
    SELECT 
      w.RewardID AS rewardId,
      w.StudentID AS studentId,
      w.WeekNumber AS weekNumber,
      w.Year AS year,
      w.TeacherNote AS teacherNote,
      w.DateAwarded AS dateAwarded,
      s.FullName AS studentName,
      s.AvatarURL AS avatarUrl
    FROM WeeklyRewards w
    JOIN Students s ON w.StudentID = s.StudentID
    WHERE s.ClassID = ? AND w.WeekNumber = ? AND w.Year = ?
  `;
  const [rows] = await pool.query(query, [classId, weekNumber, year]);
  return rows;
};

/**
 * Get automated monthly good kids evaluation
 */
export const getMonthlyGoodKids = async (classId, month, year) => {
  // Convert month/year to timestamps
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const endTimestamp = Math.floor(endDate.getTime() / 1000);
  
  // For LogDate (DATE type)
  const startLogStr = `${year}-${String(month).padStart(2, '0')}-01`;
  const endLogStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

  const query = `
    SELECT 
      s.StudentID AS studentId,
      s.FullName AS studentName,
      s.AvatarURL AS avatarUrl,
      (
        SELECT COALESCE(SUM(CASE WHEN a.Status = 'Present' THEN 1 ELSE 0 END), 0)
        FROM Attendances a 
        WHERE a.StudentID = s.StudentID AND a.AttendanceDate >= ? AND a.AttendanceDate <= ?
      ) AS attendancePoints,
      (
        SELECT COALESCE(SUM(
          (CASE WHEN da.BreakfastStatus = 'Ăn hết' THEN 1 WHEN da.BreakfastStatus = 'Ăn chậm' THEN 0.5 ELSE 0 END) +
          (CASE WHEN da.LunchStatus = 'Ăn hết' THEN 1 WHEN da.LunchStatus = 'Ăn chậm' THEN 0.5 ELSE 0 END) +
          (CASE WHEN da.SnackStatus = 'Ăn hết' THEN 1 WHEN da.SnackStatus = 'Ăn chậm' THEN 0.5 ELSE 0 END) +
          (CASE WHEN da.NapStatus = 'Ngủ ngoan' THEN 1 WHEN da.NapStatus = 'Khó ngủ' THEN 0.5 ELSE 0 END)
        ), 0)
        FROM DailyActivities da
        WHERE da.StudentID = s.StudentID AND da.LogDate >= ? AND da.LogDate <= ?
      ) AS eatSleepPoints,
      (
        SELECT COALESCE(SUM(
          CASE WHEN da2.ViolationLevel = 'Heavy' THEN -10
               WHEN da2.ViolationLevel = 'Medium' THEN -5
               WHEN da2.ViolationLevel = 'Light' THEN -2
               ELSE 0 END
        ), 0)
        FROM DailyActivities da2
        WHERE da2.StudentID = s.StudentID AND da2.LogDate >= ? AND da2.LogDate <= ?
      ) AS violationPoints
    FROM Students s
    WHERE s.ClassID = ?
    ORDER BY violationPoints DESC, eatSleepPoints DESC, attendancePoints DESC
  `;
  const [rows] = await pool.query(query, [
    startTimestamp, endTimestamp, 
    startLogStr, endLogStr, 
    startLogStr, endLogStr, 
    classId
  ]);
  return rows;
};

/**
 * Batch award weekly rewards (Phiếu bé ngoan) to students
 * @param {Array<{studentId: number, teacherNote: string}>} awards
 */
export const awardWeeklyRewards = async (classId, weekNumber, year, awards) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const timestamp = Math.floor(Date.now() / 1000);

    for (const award of awards) {
      // 1. Insert into WeeklyRewards
      const insertReward = `
        INSERT INTO WeeklyRewards (StudentID, WeekNumber, Year, TeacherNote, DateAwarded)
        VALUES (?, ?, ?, ?, ?)
      `;
      await connection.query(insertReward, [
        award.studentId, weekNumber, year, award.teacherNote || '', timestamp
      ]);

      // 2. Also insert a badge into StudentBadges (Assume BadgeID = 1 is Phiếu bé ngoan)
      // Usually "Phiếu bé ngoan cuối tuần" badge is BadgeID 1
      const insertBadge = `
        INSERT INTO StudentBadges (StudentID, BadgeID, DateEarned)
        VALUES (?, 1, ?)
      `;
      await connection.query(insertBadge, [award.studentId, timestamp]);
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};



/**
 * Update daily schedule status
 */
export const updateScheduleStatus = async (classId, scheduleId, statusStr) => {
  const query = `
    UPDATE DailySchedules 
    SET Status = ?, UpdatedAt = UNIX_TIMESTAMP() 
    WHERE DailyScheduleID = ? AND ClassID = ?
  `;
  const [result] = await pool.query(query, [statusStr, scheduleId, classId]);
  return result.affectedRows > 0;
};


/**
 * Process QR Scan Attendance (Auto-detect check-in / check-out)
 */
export const processQRAttendance = async (
  studentId,
  dateTimestamp,
  checkTimestamp,
  teacherId,
  parentId,
  parentName,
  relationship
) => {
  const vnDate = new Date(checkTimestamp * 1000 + 7 * 60 * 60 * 1000);
  const timeStr = `${String(vnDate.getUTCHours()).padStart(2, '0')}:${String(vnDate.getUTCMinutes()).padStart(2, '0')}`;

  // 1. Get student info
  const [studentRows] = await pool.query(
    `SELECT s.FullName as fullName, c.ClassName as className, cp.CampusName as campusName
     FROM Students s
     LEFT JOIN Classes c ON s.ClassID = c.ClassID
     LEFT JOIN Buildings b ON c.BuildingID = b.BuildingID
     LEFT JOIN Campuses cp ON b.CampusID = cp.CampusID
     WHERE s.StudentID = ?`,
    [studentId]
  );

  if (studentRows.length === 0) return null;
  const student = studentRows[0];

  // 1.5 Check if there is an active proxy authorization for today
  const [proxyRows] = await pool.query(
    `SELECT AuthorizationID, ProxyName, ProxyPhone, ProxyIDCard, ProxyPhotoURL, Type, Notes
     FROM ProxyAuthorizations 
     WHERE StudentID = ? AND AuthorizationDate = ? AND Status = 'Approved'`,
    [studentId, dateTimestamp]
  );

  // 2. Check current attendance record for today
  const [attRows] = await pool.query(
    `SELECT AttendanceID, CheckInTime, CheckOutTime, Status FROM Attendances WHERE StudentID = ? AND AttendanceDate = ?`,
    [studentId, dateTimestamp]
  );

  let attendanceType = 'checkin';
  let activeProxy = null;

  if (attRows.length === 0) {
    // checkin
    activeProxy = proxyRows.find(p => p.Type === 'checkin' || p.Type === 'both') || null;
    if (activeProxy) {
      await pool.query(
        `INSERT INTO Attendances (StudentID, AttendanceDate, CheckInTime, Status, CheckedInByTeacherID, ProxyAuthorizationID)
         VALUES (?, ?, ?, 'Present', ?, ?)`,
        [studentId, dateTimestamp, checkTimestamp, teacherId || null, activeProxy.AuthorizationID]
      );
    } else {
      await pool.query(
        `INSERT INTO Attendances (StudentID, AttendanceDate, CheckInTime, Status, DroppedOffByParentID, CheckedInByTeacherID)
         VALUES (?, ?, ?, 'Present', ?, ?)`,
        [studentId, dateTimestamp, checkTimestamp, parentId || null, teacherId || null]
      );
    }
  } else {
    const record = attRows[0];
    if (record.CheckInTime && record.CheckOutTime) {
      // Already fully attended
      const error = new Error('Bé đã điểm danh đủ cả ngày');
      error.status = 409;
      throw error;
    } else if (record.CheckInTime && !record.CheckOutTime) {
      // checkout
      attendanceType = 'checkout';
      activeProxy = proxyRows.find(p => p.Type === 'checkout' || p.Type === 'both') || null;
      if (activeProxy) {
        await pool.query(
          `UPDATE Attendances SET CheckOutTime = ?, CheckedOutByTeacherID = ?, ProxyAuthorizationID = ? WHERE AttendanceID = ?`,
          [checkTimestamp, teacherId || null, activeProxy.AuthorizationID, record.AttendanceID]
        );
      } else {
        await pool.query(
          `UPDATE Attendances SET CheckOutTime = ?, PickedUpByParentID = ?, CheckedOutByTeacherID = ? WHERE AttendanceID = ?`,
          [checkTimestamp, parentId || null, teacherId || null, record.AttendanceID]
        );
      }
    } else {
      // Absent or Excused -> change to Present and CheckIn
      activeProxy = proxyRows.find(p => p.Type === 'checkin' || p.Type === 'both') || null;
      if (activeProxy) {
        await pool.query(
          `UPDATE Attendances SET CheckInTime = ?, Status = 'Present', CheckedInByTeacherID = ?, ProxyAuthorizationID = ? WHERE AttendanceID = ?`,
          [checkTimestamp, teacherId || null, activeProxy.AuthorizationID, record.AttendanceID]
        );
      } else {
        await pool.query(
          `UPDATE Attendances SET CheckInTime = ?, Status = 'Present', DroppedOffByParentID = ?, CheckedInByTeacherID = ? WHERE AttendanceID = ?`,
          [checkTimestamp, parentId || null, teacherId || null, record.AttendanceID]
        );
      }
    }
  }

  return {
    studentId,
    fullName: student.fullName,
    className: student.className,
    campusName: student.campusName,
    attendanceType,
    time: timeStr,
    hasProxy: !!activeProxy,
    proxyInfo: activeProxy ? {
      proxyName: activeProxy.ProxyName,
      proxyPhone: activeProxy.ProxyPhone,
      proxyIDCard: activeProxy.ProxyIDCard,
      proxyPhotoUrl: activeProxy.ProxyPhotoURL,
      notes: activeProxy.Notes
    } : null
  };
};
