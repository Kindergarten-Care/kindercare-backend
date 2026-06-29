import pool from '../config/db.js';

export const getStudentBasicInfo = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT s.FullName AS fullName, c.ClassName AS className
     FROM Students s
     LEFT JOIN Classes c ON s.ClassID = c.ClassID
     WHERE s.StudentID = ?`,
    [studentId]
  );
  return rows[0] || null;
};

export const getTeacherIdsByStudentId = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT ct.TeacherID AS teacherId
     FROM Students s
     JOIN ClassTeachers ct ON s.ClassID = ct.ClassID
     WHERE s.StudentID = ?`,
    [studentId]
  );
  return rows.map((r) => r.teacherId);
};
