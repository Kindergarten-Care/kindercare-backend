import pool from '../../../config/db.js';
import ApiError from '../../../utils/ApiError.js';
import httpStatus from 'http-status';

const unixNow = () => Math.floor(Date.now() / 1000);

// -----------------------------------------------------------------------------
// Allergies
// -----------------------------------------------------------------------------

export const getAllergiesByStudent = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT AllergyID, StudentID, Allergen, Severity, Reaction, Notes, CreatedAt, UpdatedAt
       FROM StudentAllergies
      WHERE StudentID = ?
      ORDER BY Severity = 'Severe' DESC, Severity = 'Moderate' DESC, CreatedAt DESC`,
    [studentId]
  );
  return rows;
};

export const createAllergy = async (studentId, payload) => {
  const now = unixNow();
  const [result] = await pool.query(
    `INSERT INTO StudentAllergies
       (StudentID, Allergen, Severity, Reaction, Notes, CreatedAt, UpdatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      payload.allergen,
      payload.severity || 'Mild',
      payload.reaction ?? null,
      payload.notes ?? null,
      now,
      now
    ]
  );

  return getAllergyById(result.insertId);
};

export const getAllergyById = async (allergyId) => {
  const [rows] = await pool.query(
    `SELECT AllergyID, StudentID, Allergen, Severity, Reaction, Notes, CreatedAt, UpdatedAt
       FROM StudentAllergies
      WHERE AllergyID = ?`,
    [allergyId]
  );
  return rows[0] || null;
};

export const updateAllergy = async (allergyId, payload) => {
  const existing = await getAllergyById(allergyId);
  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy dị ứng');
  }

  const fields = [];
  const values = [];
  if (payload.allergen !== undefined) { fields.push('Allergen = ?'); values.push(payload.allergen); }
  if (payload.severity !== undefined) { fields.push('Severity = ?'); values.push(payload.severity); }
  if (payload.reaction !== undefined) { fields.push('Reaction = ?'); values.push(payload.reaction ?? null); }
  if (payload.notes !== undefined) { fields.push('Notes = ?'); values.push(payload.notes ?? null); }

  fields.push('UpdatedAt = ?');
  values.push(unixNow());
  values.push(allergyId);

  await pool.query(
    `UPDATE StudentAllergies SET ${fields.join(', ')} WHERE AllergyID = ?`,
    values
  );

  return getAllergyById(allergyId);
};

export const deleteAllergy = async (allergyId) => {
  const [result] = await pool.query(
    `DELETE FROM StudentAllergies WHERE AllergyID = ?`,
    [allergyId]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy dị ứng');
  }
  return { allergyId };
};

// -----------------------------------------------------------------------------
// Medications
// -----------------------------------------------------------------------------

export const getMedicationsByStudent = async (studentId, status) => {
  const params = [studentId];
  let where = 'WHERE StudentID = ?';
  if (status) {
    where += ' AND Status = ?';
    params.push(status);
  }

  const [rows] = await pool.query(
    `SELECT MedicationID, StudentID, MedRequestID, MedicineName, Dosage, ScheduledTime,
            Frequency, Status, AdministeredAt, AdministeredBy, Notes, CreatedAt, UpdatedAt
       FROM StudentMedications
       ${where}
       ORDER BY Status = 'Pending' DESC,
                Field(ScheduledTime, 'Sáng', 'Trưa', 'Chiều'),
                CreatedAt DESC`,
    params
  );
  return rows;
};

export const createMedication = async (studentId, payload, teacherId) => {
  const now = unixNow();
  const [result] = await pool.query(
    `INSERT INTO StudentMedications
       (StudentID, MedRequestID, MedicineName, Dosage, ScheduledTime, Frequency,
        Status, AdministeredAt, AdministeredBy, Notes, CreatedAt, UpdatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      payload.medRequestId ?? null,
      payload.medicineName,
      payload.dosage,
      payload.scheduledTime ?? null,
      payload.frequency ?? null,
      payload.status || 'Pending',
      null,
      null,
      payload.notes ?? null,
      now,
      now
    ]
  );

  return getMedicationById(result.insertId);
};

export const getMedicationById = async (medicationId) => {
  const [rows] = await pool.query(
    `SELECT MedicationID, StudentID, MedRequestID, MedicineName, Dosage, ScheduledTime,
            Frequency, Status, AdministeredAt, AdministeredBy, Notes, CreatedAt, UpdatedAt
       FROM StudentMedications
      WHERE MedicationID = ?`,
    [medicationId]
  );
  return rows[0] || null;
};

export const updateMedicationStatus = async (medicationId, status, teacherId, notes) => {
  const existing = await getMedicationById(medicationId);
  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thuốc');
  }

  const now = unixNow();
  const administeredAt = status === 'Done' ? now : null;
  const administeredBy = status === 'Done' ? teacherId : null;

  await pool.query(
    `UPDATE StudentMedications
        SET Status = ?,
            AdministeredAt = ?,
            AdministeredBy = ?,
            Notes = COALESCE(?, Notes),
            UpdatedAt = ?
      WHERE MedicationID = ?`,
    [status, administeredAt, administeredBy, notes ?? null, now, medicationId]
  );

  return getMedicationById(medicationId);
};

export const deleteMedication = async (medicationId) => {
  const [result] = await pool.query(
    `DELETE FROM StudentMedications WHERE MedicationID = ?`,
    [medicationId]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thuốc');
  }
  return { medicationId };
};

// -----------------------------------------------------------------------------
// Health Logs
// -----------------------------------------------------------------------------

const startOfDayTs = (dateString) => {
  const d = dateString ? new Date(`${dateString}T00:00:00Z`) : new Date();
  d.setUTCHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
};

const endOfDayTs = (dateString) => {
  const d = dateString ? new Date(`${dateString}T00:00:00Z`) : new Date();
  d.setUTCHours(23, 59, 59, 999);
  return Math.floor(d.getTime() / 1000);
};

export const getHealthLogsByStudent = async (studentId, dateString) => {
  const start = startOfDayTs(dateString);
  const end = endOfDayTs(dateString);

  const [rows] = await pool.query(
    `SELECT l.LogID, l.StudentID, l.LogType, l.Value, l.Description, l.Severity,
            l.ActionTaken, l.LoggedBy, l.LoggedAt, l.CreatedAt,
            u.FullName AS LoggedByName
       FROM StudentHealthLogs l
       LEFT JOIN Users u ON l.LoggedBy = u.UserID
      WHERE l.StudentID = ?
        AND l.LoggedAt BETWEEN ? AND ?
      ORDER BY l.LoggedAt DESC, l.LogID DESC`,
    [studentId, start, end]
  );
  return rows;
};

export const createHealthLog = async (studentId, payload, teacherId) => {
  const loggedAt = payload.loggedAt ?? unixNow();
  const [result] = await pool.query(
    `INSERT INTO StudentHealthLogs
       (StudentID, LogType, Value, Description, Severity, ActionTaken, LoggedBy, LoggedAt, CreatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      payload.logType,
      payload.value ?? null,
      payload.description ?? null,
      payload.severity || 'Normal',
      payload.actionTaken ?? null,
      teacherId,
      loggedAt,
      unixNow()
    ]
  );
  return getHealthLogById(result.insertId);
};

export const getHealthLogById = async (logId) => {
  const [rows] = await pool.query(
    `SELECT l.LogID, l.StudentID, l.LogType, l.Value, l.Description, l.Severity,
            l.ActionTaken, l.LoggedBy, l.LoggedAt, l.CreatedAt,
            u.FullName AS LoggedByName
       FROM StudentHealthLogs l
       LEFT JOIN Users u ON l.LoggedBy = u.UserID
      WHERE l.LogID = ?`,
    [logId]
  );
  return rows[0] || null;
};

export const updateHealthLog = async (logId, payload) => {
  const existing = await getHealthLogById(logId);
  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhật ký sức khỏe');
  }

  const fields = [];
  const values = [];
  if (payload.logType !== undefined) { fields.push('LogType = ?'); values.push(payload.logType); }
  if (payload.value !== undefined) { fields.push('Value = ?'); values.push(payload.value ?? null); }
  if (payload.description !== undefined) { fields.push('Description = ?'); values.push(payload.description ?? null); }
  if (payload.severity !== undefined) { fields.push('Severity = ?'); values.push(payload.severity); }
  if (payload.actionTaken !== undefined) { fields.push('ActionTaken = ?'); values.push(payload.actionTaken ?? null); }
  if (payload.loggedAt !== undefined) { fields.push('LoggedAt = ?'); values.push(payload.loggedAt); }

  if (fields.length === 0) {
    return existing;
  }

  values.push(logId);
  await pool.query(
    `UPDATE StudentHealthLogs SET ${fields.join(', ')} WHERE LogID = ?`,
    values
  );
  return getHealthLogById(logId);
};

export const deleteHealthLog = async (logId) => {
  const [result] = await pool.query(
    `DELETE FROM StudentHealthLogs WHERE LogID = ?`,
    [logId]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhật ký sức khỏe');
  }
  return { logId };
};

// -----------------------------------------------------------------------------
// Cross-cutting: verify the student belongs to the class
// -----------------------------------------------------------------------------

export const assertStudentBelongsToClass = async (studentId, classId) => {
  const [rows] = await pool.query(
    `SELECT StudentID FROM Students WHERE StudentID = ? AND ClassID = ?`,
    [studentId, classId]
  );
  if (rows.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Không tìm thấy học sinh trong lớp này'
    );
  }
};