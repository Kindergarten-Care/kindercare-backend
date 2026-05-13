import pool from '../../config/db.js';
import logger from '../../config/logger.js';

export const getInvoiceByStudentId = async (studentId) => {
  const query = `
    SELECT 
      i.*, 
      s.FullName as StudentName 
    FROM Invoices i
    JOIN Students s ON i.StudentID = s.StudentID
    WHERE i.StudentID = ?
    ORDER BY i.CreatedAt DESC
  `;
  const [rows] = await pool.query(query, [studentId]);
  logger.info(`Fetched ${rows.length} invoices for student ID: ${studentId}`);
  return rows;
};
