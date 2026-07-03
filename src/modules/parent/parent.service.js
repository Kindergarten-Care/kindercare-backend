import pool from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Get all children of a parent by ParentID
 * @param {number} parentId
 * @returns {Promise<Array>} List of children
 */
export const getChildrenByParentId = async (parentId) => {
  const query = `
    SELECT 
      s.StudentID AS studentId,
      s.FullName AS fullName,
      s.DateOfBirth AS dateOfBirth,
      s.Gender AS gender,
      s.Allergies AS allergies,
      s.AdmissionDate AS admissionDate,
      s.EnrollmentStatus AS enrollmentStatus,
      s.AvatarURL AS avatarUrl,
      s.ClassID AS classId,
      c.ClassName AS className,
      g.GradeName AS gradeName,
      ay.YearName AS academicYearName,
      b.BuildingID AS buildingId,
      b.BuildingName AS buildingName,
      cp.CampusID AS campusId,
      cp.CampusName AS campusName,
      cp.Address AS campusAddress,
      sp.Relationship AS relationship,
      sp.IsPrimary AS isPrimary
    FROM StudentParents sp
    JOIN Students s ON sp.StudentID = s.StudentID
    LEFT JOIN Classes c ON s.ClassID = c.ClassID
    LEFT JOIN Grades g ON c.GradeID = g.GradeID
    LEFT JOIN AcademicYears ay ON c.YearID = ay.YearID
    LEFT JOIN Buildings b ON c.BuildingID = b.BuildingID
    LEFT JOIN Campuses cp ON b.CampusID = cp.CampusID
    WHERE sp.ParentID = ?
  `;
  const [rows] = await pool.query(query, [parentId]);

  if (rows.length === 0) {
    return [];
  }

  // Extract unique, non-null class IDs
  const classIds = [...new Set(rows.map(r => r.classId).filter(id => id !== null))];

  let teachers = [];
  if (classIds.length > 0) {
    const placeholders = classIds.map(() => '?').join(',');
    const [teacherRows] = await pool.query(
      `SELECT 
        ct.ClassID AS classId,
        t.TeacherID AS teacherId,
        t.FullName AS fullName,
        t.PhoneNumber AS phoneNumber,
        t.Email AS email,
        t.Gender AS gender,
        ct.RoleInClass AS roleInClass
       FROM ClassTeachers ct
       JOIN Teachers t ON ct.TeacherID = t.TeacherID
       WHERE ct.ClassID IN (${placeholders})`,
      classIds
    );
    teachers = teacherRows;
  }

  // Map teachers by classId
  const teachersByClass = {};
  for (const teacher of teachers) {
    if (!teachersByClass[teacher.classId]) {
      teachersByClass[teacher.classId] = [];
    }
    teachersByClass[teacher.classId].push({
      teacherId: teacher.teacherId,
      fullName: teacher.fullName,
      phoneNumber: teacher.phoneNumber,
      email: teacher.email,
      gender: teacher.gender,
      roleInClass: teacher.roleInClass
    });
  }

  // Attach teachers to each child
  return rows.map(child => ({
    ...child,
    teachers: teachersByClass[child.classId] || []
  }));
};

/**
 * Get parent profile by ParentID
 * @param {number} parentId
 * @returns {Promise<Object|null>} Parent profile
 */
export const getParentProfileById = async (parentId) => {
  const query = `
    SELECT 
      ParentID     AS parentId,
      FullName     AS fullName,
      DateOfBirth  AS dateOfBirth,
      PhoneNumber  AS phoneNumber,
      Email        AS email,
      IDCard       AS idCard,
      Job          AS job,
      Address      AS address,
      AvatarURL    AS avatarUrl
    FROM Parents
    WHERE ParentID = ?
  `;
  const [rows] = await pool.query(query, [parentId]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Get health records of a child by StudentID
 * @param {number} studentId
 * @returns {Promise<Array>} List of health records
 */
export const getHealthRecordsByStudentId = async (studentId) => {
  const query = `
    SELECT 
      RecordID AS recordId,
      StudentID AS studentId,
      TermPeriod AS termPeriod,
      Height AS height,
      Weight AS weight,
      BMI AS bmi
    FROM HealthRecords
    WHERE StudentID = ?
    ORDER BY TermPeriod DESC
  `;
  const [rows] = await pool.query(query, [studentId]);
  return rows;
};

/**
 * Check if a parent is associated with a child
 * @param {number} parentId
 * @param {number} studentId
 * @returns {Promise<boolean>} True if parent is associated with child
 */
export const isParentOfStudent = async (parentId, studentId) => {
  const query = `
    SELECT 1 
    FROM StudentParents 
    WHERE ParentID = ? AND StudentID = ?
  `;
  const [rows] = await pool.query(query, [parentId, studentId]);
  return rows.length > 0;
};

/**
 * Get detailed info of a single student (accessible by parent)
 * @param {number} studentId
 * @returns {Promise<Object|null>}
 */
export const getStudentDetailById = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT
       s.StudentID        AS studentId,
       s.FullName         AS fullName,
       s.DateOfBirth      AS dateOfBirth,
       s.Gender           AS gender,
       s.Allergies        AS allergies,
       s.AdmissionDate    AS admissionDate,
       s.EnrollmentStatus AS enrollmentStatus,
       s.AvatarURL        AS avatarUrl,
       s.ClassID          AS classId,
       c.ClassName        AS className,
       g.GradeID          AS gradeId,
       g.GradeName        AS gradeName,
       ay.YearID          AS academicYearId,
       ay.YearName        AS academicYearName,
       b.BuildingID       AS buildingId,
       b.BuildingName     AS buildingName,
       cp.CampusID        AS campusId,
       cp.CampusName      AS campusName,
       cp.Address         AS campusAddress
     FROM Students s
     LEFT JOIN Classes     c  ON s.ClassID      = c.ClassID
     LEFT JOIN Grades      g  ON c.GradeID      = g.GradeID
     LEFT JOIN AcademicYears ay ON c.YearID     = ay.YearID
     LEFT JOIN Buildings   b  ON c.BuildingID   = b.BuildingID
     LEFT JOIN Campuses    cp ON b.CampusID     = cp.CampusID
     WHERE s.StudentID = ?`,
    [studentId]
  );

  if (rows.length === 0) return null;

  const student = rows[0];

  if (student.classId) {
    const [teacherRows] = await pool.query(
      `SELECT
         t.TeacherID    AS teacherId,
         t.FullName     AS fullName,
         t.PhoneNumber  AS phoneNumber,
         t.Email        AS email,
         t.Gender       AS gender,
         ct.RoleInClass AS roleInClass
       FROM ClassTeachers ct
       JOIN Teachers t ON ct.TeacherID = t.TeacherID
       WHERE ct.ClassID = ?`,
      [student.classId]
    );
    student.teachers = teacherRows;
  } else {
    student.teachers = [];
  }

  return student;
};

/**
 * Update parent profile
 * @param {number} parentId
 * @param {object} fields - { fullName, phoneNumber, email, idCard, job, address, avatarUrl }
 * @returns {Promise<Object>}
 */
export const updateParentProfile = async (parentId, fields) => {
  const { fullName, phoneNumber, email, idCard, job, address, avatarUrl } = fields;

  const setClauses = [];
  const values = [];

  if (fullName !== undefined)    { setClauses.push('FullName = ?');    values.push(fullName); }
  if (phoneNumber !== undefined) { setClauses.push('PhoneNumber = ?'); values.push(phoneNumber); }
  if (email !== undefined)       { setClauses.push('Email = ?');       values.push(email); }
  if (idCard !== undefined)      { setClauses.push('IDCard = ?');      values.push(idCard); }
  if (job !== undefined)         { setClauses.push('Job = ?');         values.push(job); }
  if (address !== undefined)     { setClauses.push('Address = ?');     values.push(address); }
  if (avatarUrl !== undefined)   { setClauses.push('AvatarURL = ?');   values.push(avatarUrl); }

  if (setClauses.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Không có thông tin nào để cập nhật');
  }

  values.push(parentId);
  await pool.query(
    `UPDATE Parents SET ${setClauses.join(', ')} WHERE ParentID = ?`,
    values
  );

  const [rows] = await pool.query(
    `SELECT ParentID AS parentId, FullName AS fullName, DateOfBirth AS dateOfBirth,
            PhoneNumber AS phoneNumber, Email AS email, IDCard AS idCard,
            Job AS job, Address AS address, AvatarURL AS avatarUrl
     FROM Parents WHERE ParentID = ?`,
    [parentId]
  );
  return rows[0];
};

/**
 * Get all relatives (parents/guardians) of a student
 * @param {number} studentId
 * @returns {Promise<Array>}
 */
export const getStudentRelatives = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT
       p.ParentID      AS parentId,
       p.FullName      AS fullName,
       p.DateOfBirth   AS dateOfBirth,
       p.PhoneNumber   AS phoneNumber,
       p.Email         AS email,
       p.IDCard        AS idCard,
       p.Job           AS job,
       p.Address       AS address,
       p.AvatarURL     AS avatarUrl,
       sp.Relationship AS relationship,
       sp.IsPrimary    AS isPrimary
     FROM StudentParents sp
     JOIN Parents p ON sp.ParentID = p.ParentID
     WHERE sp.StudentID = ?
     ORDER BY sp.IsPrimary DESC, p.FullName ASC`,
    [studentId]
  );
  return rows;
};

/**
 * Create a new leave request for a child
 * @param {number} studentId
 * @param {number} parentId
 * @param {number} fromDate
 * @param {number} toDate
 * @param {string} reason
 * @param {string|null} evidenceUrl
 * @param {string|null} parentNotes
 * @returns {Promise<Object>} Created leave request
 */
export const createLeaveRequest = async (
  studentId,
  parentId,
  fromDate,
  toDate,
  reason,
  evidenceUrl,
  parentNotes
) => {
  const createdAt = Math.floor(Date.now() / 1000);
  const insertQuery = `
    INSERT INTO LeaveRequests (StudentID, ParentID, FromDate, ToDate, Reason, EvidenceURL, Status, ParentNotes, CreatedAt)
    VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?)
  `;
  const [result] = await pool.query(insertQuery, [
    studentId,
    parentId,
    fromDate,
    toDate,
    reason,
    evidenceUrl,
    parentNotes,
    createdAt
  ]);

  const requestId = result.insertId;

  // Retrieve the newly created leave request to return it
  const selectQuery = `
    SELECT 
      RequestID AS requestId,
      StudentID AS studentId,
      ParentID AS parentId,
      FromDate AS fromDate,
      ToDate AS toDate,
      Reason AS reason,
      EvidenceURL AS evidenceUrl,
      Status AS status,
      ApproverID AS approverId,
      IsMealFeeDeducted AS isMealFeeDeducted,
      ParentNotes AS parentNotes,
      CreatedAt AS createdAt,
      UpdatedTime AS updatedTime
    FROM LeaveRequests
    WHERE RequestID = ?
  `;
  const [rows] = await pool.query(selectQuery, [requestId]);
  return rows[0];
};

/**
 * Get leave requests of a child by StudentID
 * @param {number} studentId
 * @returns {Promise<Array>} List of leave requests
 */
export const getLeaveRequestsByStudentId = async (studentId) => {
  const query = `
    SELECT 
      RequestID AS requestId,
      StudentID AS studentId,
      ParentID AS parentId,
      FromDate AS fromDate,
      ToDate AS toDate,
      Reason AS reason,
      EvidenceURL AS evidenceUrl,
      Status AS status,
      ApproverID AS approverId,
      IsMealFeeDeducted AS isMealFeeDeducted,
      ParentNotes AS parentNotes,
      CreatedAt AS createdAt,
      UpdatedTime AS updatedTime
    FROM LeaveRequests
    WHERE StudentID = ?
    ORDER BY CreatedAt DESC, RequestID DESC
  `;
  const [rows] = await pool.query(query, [studentId]);
  return rows;
};

/**
 * Create a new medication request for a child
 * @param {number} studentId
 * @param {number} parentId
 * @param {number} requestDate
 * @param {string} medicineDetails
 * @param {string} dosage
 * @param {string|null} medicineImageUrl
 * @param {string|null} frequency
 * @param {string|null} timeToTake
 * @param {string|null} parentNote
 * @returns {Promise<Object>} Created medication request
 */
export const createMedicationRequest = async (
  studentId,
  parentId,
  requestDate,
  medicineDetails,
  dosage,
  medicineImageUrl,
  frequency,
  timeToTake,
  parentNote
) => {
  const insertQuery = `
    INSERT INTO MedicationRequests (StudentID, ParentID, RequestDate, MedicineDetails, Dosage, MedicineImageURL, Status, Frequency, TimeToTake, ParentNote)
    VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?)
  `;
  const [result] = await pool.query(insertQuery, [
    studentId,
    parentId,
    requestDate,
    medicineDetails,
    dosage,
    medicineImageUrl,
    frequency,
    timeToTake,
    parentNote
  ]);

  const medRequestId = result.insertId;

  // Retrieve the newly created medication request to return it
  const selectQuery = `
    SELECT 
      MedRequestID AS medRequestId,
      StudentID AS studentId,
      ParentID AS parentId,
      RequestDate AS requestDate,
      MedicineDetails AS medicineDetails,
      Dosage AS dosage,
      MedicineImageURL AS medicineImageUrl,
      Status AS status,
      TeacherNote AS teacherNote,
      Frequency AS frequency,
      TimeToTake AS timeToTake,
      ParentNote AS parentNote,
      UpdatedTime AS updatedTime
    FROM MedicationRequests
    WHERE MedRequestID = ?
  `;
  const [rows] = await pool.query(selectQuery, [medRequestId]);
  return rows[0];
};

/**
 * Get medication requests of a child by StudentID
 * @param {number} studentId
 * @returns {Promise<Array>} List of medication requests
 */
export const getMedicationRequestsByStudentId = async (studentId) => {
  const query = `
    SELECT 
      MedRequestID AS medRequestId,
      StudentID AS studentId,
      ParentID AS parentId,
      RequestDate AS requestDate,
      MedicineDetails AS medicineDetails,
      Dosage AS dosage,
      MedicineImageURL AS medicineImageUrl,
      Status AS status,
      TeacherNote AS teacherNote,
      Frequency AS frequency,
      TimeToTake AS timeToTake,
      ParentNote AS parentNote,
      UpdatedTime AS updatedTime
    FROM MedicationRequests
    WHERE StudentID = ?
    ORDER BY RequestDate DESC, MedRequestID DESC
  `;
  const [rows] = await pool.query(query, [studentId]);
  return rows;
};

/**
 * Get attendance records of a child by StudentID
 * @param {number} studentId
 * @param {number|null} startDate - Start date timestamp in seconds
 * @param {number|null} endDate - End date timestamp in seconds
 * @returns {Promise<Array>} List of attendance records
 */
export const getStudentAttendance = async (studentId, startDate, endDate) => {
  let query = `
    SELECT 
      a.AttendanceID AS attendanceId,
      a.StudentID AS studentId,
      a.AttendanceDate AS attendanceDate,
      a.Status AS status,
      a.CheckInTime AS checkInTime,
      a.CheckOutTime AS checkOutTime,
      
      -- Dropped off info
      a.DroppedOffByParentID AS droppedOffByParentId,
      COALESCE(p_in.FullName, pa.ProxyName) AS droppedOffBy,
      COALESCE(sp_in.Relationship, 'Người đưa đi') AS droppedOffRelationship,
      p_in.AvatarURL AS droppedOffAvatarUrl,
      
      -- Picked up info
      a.PickedUpByParentID AS pickedUpByParentId,
      COALESCE(p_out.FullName, pa.ProxyName) AS pickedUpBy,
      COALESCE(sp_out.Relationship, 'Người đón hộ') AS pickedUpRelationship,
      COALESCE(p_out.AvatarURL, pa.ProxyPhotoURL) AS pickedUpAvatarUrl,
      
      a.CheckedInByTeacherID AS checkedInByTeacherId,
      a.CheckedOutByTeacherID AS checkedOutByTeacherId,
      a.ProxyAuthorizationID AS proxyAuthorizationId
    FROM Attendances a
    LEFT JOIN Parents p_in ON a.DroppedOffByParentID = p_in.ParentID
    LEFT JOIN StudentParents sp_in ON p_in.ParentID = sp_in.ParentID AND sp_in.StudentID = a.StudentID
    LEFT JOIN Parents p_out ON a.PickedUpByParentID = p_out.ParentID
    LEFT JOIN StudentParents sp_out ON p_out.ParentID = sp_out.ParentID AND sp_out.StudentID = a.StudentID
    LEFT JOIN ProxyAuthorizations pa ON a.ProxyAuthorizationID = pa.AuthorizationID
    WHERE a.StudentID = ?
  `;
  const params = [studentId];

  if (startDate !== null && startDate !== undefined) {
    query += ' AND AttendanceDate >= ?';
    params.push(startDate);
  }

  if (endDate !== null && endDate !== undefined) {
    query += ' AND AttendanceDate <= ?';
    params.push(endDate);
  }

  query += ' ORDER BY AttendanceDate DESC';

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Cancel a pending leave request
 * @param {number} requestId
 * @param {number} parentId
 * @returns {Promise<Object>} Updated leave request
 */
export const cancelLeaveRequest = async (requestId, parentId) => {
  const [rows] = await pool.query('SELECT ParentID, Status FROM LeaveRequests WHERE RequestID = ?', [requestId]);
  if (rows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đơn xin nghỉ học');
  }
  const request = rows[0];
  if (request.ParentID !== parentId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền hủy đơn xin nghỉ học này');
  }
  if (request.Status !== 'Pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Chỉ có thể hủy đơn xin nghỉ học ở trạng thái Chờ phản hồi');
  }

  await pool.query(
    'UPDATE LeaveRequests SET Status = \'Cancelled\' WHERE RequestID = ?',
    [requestId]
  );

  // Return the updated request
  const selectQuery = `
    SELECT 
      RequestID AS requestId,
      StudentID AS studentId,
      ParentID AS parentId,
      FromDate AS fromDate,
      ToDate AS toDate,
      Reason AS reason,
      EvidenceURL AS evidenceUrl,
      Status AS status,
      ApproverID AS approverId,
      IsMealFeeDeducted AS isMealFeeDeducted,
      ParentNotes AS parentNotes,
      CreatedAt AS createdAt,
      UpdatedTime AS updatedTime
    FROM LeaveRequests
    WHERE RequestID = ?
  `;
  const [updatedRows] = await pool.query(selectQuery, [requestId]);
  return updatedRows[0];
};

/**
 * Cancel a pending medication request group (by RequestDate)
 * @param {number} medRequestId
 * @param {number} parentId
 * @returns {Promise<Array>} List of updated medication requests in the group
 */
export const cancelMedicationRequest = async (medRequestId, parentId) => {
  const [rows] = await pool.query('SELECT StudentID, ParentID, RequestDate, Status FROM MedicationRequests WHERE MedRequestID = ?', [medRequestId]);
  if (rows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy dặn dò thuốc');
  }
  const request = rows[0];
  if (request.ParentID !== parentId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền hủy dặn dò thuốc này');
  }
  if (request.Status !== 'Pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Chỉ có thể hủy dặn dò thuốc ở trạng thái Chờ phản hồi');
  }

  // Cancel all pending requests in the group
  await pool.query(
    'UPDATE MedicationRequests SET Status = \'Cancelled\' WHERE StudentID = ? AND ParentID = ? AND RequestDate = ? AND Status = \'Pending\'',
    [request.StudentID, parentId, request.RequestDate]
  );

  // Return all medication requests for this group
  const selectQuery = `
    SELECT 
      MedRequestID AS medRequestId,
      StudentID AS studentId,
      ParentID AS parentId,
      RequestDate AS requestDate,
      MedicineDetails AS medicineDetails,
      Dosage AS dosage,
      MedicineImageURL AS medicineImageUrl,
      Status AS status,
      TeacherNote AS teacherNote,
      Frequency AS frequency,
      TimeToTake AS timeToTake,
      ParentNote AS parentNote,
      UpdatedTime AS updatedTime
    FROM MedicationRequests
    WHERE StudentID = ? AND ParentID = ? AND RequestDate = ?
  `;
  const [updatedRows] = await pool.query(selectQuery, [request.StudentID, parentId, request.RequestDate]);
  return updatedRows;
};

/**
 * Get assessments of a child by StudentID, optionally filtered by month
 * @param {number} studentId
 * @param {string|null} month - Month in MM-YYYY format
 * @returns {Promise<Array>} List of assessments
 */
export const getStudentAssessments = async (studentId, month = null) => {
  let query = `
    SELECT 
      AssessmentID AS assessmentId,
      StudentID AS studentId,
      AssessmentMonth AS assessmentMonth,
      PhysicalScore AS physicalScore,
      CognitiveScore AS cognitiveScore,
      LanguageScore AS languageScore,
      SocioEmotionalScore AS socioEmotionalScore,
      AestheticScore AS aestheticScore,
      TeacherComment AS teacherComment,
      CreatedAt AS createdAt
    FROM StudentAssessments
    WHERE StudentID = ?
  `;
  const params = [studentId];

  if (month) {
    query += ' AND AssessmentMonth = ?';
    params.push(month);
  }

  query += ' ORDER BY AssessmentID DESC';

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get daily schedule of a child's class by StudentID and ScheduleDate
 * @param {number} studentId
 * @param {number} targetDate - Midnight timestamp in seconds
 * @returns {Promise<Array>} List of daily schedule items
 */
export const getStudentDailySchedule = async (studentId, targetDate) => {
  const query = `
    SELECT 
      ds.DailyScheduleID AS dailyScheduleId,
      ds.ClassID AS classId,
      ds.ScheduleDate AS scheduleDate,
      ds.StartTime AS startTime,
      ds.EndTime AS endTime,
      ds.ActivityName AS activityName,
      ds.Details AS details,
      ds.Location AS location,
      ds.ActivityType AS activityType,
      ds.Status AS status
    FROM DailySchedules ds
    JOIN Students s ON ds.ClassID = s.ClassID
    WHERE s.StudentID = ? AND ds.ScheduleDate = ?
    ORDER BY ds.StartTime ASC
  `;
  const [rows] = await pool.query(query, [studentId, targetDate]);
  return rows;
};

/**
 * Get daily lessons of a child's class by StudentID and LessonDate
 * @param {number} studentId
 * @param {number} targetDate - Midnight timestamp in seconds
 * @returns {Promise<Array>} List of daily lesson items
 */
export const getStudentDailyLessons = async (studentId, targetDate) => {
  const query = `
    SELECT 
      dl.LessonLogID AS lessonLogId,
      dl.ClassID AS classId,
      dl.LessonDate AS lessonDate,
      dl.SubjectName AS subjectName,
      dl.LessonTitle AS lessonTitle,
      dl.Details AS details,
      dl.IconType AS iconType,
      dl.CreatedAt AS createdAt,
      dl.UpdatedAt AS updatedAt
    FROM DailyLessons dl
    JOIN Students s ON dl.ClassID = s.ClassID
    WHERE s.StudentID = ? AND dl.LessonDate = ?
    ORDER BY dl.LessonLogID ASC
  `;
  const [rows] = await pool.query(query, [studentId, targetDate]);
  return rows;
};

/**
 * Get daily albums of a child's class by StudentID and AlbumDate
 * @param {number} studentId
 * @param {number} targetDate - Midnight timestamp in seconds
 * @returns {Promise<Array>} List of daily albums with photos
 */
export const getStudentDailyAlbums = async (studentId, targetDate) => {
  const query = `
    SELECT 
      da.AlbumID AS albumId,
      da.ClassID AS classId,
      da.TeacherID AS teacherId,
      da.AlbumDate AS albumDate,
      da.Caption AS caption,
      da.CreatedAt AS createdAt,
      da.UpdatedAt AS updatedAt
    FROM DailyAlbums da
    JOIN Students s ON da.ClassID = s.ClassID
    WHERE s.StudentID = ? AND da.AlbumDate = ?
    ORDER BY da.AlbumID ASC
  `;
  const [albums] = await pool.query(query, [studentId, targetDate]);

  if (albums.length === 0) {
    return [];
  }

  const albumIds = albums.map(a => a.albumId);
  const placeholders = albumIds.map(() => '?').join(',');

  const [photos] = await pool.query(
    `SELECT 
      PhotoID AS photoId,
      AlbumID AS albumId,
      PhotoURL AS photoUrl,
      Description AS description,
      CreatedAt AS createdAt
     FROM DailyAlbumPhotos
     WHERE AlbumID IN (${placeholders})
     ORDER BY PhotoID ASC`,
    albumIds
  );

  // Group photos by albumId
  const photosByAlbum = {};
  for (const photo of photos) {
    if (!photosByAlbum[photo.albumId]) {
      photosByAlbum[photo.albumId] = [];
    }
    photosByAlbum[photo.albumId].push(photo);
  }

  // Attach photos to each album
  return albums.map(album => ({
    ...album,
    photos: photosByAlbum[album.albumId] || []
  }));
};

export const generateQrToken = async (parentId, studentId) => {
  const hasAccess = await isParentOfStudent(parentId, studentId);
  if (!hasAccess) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Học sinh không thuộc về phụ huynh này');
  }

  // Get parent name and relationship to child
  const parentProfile = await getParentProfileById(parentId);
  const relationshipQuery = `
    SELECT Relationship FROM StudentParents WHERE ParentID = ? AND StudentID = ?
  `;
  const [relRows] = await pool.query(relationshipQuery, [parentId, studentId]);
  const relationship = relRows.length > 0 ? relRows[0].Relationship : 'Phụ huynh';

  const ttl = parseInt(process.env.QR_TOKEN_TTL || '60', 10);
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    sub: String(studentId),
    parentId: parentId,
    parentName: parentProfile?.fullName || 'Phụ huynh',
    relationship: relationship || 'Phụ huynh',
    iat: now,
    exp: now + ttl,
    jti: randomUUID(),
  };

  const token = jwt.sign(payload, process.env.QR_TOKEN_SECRET, { algorithm: 'HS256' });

  return { token, expiresAt: now + ttl, ttl };
};

export const createProxyAuthorization = async (
  studentId,
  parentId,
  authorizationDate,
  type,
  proxyName,
  proxyPhone,
  proxyIDCard,
  proxyPhotoUrl,
  notes
) => {
  const createdAt = Math.floor(Date.now() / 1000);
  const insertQuery = `
    INSERT INTO ProxyAuthorizations (StudentID, ParentID, AuthorizationDate, Type, ProxyName, ProxyPhone, ProxyIDCard, ProxyPhotoURL, Notes, Status, CreatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Approved', ?)
  `;
  const [result] = await pool.query(insertQuery, [
    studentId,
    parentId,
    authorizationDate,
    type,
    proxyName,
    proxyPhone,
    proxyIDCard,
    proxyPhotoUrl,
    notes,
    createdAt
  ]);

  const selectQuery = `
    SELECT 
      AuthorizationID AS authorizationId,
      StudentID AS studentId,
      ParentID AS parentId,
      AuthorizationDate AS authorizationDate,
      Type AS type,
      ProxyName AS proxyName,
      ProxyPhone AS proxyPhone,
      ProxyIDCard AS proxyIDCard,
      ProxyPhotoURL AS proxyPhotoUrl,
      Notes AS notes,
      Status AS status,
      CreatedAt AS createdAt
    FROM ProxyAuthorizations
    WHERE AuthorizationID = ?
  `;
  const [rows] = await pool.query(selectQuery, [result.insertId]);
  return rows[0];
};

export const getProxyAuthorizationsByStudentId = async (studentId) => {
  const query = `
    SELECT 
      AuthorizationID AS authorizationId,
      StudentID AS studentId,
      ParentID AS parentId,
      AuthorizationDate AS authorizationDate,
      Type AS type,
      ProxyName AS proxyName,
      ProxyPhone AS proxyPhone,
      ProxyIDCard AS proxyIDCard,
      ProxyPhotoURL AS proxyPhotoUrl,
      Notes AS notes,
      Status AS status,
      CreatedAt AS createdAt
    FROM ProxyAuthorizations
    WHERE StudentID = ?
    ORDER BY AuthorizationDate DESC, AuthorizationID DESC
  `;
  const [rows] = await pool.query(query, [studentId]);
  return rows;
};

export const cancelProxyAuthorization = async (authorizationId, parentId) => {
  const updateQuery = `
    UPDATE ProxyAuthorizations 
    SET Status = 'Cancelled' 
    WHERE AuthorizationID = ? AND ParentID = ?
  `;
  await pool.query(updateQuery, [authorizationId, parentId]);

  const selectQuery = `
    SELECT 
      AuthorizationID AS authorizationId,
      StudentID AS studentId,
      ParentID AS parentId,
      AuthorizationDate AS authorizationDate,
      Type AS type,
      ProxyName AS proxyName,
      ProxyPhone AS proxyPhone,
      ProxyIDCard AS proxyIDCard,
      ProxyPhotoURL AS proxyPhotoUrl,
      Notes AS notes,
      Status AS status,
      CreatedAt AS createdAt
    FROM ProxyAuthorizations
    WHERE AuthorizationID = ?
  `;
  const [rows] = await pool.query(selectQuery, [authorizationId]);
  if (rows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đơn ủy quyền');
  }
  return rows[0];
};

/**
 * Get newsfeeds of the class that a student is attending
 * @param {number} studentId
 * @returns {Promise<Array>} List of newsfeeds
 */
export const getNewsfeedsByStudentId = async (studentId) => {
  const studentQuery = `
    SELECT ClassID AS classId
    FROM Students
    WHERE StudentID = ?
  `;
  const [studentRows] = await pool.query(studentQuery, [studentId]);
  if (studentRows.length === 0 || !studentRows[0].classId) {
    return [];
  }

  const classId = studentRows[0].classId;

  const newsfeedsQuery = `
    SELECT 
      n.PostID AS postId,
      n.ClassID AS classId,
      n.TeacherID AS teacherId,
      n.Content AS content,
      n.MediaURL AS mediaUrl,
      n.PostedAt AS postedAt,
      t.FullName AS teacherName,
      u.AvatarURL AS teacherAvatarUrl
    FROM Newsfeeds n
    LEFT JOIN Teachers t ON n.TeacherID = t.TeacherID
    LEFT JOIN Users u ON t.TeacherID = u.UserID
    WHERE n.ClassID = ?
    ORDER BY n.PostedAt DESC
  `;
  const [rows] = await pool.query(newsfeedsQuery, [classId]);
  return rows;
};

/**
 * Calculates the ISO week number and year for a given date
 * @param {Date} date
 * @returns {{ week: number, year: number }}
 */
const getISOWeekAndYear = (date) => {
  const tempDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
  const year = tempDate.getUTCFullYear();
  const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
  const weekNumber = Math.ceil((((tempDate - firstDayOfYear) / 86400000) + 1) / 7);
  return { week: weekNumber, year };
};

/**
 * Get daily menu of a child's class by StudentID and MenuDate
 * @param {number} studentId
 * @param {number} targetDate - Midnight timestamp in seconds
 * @returns {Promise<Object|null>} Daily menu with details
 */
export const getStudentMenu = async (studentId, targetDate) => {
  const dateObj = new Date(targetDate * 1000);
  const { week, year } = getISOWeekAndYear(dateObj);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[dateObj.getUTCDay()];

  const menuQuery = `
    SELECT 
      m.MenuID AS menuId,
      m.ClassID AS classId,
      m.WeekNumber AS weekNumber,
      m.Year AS year,
      m.MenuName AS menuName
    FROM Menus m
    JOIN Students s ON m.ClassID = s.ClassID
    WHERE s.StudentID = ? AND m.WeekNumber = ? AND m.Year = ?
  `;
  const [menuRows] = await pool.query(menuQuery, [studentId, week, year]);
  
  if (menuRows.length === 0) {
    return null;
  }

  const menu = menuRows[0];

  const detailsQuery = `
    SELECT 
      MenuDetailID AS menuDetailId,
      MealType AS mealType,
      DishName AS dishName,
      Calories AS calories,
      NutritionalDetails AS nutritionalDetails
    FROM MenuDetails
    WHERE MenuID = ? AND DayOfWeek = ?
    ORDER BY MenuDetailID ASC
  `;
  const [detailsRows] = await pool.query(detailsQuery, [menu.menuId, dayOfWeek]);
  
  return {
    menuId: menu.menuId,
    classId: menu.classId,
    menuDate: targetDate,
    weekNumber: menu.weekNumber,
    year: menu.year,
    menuName: menu.menuName,
    details: detailsRows
  };
};

/**
 * Get daily activities of a child by StudentID and LogDate
 * @param {number} studentId
 * @param {string} logDateStr - Date in YYYY-MM-DD format
 * @returns {Promise<Object|null>} Daily activities record
 */
export const getDailyActivities = async (studentId, logDateStr) => {
  const query = `
    SELECT
      da.ActivityID AS activityId,
      da.StudentID AS studentId,
      da.LogDate AS logDate,
      da.BreakfastStatus AS breakfastStatus,
      da.LunchStatus AS lunchStatus,
      da.NapStatus AS napStatus,
      da.SnackStatus AS snackStatus,
      da.HygieneStatus AS hygieneStatus,
      da.TeacherNote AS teacherNote,
      da.ActivityStatus AS activityStatus,
      da.RecordedBy AS recordedBy,
      da.UpdatedAt AS updatedAt,
      t.FullName AS teacherName
    FROM DailyActivities da
    LEFT JOIN Teachers t ON da.RecordedBy = t.TeacherID
    WHERE da.StudentID = ? AND da.LogDate = ?
  `;
  const [rows] = await pool.query(query, [studentId, logDateStr]);
  return rows.length > 0 ? rows[0] : null;
};

export const getStudentBadges = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT
       sb.StudentBadgeID AS studentBadgeId,
       sb.StudentID      AS studentId,
       sb.DateEarned     AS dateEarned,
       rb.BadgeID        AS badgeId,
       rb.BadgeName      AS badgeName,
       rb.BadgeImageURL  AS badgeImageUrl,
       rb.CriteriaType   AS criteriaType
     FROM StudentBadges sb
     JOIN RewardBadges rb ON sb.BadgeID = rb.BadgeID
     WHERE sb.StudentID = ?
     ORDER BY sb.DateEarned DESC`,
    [studentId]
  );
  return rows;
};

export const changePassword = async (parentId, currentPassword, newPassword) => {
  const [rows] = await pool.query(
    'SELECT PasswordHash FROM Users WHERE UserID = ?',
    [parentId]
  );
  if (rows.length === 0) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy tài khoản');

  const isMatch = await bcrypt.compare(currentPassword, rows[0].PasswordHash);
  if (!isMatch) throw new ApiError(httpStatus.BAD_REQUEST, 'Mật khẩu hiện tại không đúng');

  const hashed = await bcrypt.hash(newPassword, 12);
  await pool.query('UPDATE Users SET PasswordHash = ? WHERE UserID = ?', [hashed, parentId]);
};

export const getStudentWeeklyTimetable = async (studentId, dateParam = null) => {
  // 1. Get student's classId
  const [studentRows] = await pool.query('SELECT ClassID FROM Students WHERE StudentID = ?', [studentId]);
  if (studentRows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy học sinh');
  }
  const classId = studentRows[0].ClassID;
  if (!classId) {
    return null; // Student has no class assigned yet
  }

  // 2. Parse date in GMT+7
  let dateObj = new Date();
  if (dateParam) {
    dateObj = new Date(dateParam * 1000);
  }
  // Shift to GMT+7 timezone for consistent date calculation
  const tzOffset = 7 * 60 * 60 * 1000;
  const localTime = new Date(dateObj.getTime() + tzOffset);
  
  const month = localTime.getUTCMonth() + 1;
  const year = localTime.getUTCFullYear();
  const day = localTime.getUTCDate();
  const weekOrder = Math.ceil(day / 7);

  // 3. Find MonthlySchedule
  let monthlyQuery = `
    SELECT MonthlyScheduleID AS monthlyScheduleId, MonthTheme AS monthTheme, Month AS month, Year AS year
    FROM MonthlySchedules
    WHERE ClassID = ? AND Month = ? AND Year = ? AND IsActive = 1
  `;
  let [monthlyRows] = await pool.query(monthlyQuery, [classId, month, year]);
  
  if (monthlyRows.length === 0) {
    // Fallback to the latest active monthly schedule for this class
    const fallbackQuery = `
      SELECT MonthlyScheduleID AS monthlyScheduleId, MonthTheme AS monthTheme, Month AS month, Year AS year
      FROM MonthlySchedules
      WHERE ClassID = ? AND IsActive = 1
      ORDER BY Year DESC, Month DESC
      LIMIT 1
    `;
    [monthlyRows] = await pool.query(fallbackQuery, [classId]);
  }

  if (monthlyRows.length === 0) {
    return null; // No monthly schedule found
  }

  const monthlySchedule = monthlyRows[0];
  const targetMonthlyScheduleId = monthlySchedule.monthlyScheduleId;

  // 4. Find WeeklySchedule
  let weeklyQuery = `
    SELECT WeeklyScheduleID AS weeklyScheduleId, WeekTheme AS weekTheme, WeekOrder AS weekOrder
    FROM WeeklySchedules
    WHERE MonthlyScheduleID = ? AND WeekOrder = ?
  `;
  let [weeklyRows] = await pool.query(weeklyQuery, [targetMonthlyScheduleId, weekOrder]);

  if (weeklyRows.length === 0) {
    // Fallback to the first available weekly schedule under this monthly schedule
    const fallbackWeeklyQuery = `
      SELECT WeeklyScheduleID AS weeklyScheduleId, WeekTheme AS weekTheme, WeekOrder AS weekOrder
      FROM WeeklySchedules
      WHERE MonthlyScheduleID = ?
      ORDER BY WeekOrder ASC
      LIMIT 1
    `;
    [weeklyRows] = await pool.query(fallbackWeeklyQuery, [targetMonthlyScheduleId]);
  }

  if (weeklyRows.length === 0) {
    return {
      monthlyScheduleId: monthlySchedule.monthlyScheduleId,
      month: monthlySchedule.month,
      year: monthlySchedule.year,
      monthTheme: monthlySchedule.monthTheme,
      weeklyScheduleId: null,
      weekOrder: null,
      weekTheme: null,
      details: []
    };
  }

  const weeklySchedule = weeklyRows[0];

  // 5. Get WeeklyScheduleDetails
  const detailsQuery = `
    SELECT 
      ScheduleDetailID AS scheduleDetailId,
      DayOfWeek AS dayOfWeek,
      StartTime AS startTime,
      EndTime AS endTime,
      ActivityName AS activityName,
      Details AS details,
      Location AS location,
      ActivityType AS activityType
    FROM WeeklyScheduleDetails
    WHERE WeeklyScheduleID = ?
    ORDER BY FIELD(DayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), StartTime ASC
  `;
  const [details] = await pool.query(detailsQuery, [weeklySchedule.weeklyScheduleId]);

  return {
    monthlyScheduleId: monthlySchedule.monthlyScheduleId,
    month: monthlySchedule.month,
    year: monthlySchedule.year,
    monthTheme: monthlySchedule.monthTheme,
    weeklyScheduleId: weeklySchedule.weeklyScheduleId,
    weekOrder: weeklySchedule.weekOrder,
    weekTheme: weeklySchedule.weekTheme,
    details: details
  };
};











