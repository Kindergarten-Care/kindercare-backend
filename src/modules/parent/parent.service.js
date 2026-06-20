import pool from '../../config/db.js';

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
  const insertQuery = `
    INSERT INTO LeaveRequests (StudentID, ParentID, FromDate, ToDate, Reason, EvidenceURL, Status, ParentNotes)
    VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)
  `;
  const [result] = await pool.query(insertQuery, [
    studentId,
    parentId,
    fromDate,
    toDate,
    reason,
    evidenceUrl,
    parentNotes
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
      ParentNotes AS parentNotes
    FROM LeaveRequests
    WHERE RequestID = ?
  `;
  const [rows] = await pool.query(selectQuery, [requestId]);
  return rows[0];
};

/**
 * Create a new medication request for a child
 * @param {number} studentId
 * @param {number} parentId
 * @param {number} requestDate
 * @param {string} medicineDetails
 * @param {string} dosage
 * @param {string|null} medicineImageUrl
 * @returns {Promise<Object>} Created medication request
 */
export const createMedicationRequest = async (
  studentId,
  parentId,
  requestDate,
  medicineDetails,
  dosage,
  medicineImageUrl
) => {
  const insertQuery = `
    INSERT INTO MedicationRequests (StudentID, ParentID, RequestDate, MedicineDetails, Dosage, MedicineImageURL, Status)
    VALUES (?, ?, ?, ?, ?, ?, 'Pending')
  `;
  const [result] = await pool.query(insertQuery, [
    studentId,
    parentId,
    requestDate,
    medicineDetails,
    dosage,
    medicineImageUrl
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
      TeacherNote AS teacherNote
    FROM MedicationRequests
    WHERE MedRequestID = ?
  `;
  const [rows] = await pool.query(selectQuery, [medRequestId]);
  return rows[0];
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



