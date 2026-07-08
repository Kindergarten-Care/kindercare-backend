import pool from './src/config/database.js';

async function describe() {
  const [grades] = await pool.query('DESCRIBE Grades');
  const [classes] = await pool.query('DESCRIBE Classes');
  console.log('Grades:', grades);
  console.log('Classes:', classes);
  process.exit(0);
}

describe();
