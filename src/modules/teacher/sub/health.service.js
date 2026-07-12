import pool from '../../../config/db.js';
import ApiError from '../../../utils/ApiError.js';
import httpStatus from 'http-status';

const unixNow = () => Math.floor(Date.now() / 1000);

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

// -----------------------------------------------------------------------------
// Allergies  (bảng chuẩn hoá `Allergies`)
// -----------------------------------------------------------------------------

export const getAllAllergiesInClass = async (classId) => {
  const [rows] = await pool.query(
    `SELECT a.AllergyID AS allergyId,
            a.StudentID AS studentId,
            s.FullName AS fullName,
            s.AvatarURL AS avatarUrl,
            a.Allergen AS allergen,
            a.Severity AS severity,
            a.Reaction AS reaction,
            a.Notes AS notes,
            a.IsActive AS isActive,
            a.CreatedAt AS createdAt,
            a.UpdatedAt AS updatedAt
       FROM allergies a
       JOIN students s ON a.StudentID = s.StudentID
      WHERE s.ClassID = ?
        AND s.EnrollmentStatus = 'Active'
        AND a.IsActive = 1
      ORDER BY s.FullName ASC, a.Severity DESC`,
    [classId]
  );
  return rows;
};

export const createAllergy = async (studentId, payload) => {
  const allergen = String(payload.allergen || '').trim();
  const severity = payload.severity || 'Mild';
  const reaction = payload.reaction ?? null;
  const notes = payload.notes ?? null;
  const now = unixNow();

  const [result] = await pool.query(
    `INSERT INTO allergies (StudentID, Allergen, Severity, Reaction, Notes, IsActive, CreatedAt, UpdatedAt)
     VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
    [studentId, allergen, severity, reaction, notes, now, now]
  );

  return getAllergyById(result.insertId);
};

export const updateAllergy = async (allergyId, payload) => {
  const fields = [];
  const values = [];

  if (payload.allergen !== undefined) {
    fields.push('Allergen = ?');
    values.push(String(payload.allergen).trim());
  }
  if (payload.severity !== undefined) {
    fields.push('Severity = ?');
    values.push(payload.severity);
  }
  if (payload.reaction !== undefined) {
    fields.push('Reaction = ?');
    values.push(payload.reaction);
  }
  if (payload.notes !== undefined) {
    fields.push('Notes = ?');
    values.push(payload.notes);
  }

  if (fields.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Không có trường nào để cập nhật');
  }

  fields.push('UpdatedAt = ?');
  values.push(unixNow());
  values.push(allergyId);

  const [result] = await pool.query(
    `UPDATE allergies SET ${fields.join(', ')} WHERE AllergyID = ?`,
    values
  );
  if (result.affectedRows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy dị ứng');
  }
  return getAllergyById(allergyId);
};

export const deleteAllergy = async (allergyId) => {
  // Soft delete (IsActive = 0) để giữ lịch sử
  const [result] = await pool.query(
    `UPDATE allergies SET IsActive = 0, UpdatedAt = ? WHERE AllergyID = ?`,
    [unixNow(), allergyId]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy dị ứng');
  }
  return true;
};

const getAllergyById = async (allergyId) => {
  const [rows] = await pool.query(
    `SELECT AllergyID AS allergyId, StudentID AS studentId, Allergen AS allergen,
            Severity AS severity, Reaction AS reaction, Notes AS notes,
            IsActive AS isActive, CreatedAt AS createdAt, UpdatedAt AS updatedAt
       FROM allergies
      WHERE AllergyID = ?`,
    [allergyId]
  );
  return rows[0] || null;
};

// -----------------------------------------------------------------------------
// Medications  (bảng `MedicationRequests`)
// -----------------------------------------------------------------------------

export const getMedicationsInClass = async (classId, dateString) => {
  const start = startOfDayTs(dateString);
  const end = endOfDayTs(dateString);
  const [rows] = await pool.query(
    `SELECT mr.MedRequestID AS medicationId, mr.StudentID AS studentId,
            s.FullName AS fullName, s.AvatarURL AS avatarUrl,
            mr.MedicineDetails AS medicineName, mr.Dosage AS dosage,
            mr.TimeToTake AS scheduledTime, mr.Frequency AS frequency,
            mr.Status AS status, mr.TeacherNote AS notes,
            mr.RequestDate AS requestDate, mr.ScheduledDate AS scheduledDate,
            mr.MedicineImageURL AS medicineImageUrl, mr.ParentNote AS parentNote,
            mr.AdministeredAt AS administeredAt, mr.AdministeredBy AS administeredBy
       FROM medicationrequests mr
       JOIN students s ON mr.StudentID = s.StudentID
      WHERE s.ClassID = ?
        AND ((mr.ScheduledDate IS NOT NULL AND mr.ScheduledDate BETWEEN ? AND ?)
             OR (mr.ScheduledDate IS NULL AND mr.RequestDate BETWEEN ? AND ?))
      ORDER BY (mr.Status = 'Pending') DESC, mr.MedRequestID DESC`,
    [classId, start, end, start, end]
  );
  return rows;
};

export const updateMedicationStatus = async (medicationId, status, teacherId, notes) => {
  const now = unixNow();
  const administeredAt = status === 'Done' ? now : null;
  const [result] = await pool.query(
    `UPDATE medicationrequests
        SET Status = ?,
            TeacherNote = COALESCE(?, TeacherNote),
            AdministeredAt = COALESCE(?, AdministeredAt),
            AdministeredBy = COALESCE(?, AdministeredBy),
            UpdatedTime = ?
      WHERE MedRequestID = ?`,
    [status, notes ?? null, administeredAt, status === 'Done' ? teacherId : null, now, medicationId]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy dặn thuốc');
  }
  return getMedicationById(medicationId);
};

export const createMedication = async (studentId, payload) => {
  const now = unixNow();
  const [result] = await pool.query(
    `INSERT INTO medicationrequests
       (StudentID, RequestDate, ScheduledDate, MedicineDetails, Dosage,
        Frequency, TimeToTake, Status, TeacherNote, UpdatedTime)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      now,
      payload.scheduledDate ?? startOfDayTs(),
      payload.medicineName,
      payload.dosage,
      payload.frequency ?? null,
      payload.scheduledTime ?? null,
      payload.status ?? 'Pending',
      payload.notes ?? null,
      now
    ]
  );
  return getMedicationById(result.insertId);
};

export const deleteMedication = async (medicationId) => {
  const [result] = await pool.query(
    `DELETE FROM medicationrequests WHERE MedRequestID = ?`,
    [medicationId]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy dặn thuốc');
  }
  return true;
};

const getMedicationById = async (medicationId) => {
  const [rows] = await pool.query(
    `SELECT MedRequestID AS medicationId, StudentID AS studentId,
            MedicineDetails AS medicineName, Dosage AS dosage,
            TimeToTake AS scheduledTime, Frequency AS frequency,
            Status AS status, TeacherNote AS notes,
            RequestDate AS requestDate, ScheduledDate AS scheduledDate,
            AdministeredAt AS administeredAt, AdministeredBy AS administeredBy
       FROM medicationrequests
      WHERE MedRequestID = ?`,
    [medicationId]
  );
  return rows[0] || null;
};

// -----------------------------------------------------------------------------
// Health Records (bảng `healthrecords`)
// -----------------------------------------------------------------------------

export const getClassHealthRecords = async (classId, termPeriod) => {
  const [rows] = await pool.query(
    `SELECT s.StudentID AS studentId, s.FullName AS name, s.AvatarURL AS avatarUrl,
            hr.RecordID AS recordId, hr.TermPeriod AS termPeriod,
            hr.Height AS height, hr.Weight AS weight, hr.BMI AS bmi, hr.Notes AS note
       FROM students s
       LEFT JOIN healthrecords hr ON s.StudentID = hr.StudentID AND hr.TermPeriod = ?
      WHERE s.ClassID = ?
        AND s.EnrollmentStatus = 'Active'
      ORDER BY s.FullName ASC`,
    [termPeriod, classId]
  );
  return rows;
};

export const batchUpdateHealthRecords = async (classId, termPeriod, records) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const r of records) {
      const studentId = parseInt(r.studentId, 10);
      const height = r.height ? parseFloat(r.height) : null;
      const weight = r.weight ? parseFloat(r.weight) : null;
      const note = r.note ?? null;

      let bmi = null;
      if (height && weight && height > 0) {
        const heightInMeters = height / 100;
        bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
      }

      const [existing] = await connection.query(
        'SELECT RecordID FROM healthrecords WHERE StudentID = ? AND TermPeriod = ?',
        [studentId, termPeriod]
      );

      if (existing.length > 0) {
        await connection.query(
          `UPDATE healthrecords
              SET Height = ?, Weight = ?, BMI = ?, Notes = ?
            WHERE RecordID = ?`,
          [height, weight, bmi, note, existing[0].RecordID]
        );
      } else {
        await connection.query(
          `INSERT INTO healthrecords (StudentID, TermPeriod, Height, Weight, BMI, Notes)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [studentId, termPeriod, height, weight, bmi, note]
        );
      }
    }
    await connection.commit();
    return true;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const createHealthLog = async (studentId, payload) => {
  // payload: { height, weight, note, termPeriod }
  const termPeriod = payload.termPeriod || new Date().toISOString().slice(0, 7);
  const height = payload.height != null ? parseFloat(payload.height) : null;
  const weight = payload.weight != null ? parseFloat(payload.weight) : null;
  const note = payload.note ?? null;

  let bmi = null;
  if (height && weight && height > 0) {
    const heightInMeters = height / 100;
    bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  }

  const [result] = await pool.query(
    `INSERT INTO healthrecords (StudentID, TermPeriod, Height, Weight, BMI, Notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [studentId, termPeriod, height, weight, bmi, note]
  );
  return getHealthLogById(result.insertId);
};

export const updateHealthLog = async (logId, payload) => {
  const fields = [];
  const values = [];

  if (payload.height !== undefined) {
    const height = payload.height != null ? parseFloat(payload.height) : null;
    fields.push('Height = ?');
    values.push(height);
  }
  if (payload.weight !== undefined) {
    const weight = payload.weight != null ? parseFloat(payload.weight) : null;
    fields.push('Weight = ?');
    values.push(weight);
  }
  if (payload.note !== undefined) {
    fields.push('Notes = ?');
    values.push(payload.note);
  }

  if (fields.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Không có trường nào để cập nhật');
  }

  // Tính lại BMI nếu height/weight thay đổi
  const [cur] = await pool.query(
    `SELECT Height, Weight FROM healthrecords WHERE RecordID = ?`,
    [logId]
  );
  if (cur.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hồ sơ sức khỏe');
  }
  const merged = { ...cur[0], ...payload };
  const height = merged.Height != null ? parseFloat(merged.Height) : null;
  const weight = merged.Weight != null ? parseFloat(merged.Weight) : null;
  let bmi = null;
  if (height && weight && height > 0) {
    const heightInMeters = height / 100;
    bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  }
  fields.push('BMI = ?');
  values.push(bmi);
  values.push(logId);

  const [result] = await pool.query(
    `UPDATE healthrecords SET ${fields.join(', ')} WHERE RecordID = ?`,
    values
  );
  if (result.affectedRows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hồ sơ sức khỏe');
  }
  return getHealthLogById(logId);
};

export const deleteHealthLog = async (logId) => {
  const [result] = await pool.query(
    `DELETE FROM healthrecords WHERE RecordID = ?`,
    [logId]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hồ sơ sức khỏe');
  }
  return true;
};

const getHealthLogById = async (logId) => {
  const [rows] = await pool.query(
    `SELECT RecordID AS recordId, StudentID AS studentId, TermPeriod AS termPeriod,
            Height AS height, Weight AS weight, BMI AS bmi, Notes AS note
       FROM healthrecords
      WHERE RecordID = ?`,
    [logId]
  );
  return rows[0] || null;
};

// -----------------------------------------------------------------------------
// Development Assessments  (bảng `DevelopmentAssessments`)
// -----------------------------------------------------------------------------

export const getDevelopmentAssessments = async (classId, termPeriod) => {
  const [rows] = await pool.query(
    `SELECT s.StudentID AS studentId, s.FullName AS name, s.AvatarURL AS avatarUrl,
            da.AssessmentID AS assessmentId, da.TermPeriod AS termPeriod,
            da.PhysicalScore AS physicalScore,
            da.EmotionalScore AS emotionalScore,
            da.SocialScore AS socialScore,
            da.LanguageScore AS languageScore,
            da.CognitiveScore AS cognitiveScore,
            da.OverallNote AS overallNote,
            da.AssessedBy AS assessedBy
       FROM students s
       LEFT JOIN developmentassessments da
              ON s.StudentID = da.StudentID AND da.TermPeriod = ?
      WHERE s.ClassID = ?
        AND s.EnrollmentStatus = 'Active'
      ORDER BY s.FullName ASC`,
    [termPeriod, classId]
  );
  return rows;
};

export const upsertDevelopmentAssessments = async (teacherId, termPeriod, items) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of items) {
      const studentId = parseInt(item.studentId, 10);
      if (isNaN(studentId)) continue;

      const physical = clampScore(item.physicalScore);
      const emotional = clampScore(item.emotionalScore);
      const social = clampScore(item.socialScore);
      const language = clampScore(item.languageScore);
      const cognitive = clampScore(item.cognitiveScore);
      const note = item.overallNote ?? null;
      const now = unixNow();

      await connection.query(
        `INSERT INTO developmentassessments
           (StudentID, TermPeriod, PhysicalScore, EmotionalScore, SocialScore,
            LanguageScore, CognitiveScore, OverallNote, AssessedBy, CreatedAt, UpdatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            PhysicalScore  = VALUES(PhysicalScore),
            EmotionalScore = VALUES(EmotionalScore),
            SocialScore    = VALUES(SocialScore),
            LanguageScore  = VALUES(LanguageScore),
            CognitiveScore = VALUES(CognitiveScore),
            OverallNote    = VALUES(OverallNote),
            AssessedBy     = VALUES(AssessedBy),
            UpdatedAt      = VALUES(UpdatedAt)`,
        [studentId, termPeriod, physical, emotional, social, language, cognitive, note, teacherId, now, now]
      );
    }
    await connection.commit();
    return true;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const clampScore = (v) => {
  if (v === undefined || v === null || v === '') return null;
  const n = parseInt(v, 10);
  if (isNaN(n)) return null;
  if (n < 0) return 0;
  if (n > 5) return 5;
  return n;
};

// -----------------------------------------------------------------------------
// Cross-cutting helpers
// -----------------------------------------------------------------------------

export const assertStudentBelongsToClass = async (studentId, classId) => {
  const [rows] = await pool.query(
    `SELECT StudentID FROM students WHERE StudentID = ? AND ClassID = ?`,
    [studentId, classId]
  );
  if (rows.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Không tìm thấy học sinh trong lớp này'
    );
  }
};
