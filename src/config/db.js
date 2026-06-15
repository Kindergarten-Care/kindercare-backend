import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Self-healing database migration to correct column typos
(async () => {
  try {
    const [tables] = await pool.query("SHOW TABLES LIKE 'Parents'");
    if (tables.length > 0) {
      const [columns] = await pool.query("SHOW COLUMNS FROM Parents");
      const hasEmailGlitch = columns.some(col => col.Field === 'Email覆');
      const hasEmail = columns.some(col => col.Field === 'Email');
      if (hasEmailGlitch && !hasEmail) {
        logger.info("Detecting 'Email覆' column in Parents table. Auto-renaming to 'Email'...");
        await pool.query("ALTER TABLE Parents CHANGE `Email覆` `Email` VARCHAR(100)");
        logger.info("Successfully renamed 'Email覆' to 'Email'.");
      }
    }
  } catch (err) {
    logger.error("Failed to run self-healing database check: %s", err.message);
  }
})();

export default pool;