import pool from '../src/config/db.js';

async function migrate() {
  try {
    console.log('Checking database columns for MonthlySchedules...');
    
    // Check if ApprovedStatus column exists
    const [columns] = await pool.query('SHOW COLUMNS FROM MonthlySchedules LIKE "ApprovedStatus"');
    
    if (columns.length === 0) {
      console.log('ApprovedStatus column is missing. Adding it...');
      await pool.query('ALTER TABLE MonthlySchedules ADD COLUMN ApprovedStatus tinyint DEFAULT 0 AFTER MonthTheme');
      console.log('ApprovedStatus column successfully added! ✅');
    } else {
      console.log('ApprovedStatus column already exists! ✅');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();
