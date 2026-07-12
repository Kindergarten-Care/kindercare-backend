import pool from '../../config/db.js';

/**
 * Get student by StudentID
 * @param {number} studentId
 * @returns {Promise<Object|null>}
 */
export const getStudentById = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT StudentID AS studentId, FullName AS fullName, Nickname AS nickname, Team AS team, ClassID AS classId
     FROM Students
     WHERE StudentID = ?`,
    [studentId]
  );
  return rows[0] || null;
};

/**
 * Retrieve attendance history of a student for a target month (YYYY-MM)
 * @param {number} studentId
 * @param {string} month - Format YYYY-MM
 * @returns {Promise<Array>} List of attendance history with mapped status
 */
export const getStudentAttendanceHistory = async (studentId, month) => {
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr, 10);
  const monthInt = parseInt(monthStr, 10) - 1;

  // Calculate start and end UTC midnight timestamps for the target month (in seconds)
  const startTs = Math.floor(Date.UTC(year, monthInt, 1) / 1000);
  const endTs = Math.floor(Date.UTC(year, monthInt + 1, 1) / 1000) - 1;

  const [rows] = await pool.query(
    `SELECT AttendanceDate AS attendanceDate, Status AS status
     FROM Attendances
     WHERE StudentID = ? AND AttendanceDate BETWEEN ? AND ?
     ORDER BY AttendanceDate ASC`,
    [studentId, startTs, endTs]
  );

  return rows.map((row) => {
    const dateStr = new Date(row.attendanceDate * 1000).toISOString().split('T')[0];
    
    let mappedStatus = 'UNEXCUSED_ABSENCE';
    if (row.status === 'Present') {
      mappedStatus = 'PRESENT';
    } else if (row.status === 'Excused') {
      mappedStatus = 'PERMISSION_ABSENCE';
    } else if (row.status === 'Absent') {
      mappedStatus = 'UNEXCUSED_ABSENCE';
    }

    return {
      date: dateStr,
      status: mappedStatus
    };
  });
};

/**
 * Retrieve today's medication requests for a child
 * @param {number} studentId
 * @returns {Promise<Array>} List of medications today
 */
export const getStudentMedicationsToday = async (studentId) => {
  const today = new Date();
  const start = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 1000);
  const end = start + 86399;

  const [rows] = await pool.query(
    `SELECT 
       MedRequestID AS medRequestId,
       StudentID AS studentId,
       ParentID AS parentId,
       RequestDate AS requestDate,
       ScheduledDate AS scheduledDate,
       MedicineDetails AS medicineName,
       Dosage AS dosage,
       Frequency AS frequency,
       TimeToTake AS scheduledTime,
       ParentNote AS parentNote,
       MedicineImageURL AS medicineImageUrl,
       Status AS status,
       TeacherNote AS notes,
       AdministeredAt AS administeredAt,
       AdministeredBy AS administeredBy
     FROM MedicationRequests
     WHERE StudentID = ?
       AND ((ScheduledDate IS NOT NULL AND ScheduledDate BETWEEN ? AND ?)
            OR (ScheduledDate IS NULL AND RequestDate BETWEEN ? AND ?))
     ORDER BY MedRequestID DESC`,
    [studentId, start, end, start, end]
  );
  return rows;
};

/**
 * Update nickname and team of a student
 * @param {number} studentId
 * @param {Object} updateFields - { nickname, team }
 * @returns {Promise<boolean>} True if updated successfully
 */
export const updateStudentNicknameAndTeam = async (studentId, updateFields) => {
  const fields = [];
  const params = [];

  if (updateFields.nickname !== undefined) {
    fields.push('Nickname = ?');
    params.push(updateFields.nickname === null ? null : String(updateFields.nickname).trim());
  }
  if (updateFields.team !== undefined) {
    fields.push('Team = ?');
    params.push(updateFields.team === null ? null : String(updateFields.team).trim());
  }

  if (fields.length === 0) {
    return false;
  }

  params.push(studentId);
  const [result] = await pool.query(
    `UPDATE Students SET ${fields.join(', ')} WHERE StudentID = ?`,
    params
  );
  return result.affectedRows > 0;
};
