import pool from '../../../config/db.js';
import ApiError from '../../../utils/ApiError.js';
import httpStatus from 'http-status';

const TERM_PERIOD_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
const HEIGHT_MIN_CM = 50;
const HEIGHT_MAX_CM = 200;
const WEIGHT_MIN_KG = 3;
const WEIGHT_MAX_KG = 100;
const NOTES_MAX_LEN = 1000;

const unixNow = () => Math.floor(Date.now() / 1000);

const roundTo2 = (n) => Math.round(n * 100) / 100;

const calculateBmi = (heightCm, weightKg) => {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null;
  const heightMeters = heightCm / 100;
  return roundTo2(weightKg / (heightMeters * heightMeters));
};

const validateBmiMeasurement = ({ studentId, classId, termPeriod, height, weight, notes }) => {
  if (!Number.isInteger(studentId) || studentId <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'studentId phải là số nguyên dương');
  }
  if (!Number.isInteger(classId) || classId <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'classId phải là số nguyên dương');
  }
  if (!termPeriod || !TERM_PERIOD_REGEX.test(termPeriod)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'termPeriod phải có định dạng YYYY-MM (VD: 2026-07)'
    );
  }
  if (height === undefined || height === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'height là bắt buộc');
  }
  const heightNum = Number(height);
  if (!Number.isFinite(heightNum) || heightNum < HEIGHT_MIN_CM || heightNum > HEIGHT_MAX_CM) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `height phải nằm trong khoảng ${HEIGHT_MIN_CM}-${HEIGHT_MAX_CM} (cm)`
    );
  }
  if (weight === undefined || weight === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'weight là bắt buộc');
  }
  const weightNum = Number(weight);
  if (!Number.isFinite(weightNum) || weightNum < WEIGHT_MIN_KG || weightNum > WEIGHT_MAX_KG) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `weight phải nằm trong khoảng ${WEIGHT_MIN_KG}-${WEIGHT_MAX_KG} (kg)`
    );
  }
  if (notes !== undefined && notes !== null && String(notes).length > NOTES_MAX_LEN) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `notes tối đa ${NOTES_MAX_LEN} ký tự`
    );
  }
  return {
    studentId,
    classId,
    termPeriod,
    height: roundTo2(heightNum),
    weight: roundTo2(weightNum),
    notes: notes ?? null,
  };
};

const ensureStudentInClass = async (studentId, classId) => {
  const [rows] = await pool.query(
    `SELECT StudentID, FullName, EnrollmentStatus
       FROM students
      WHERE StudentID = ?`,
    [studentId]
  );
  if (rows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy học sinh ID=${studentId}`);
  }
  const student = rows[0];
  if (student.EnrollmentStatus !== 'Active') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Học sinh không còn đang học tại trường');
  }
  const [enroll] = await pool.query(
    `SELECT StudentID FROM students WHERE StudentID = ? AND ClassID = ?`,
    [studentId, classId]
  );
  if (enroll.length === 0) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Học sinh không thuộc lớp này'
    );
  }
  return student;
};

const ensureTeacherAssignedToClass = async (teacherId, classId) => {
  const [rows] = await pool.query(
    `SELECT 1 FROM classteachers WHERE TeacherID = ? AND ClassID = ? LIMIT 1`,
    [teacherId, classId]
  );
  if (rows.length === 0) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Bạn không được phân công dạy lớp này'
    );
  }
};

const SELECT_BMI = `
  SELECT hr.RecordID  AS recordId,
         hr.StudentID AS studentId,
         s.FullName   AS studentName,
         s.AvatarURL  AS avatarUrl,
         hr.TermPeriod AS termPeriod,
         hr.Height    AS height,
         hr.Weight    AS weight,
         hr.BMI       AS bmi,
         hr.Notes     AS notes,
         hr.MeasuredAt AS measuredAt,
         hr.IsLatest  AS isLatest,
         hr.RecordedBy AS recordedBy,
         hr.CreatedAt AS createdAt,
         hr.UpdatedAt AS updatedAt
    FROM healthrecords hr
    JOIN students s ON hr.StudentID = s.StudentID
`;

const decorateRow = (row) => ({
  ...row,
  height: row.height != null ? Number(row.height) : null,
  weight: row.weight != null ? Number(row.weight) : null,
  bmi: row.bmi != null ? Number(row.bmi) : null,
  isLatest: row.isLatest === 1 || row.isLatest === true,
});

const getClassBmiLogs = async ({ classId, termPeriod, studentId, includeOverwritten = true }) => {
  if (!TERM_PERIOD_REGEX.test(termPeriod)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'termPeriod phải có định dạng YYYY-MM'
    );
  }

  const params = [termPeriod, classId];
  let where = 's.ClassID = ? AND s.EnrollmentStatus = \'Active\'';

  if (studentId) {
    where += ' AND hr.StudentID = ?';
    params.push(Number(studentId));
  }

  let fromJoin = `
       LEFT JOIN healthrecords hr
              ON s.StudentID = hr.StudentID
             AND hr.TermPeriod = ?
  `;

  if (!includeOverwritten) {
    fromJoin = `
       LEFT JOIN healthrecords hr
              ON s.StudentID = hr.StudentID
             AND hr.TermPeriod = ?
             AND hr.IsLatest = 1
    `;
  }

  const [rows] = await pool.query(
    `SELECT s.StudentID AS studentId,
            s.FullName  AS studentName,
            s.AvatarURL AS avatarUrl,
            hr.RecordID  AS recordId,
            hr.TermPeriod AS termPeriod,
            hr.Height    AS height,
            hr.Weight    AS weight,
            hr.BMI       AS bmi,
            hr.Notes     AS notes,
            hr.MeasuredAt AS measuredAt,
            hr.IsLatest  AS isLatest,
            hr.RecordedBy AS recordedBy,
            hr.CreatedAt AS createdAt,
            hr.UpdatedAt AS updatedAt
       FROM students s
       ${fromJoin}
      WHERE ${where}
      ORDER BY s.FullName ASC, hr.RecordID DESC`,
    params
  );

  const grouped = new Map();
  for (const row of rows) {
    const sid = row.studentId;
    if (!grouped.has(sid)) {
      grouped.set(sid, {
        studentId: sid,
        studentName: row.studentName,
        avatarUrl: row.avatarUrl,
        latest: null,
        history: [],
      });
    }
    if (row.recordId !== null) {
      const decorated = decorateRow(row);
      if (decorated.isLatest) {
        grouped.get(sid).latest = decorated;
      }
      grouped.get(sid).history.push(decorated);
    }
  }

  return Array.from(grouped.values()).map((entry) => ({
    studentId: entry.studentId,
    studentName: entry.studentName,
    avatarUrl: entry.avatarUrl,
    recordId: entry.latest ? entry.latest.recordId : null,
    termPeriod,
    height: entry.latest ? entry.latest.height : null,
    weight: entry.latest ? entry.latest.weight : null,
    bmi: entry.latest ? entry.latest.bmi : null,
    notes: entry.latest ? entry.latest.notes : null,
    measuredAt: entry.latest ? entry.latest.measuredAt : null,
    history: includeOverwritten ? entry.history : [],
  }));
};

const upsertSingleBmi = async (conn, { studentId, classId, termPeriod, height, weight, notes, teacherId, measuredAt }) => {
  const bmi = calculateBmi(height, weight);

  const [existing] = await conn.query(
    `SELECT RecordID FROM healthrecords
      WHERE StudentID = ? AND TermPeriod = ? AND IsLatest = 1
      LIMIT 1`,
    [studentId, termPeriod]
  );

  if (existing.length > 0) {
    const oldId = existing[0].RecordID;
    await conn.query(
      `UPDATE healthrecords SET IsLatest = 0 WHERE RecordID = ?`,
      [oldId]
    );
  }

  const now = unixNow();
  const [insertResult] = await conn.query(
    `INSERT INTO healthrecords
       (StudentID, TermPeriod, Height, Weight, BMI, Notes,
        MeasuredAt, IsLatest, RecordedBy, CreatedAt, UpdatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
    [
      studentId,
      termPeriod,
      height,
      weight,
      bmi,
      notes,
      measuredAt ?? now,
      teacherId,
      now,
      now,
    ]
  );
  return insertResult.insertId;
};

export const createBmiLog = async ({ classId, teacherId, payload }) => {
  const data = validateBmiMeasurement({ ...payload, classId });
  await ensureTeacherAssignedToClass(teacherId, classId);
  await ensureStudentInClass(data.studentId, classId);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const newId = await upsertSingleBmi(connection, {
      studentId: data.studentId,
      classId,
      termPeriod: data.termPeriod,
      height: data.height,
      weight: data.weight,
      notes: data.notes,
      teacherId,
      measuredAt: payload.measuredAt,
    });
    await connection.commit();
    return getBmiLogById(newId);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const batchUpsertBmiLogs = async ({ classId, teacherId, termPeriod, records }) => {
  if (!TERM_PERIOD_REGEX.test(termPeriod)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'termPeriod phải có định dạng YYYY-MM');
  }
  if (!Array.isArray(records) || records.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'records phải là mảng không rỗng');
  }
  await ensureTeacherAssignedToClass(teacherId, classId);

  const connection = await pool.getConnection();
  const insertedIds = [];
  try {
    await connection.beginTransaction();

    const studentIds = [...new Set(records.map((r) => parseInt(r.studentId, 10)).filter(Number.isInteger))];
    if (studentIds.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Không có studentId hợp lệ trong records');
    }

    const placeholders = studentIds.map(() => '?').join(',');
    const [validStudents] = await connection.query(
      `SELECT StudentID FROM students
        WHERE ClassID = ? AND EnrollmentStatus = 'Active'
          AND StudentID IN (${placeholders})`,
      [classId, ...studentIds]
    );
    const validIds = new Set(validStudents.map((s) => s.StudentID));
    const invalidIds = studentIds.filter((id) => !validIds.has(id));
    if (invalidIds.length > 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Các học sinh sau không thuộc lớp ${classId} hoặc không Active: ${invalidIds.join(', ')}`
      );
    }

    for (const r of records) {
      const data = validateBmiMeasurement({
        studentId: r.studentId,
        classId,
        termPeriod,
        height: r.height,
        weight: r.weight,
        notes: r.notes,
      });

      const newId = await upsertSingleBmi(connection, {
        studentId: data.studentId,
        classId,
        termPeriod,
        height: data.height,
        weight: data.weight,
        notes: data.notes,
        teacherId,
        measuredAt: r.measuredAt,
      });
      insertedIds.push(newId);
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  return getClassBmiLogs({ classId, termPeriod, includeOverwritten: true });
};

export const updateBmiLog = async ({ classId, teacherId, logId, payload }) => {
  if (!Number.isInteger(logId) || logId <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'logId không hợp lệ');
  }
  await ensureTeacherAssignedToClass(teacherId, classId);

  const [rows] = await pool.query(
    `SELECT hr.RecordID, hr.StudentID, s.ClassID
       FROM healthrecords hr
       JOIN students s ON hr.StudentID = s.StudentID
      WHERE hr.RecordID = ?`,
    [logId]
  );
  if (rows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hồ sơ BMI');
  }
  if (rows[0].ClassID !== classId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bản ghi không thuộc lớp này');
  }

  const updates = {};
  if (payload.height !== undefined) {
    const h = Number(payload.height);
    if (!Number.isFinite(h) || h < HEIGHT_MIN_CM || h > HEIGHT_MAX_CM) {
      throw new ApiError(httpStatus.BAD_REQUEST, `height phải trong khoảng ${HEIGHT_MIN_CM}-${HEIGHT_MAX_CM} cm`);
    }
    updates.height = roundTo2(h);
  }
  if (payload.weight !== undefined) {
    const w = Number(payload.weight);
    if (!Number.isFinite(w) || w < WEIGHT_MIN_KG || w > WEIGHT_MAX_KG) {
      throw new ApiError(httpStatus.BAD_REQUEST, `weight phải trong khoảng ${WEIGHT_MIN_KG}-${WEIGHT_MAX_KG} kg`);
    }
    updates.weight = roundTo2(w);
  }
  if (payload.notes !== undefined) {
    if (payload.notes !== null && String(payload.notes).length > NOTES_MAX_LEN) {
      throw new ApiError(httpStatus.BAD_REQUEST, `notes tối đa ${NOTES_MAX_LEN} ký tự`);
    }
    updates.notes = payload.notes;
  }
  if (Object.keys(updates).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Không có trường nào để cập nhật');
  }

  const [cur] = await pool.query(
    `SELECT Height, Weight FROM healthrecords WHERE RecordID = ?`,
    [logId]
  );
  const mergedHeight = updates.height !== undefined ? updates.height : Number(cur[0].Height);
  const mergedWeight = updates.weight !== undefined ? updates.weight : Number(cur[0].Weight);
  const newBmi = calculateBmi(mergedHeight, mergedWeight);

  const fields = [];
  const values = [];
  if (updates.height !== undefined) {
    fields.push('Height = ?');
    values.push(updates.height);
  }
  if (updates.weight !== undefined) {
    fields.push('Weight = ?');
    values.push(updates.weight);
  }
  if (updates.notes !== undefined) {
    fields.push('Notes = ?');
    values.push(updates.notes);
  }
  fields.push('BMI = ?');
  values.push(newBmi);
  fields.push('UpdatedAt = ?');
  values.push(unixNow());
  fields.push('UpdatedBy = ?');
  values.push(teacherId);
  values.push(logId);

  await pool.query(
    `UPDATE healthrecords SET ${fields.join(', ')} WHERE RecordID = ?`,
    values
  );

  return getBmiLogById(logId);
};

export const deleteBmiLog = async ({ classId, teacherId, logId }) => {
  await ensureTeacherAssignedToClass(teacherId, classId);
  const [rows] = await pool.query(
    `SELECT hr.RecordID, s.ClassID
       FROM healthrecords hr
       JOIN students s ON hr.StudentID = s.StudentID
      WHERE hr.RecordID = ?`,
    [logId]
  );
  if (rows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hồ sơ BMI');
  }
  if (rows[0].ClassID !== classId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bản ghi không thuộc lớp này');
  }

  const [result] = await pool.query(
    `DELETE FROM healthrecords WHERE RecordID = ?`,
    [logId]
  );
  if (result.affectedRows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hồ sơ BMI');
  }
  return true;
};

export const getBmiLogById = async (recordId) => {
  const [rows] = await pool.query(
    `${SELECT_BMI}
      WHERE hr.RecordID = ?`,
    [recordId]
  );
  return rows[0] ? decorateRow(rows[0]) : null;
};

export const getBmiHistoryByStudent = async ({ classId, termPeriod, studentId, teacherId }) => {
  await ensureTeacherAssignedToClass(teacherId, classId);
  if (!Number.isInteger(studentId) || studentId <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'studentId không hợp lệ');
  }
  await ensureStudentInClass(studentId, classId);

  const [rows] = await pool.query(
    `${SELECT_BMI}
      WHERE hr.StudentID = ?
        AND (? IS NULL OR hr.TermPeriod = ?)
      ORDER BY hr.TermPeriod DESC, hr.RecordID DESC`,
    [studentId, termPeriod ?? null, termPeriod ?? null]
  );
  return rows.map(decorateRow);
};