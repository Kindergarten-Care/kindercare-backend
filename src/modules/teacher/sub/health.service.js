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
// Allergies (Stored in students.Allergies column)
// -----------------------------------------------------------------------------

export const getAllAllergiesInClass = async (classId) => {
  const [rows] = await pool.query(
    `SELECT StudentID as studentId, FullName as fullName, AvatarURL as avatarUrl, Allergies as allergies
       FROM students
      WHERE ClassID = ? 
        AND EnrollmentStatus = 'Active' 
        AND Allergies IS NOT NULL 
        AND Allergies != 'Không' 
        AND Allergies != ''
      ORDER BY FullName ASC`,
    [classId]
  );
  return rows;
};

// -----------------------------------------------------------------------------
// Medications (Stored in medicationrequests table)
// -----------------------------------------------------------------------------

export const getMedicationsInClass = async (classId, dateString) => {
  const start = startOfDayTs(dateString);
  const end = endOfDayTs(dateString);
  const [rows] = await pool.query(
    `SELECT mr.MedRequestID AS medicationId, mr.StudentID AS studentId, s.FullName AS fullName, s.AvatarURL AS avatarUrl,
            mr.MedicineDetails AS medicineName, mr.Dosage AS dosage, mr.TimeToTake AS scheduledTime,
            mr.Frequency AS frequency, mr.Status AS status, mr.TeacherNote AS notes, mr.RequestDate as requestDate,
            mr.MedicineImageURL AS medicineImageUrl, mr.ParentNote AS parentNote
       FROM medicationrequests mr
       JOIN students s ON mr.StudentID = s.StudentID
      WHERE s.ClassID = ? 
        AND mr.RequestDate BETWEEN ? AND ?
      ORDER BY mr.Status = 'Pending' DESC, mr.MedRequestID DESC`,
    [classId, start, end]
  );
  return rows;
};

export const updateMedicationStatus = async (medicationId, status, teacherId, notes) => {
  const now = unixNow();
  const [result] = await pool.query(
    `UPDATE medicationrequests
        SET Status = ?,
            TeacherNote = COALESCE(?, TeacherNote),
            UpdatedTime = ?
      WHERE MedRequestID = ?`,
    [status, notes ?? null, now, medicationId]
  );
  
  if (result.affectedRows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy dặn thuốc');
  }
  
  const [rows] = await pool.query(
    `SELECT MedRequestID AS medicationId, StudentID AS studentId, Status AS status, TeacherNote AS notes
       FROM medicationrequests
      WHERE MedRequestID = ?`,
    [medicationId]
  );
  return rows[0] || null;
};

// -----------------------------------------------------------------------------
// Health Records (Stored in healthrecords table)
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

      // Check if record exists for student and term period
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