import pool from '../../config/db.js';

export const getAllStudents = async () => {
  const query = 'SELECT * FROM Students ORDER BY FullName ASC';
  const [rows] = await pool.query(query);
  return rows;
};
