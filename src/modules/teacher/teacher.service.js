import pool from '../../config/db.js';

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
        SELECT da.TeacherNote
        FROM DailyActivities da
        WHERE da.StudentID = s.StudentID AND da.ActivityDate = ?
        LIMIT 1
      ) AS healthNote,
      (
        SELECT da.EatingStatus
        FROM DailyActivities da
        WHERE da.StudentID = s.StudentID AND da.ActivityDate = ?
        LIMIT 1
      ) AS eatingStatus
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
    eatingStatus: row.eatingStatus || null,
    leaveRequest: row.leaveRequestId ? {
      requestId: row.leaveRequestId,
      status: row.leaveRequestStatus,
      reason: row.leaveRequestReason
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
      MenuID AS menuId,
      ClassID AS classId,
      MenuDate AS menuDate,
      MealType AS mealType,
      DishName AS dishName,
      Calories AS calories,
      NutritionalDetails AS nutritionalDetails
    FROM Menus
    WHERE ClassID = ? AND MenuDate = ?
    ORDER BY MenuID
  `;
  const [rows] = await pool.query(query, [classId, dateTimestamp]);
  return rows;
};

/**
 * Upsert daily activity status for a student on a specific date
 */
export const upsertDailyActivity = async (studentId, dateTimestamp, data) => {
  const { eatingStatus, sleepingStatus, hygieneStatus, teacherNote } = data;
  const checkQuery = 'SELECT ActivityID FROM DailyActivities WHERE StudentID = ? AND ActivityDate = ?';
  const [rows] = await pool.query(checkQuery, [studentId, dateTimestamp]);

  if (rows.length > 0) {
    const updateFields = [];
    const updateValues = [];
    if (eatingStatus !== undefined) { updateFields.push('EatingStatus = ?'); updateValues.push(eatingStatus); }
    if (sleepingStatus !== undefined) { updateFields.push('SleepingStatus = ?'); updateValues.push(sleepingStatus); }
    if (hygieneStatus !== undefined) { updateFields.push('HygieneStatus = ?'); updateValues.push(hygieneStatus); }
    if (teacherNote !== undefined) { updateFields.push('TeacherNote = ?'); updateValues.push(teacherNote); }

    if (updateFields.length > 0) {
      const updateQuery = `
        UPDATE DailyActivities
        SET ${updateFields.join(', ')}
        WHERE StudentID = ? AND ActivityDate = ?
      `;
      updateValues.push(studentId, dateTimestamp);
      await pool.query(updateQuery, updateValues);
    }
  } else {
    const insertQuery = `
      INSERT INTO DailyActivities (StudentID, ActivityDate, EatingStatus, SleepingStatus, HygieneStatus, TeacherNote)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertQuery, [
      studentId, dateTimestamp, 
      eatingStatus || null, 
      sleepingStatus || null, 
      hygieneStatus || null, 
      teacherNote || null
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
 * Push a notification to a user
 */
export const pushNotification = async (userId, title, message, type = 'System', actionLink = null) => {
  const query = `
    INSERT INTO Notifications (UserID, Title, Message, Type, ActionLink)
    VALUES (?, ?, ?, ?, ?)
  `;
  await pool.query(query, [userId, title, message, type, actionLink]);
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
    SELECT n.*, u.FullName as TeacherName, u.Avatar as TeacherAvatar 
    FROM Newsfeeds n
    LEFT JOIN Users u ON n.TeacherID = u.UserID
    WHERE n.ClassID = ?
    ORDER BY n.PostedAt DESC
  `;
  const [rows] = await pool.query(query, [classId]);
  return rows;
};

/**
 * Get detailed students for a class
 */
export const getClassDetailedStudents = async (classId) => {
  const query = `
    SELECT 
      s.StudentID AS studentId,
      s.FullName AS fullName,
      s.DateOfBirth AS dateOfBirth,
      s.Gender AS gender,
      s.Allergies AS allergies,
      s.AvatarURL AS avatarUrl,
      (
        SELECT JSON_OBJECT(
          'height', hr.Height,
          'weight', hr.Weight,
          'bmi', hr.BMI
        )
        FROM HealthRecords hr
        WHERE hr.StudentID = s.StudentID
        ORDER BY hr.RecordID DESC
        LIMIT 1
      ) AS healthRecord,
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'parentId', p.ParentID,
            'fullName', p.FullName,
            'phone', p.PhoneNumber,
            'email', p.Email,
            'relationship', sp.Relationship,
            'isPrimary', sp.IsPrimary
          )
        )
        FROM StudentParents sp
        JOIN Parents p ON sp.ParentID = p.ParentID
        WHERE sp.StudentID = s.StudentID
      ) AS parents
    FROM Students s
    WHERE s.ClassID = ? AND s.EnrollmentStatus = 'Active'
    ORDER BY s.FullName
  `;
  const [rows] = await pool.query(query, [classId]);
  
  // Post-process to calculate BMI if not present in DB
  return rows.map(row => {
    let health = row.healthRecord;
    if (typeof health === 'string') {
      health = JSON.parse(health);
    }
    
    let parents = row.parents;
    if (typeof parents === 'string') {
      parents = JSON.parse(parents);
    }

    if (health && health.height && health.weight && !health.bmi) {
      // Height might be in cm or meters. Usually height in health records is in cm. Let's assume cm.
      const heightInMeters = Number(health.height) / 100;
      const weight = Number(health.weight);
      if (heightInMeters > 0) {
        health.bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
      }
    }

    return {
      studentId: row.studentId,
      fullName: row.fullName,
      dateOfBirth: row.dateOfBirth ? Number(row.dateOfBirth) : null,
      gender: row.gender,
      allergies: row.allergies,
      avatarUrl: row.avatarUrl,
      health: health || null,
      parents: parents || []
    };
  });
};

/**
 * Get notifications for a teacher
 */
export const getTeacherNotifications = async (teacherId) => {
  const query = `
    SELECT 
      NotifID AS notifId,
      Title AS title,
      Message AS message,
      Type AS type,
      ActionLink AS actionLink,
      IsRead AS isRead,
      CreatedAt AS createdAt
    FROM Notifications
    WHERE UserID = ?
    ORDER BY NotifID DESC
  `;
  const [rows] = await pool.query(query, [teacherId]);
  return rows.map(r => ({ ...r, isRead: !!r.isRead }));
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notifId, teacherId) => {
  const query = `
    UPDATE Notifications
    SET IsRead = 1
    WHERE NotifID = ? AND UserID = ?
  `;
  const [result] = await pool.query(query, [notifId, teacherId]);
  return result.affectedRows > 0;
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
  const pool = require('../../config/db.js').default || require('../../config/db.js');
  const [result] = await pool.query(query, [statusStr, scheduleId, classId]);
  return result.affectedRows > 0;
};
