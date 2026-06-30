import pool from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

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
      ParentID AS parentId,
      FullName AS fullName,
      PhoneNumber AS phoneNumber,
      Email AS email,
      IDCard AS idCard,
      Job AS job,
      Address AS address,
      AvatarURL AS avatarUrl
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
      AttendanceID AS attendanceId,
      StudentID AS studentId,
      AttendanceDate AS attendanceDate,
      Status AS status,
      CheckInTime AS checkInTime,
      CheckOutTime AS checkOutTime,
      PickedUpBy AS pickedUpBy
    FROM Attendances
    WHERE StudentID = ?
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
    parentName: parentProfile?.fullName || 'Phụ huynh',
    relationship: relationship || 'Phụ huynh',
    iat: now,
    exp: now + ttl,
    jti: randomUUID(),
  };

  const token = jwt.sign(payload, process.env.QR_TOKEN_SECRET, { algorithm: 'HS256' });

  return { token, expiresAt: now + ttl, ttl };
};







