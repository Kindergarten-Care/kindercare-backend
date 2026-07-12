import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const migrations = [
  'migrations/2026_07_09_create_student_health_tables.sql',
  'migrations/2026_07_09_seed_student_health_data.sql'
];

async function runMigrations() {
  let conn;
  try {
    console.log('Connecting to MySQL server...');
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log(`Connected to database: ${process.env.DB_NAME}`);

    for (const migrationFile of migrations) {
      console.log(`\nRunning migration: ${migrationFile}`);
      const sql = fs.readFileSync(migrationFile, 'utf8');
      await conn.query(sql);
      console.log(`Migration ${migrationFile} completed successfully!`);
    }

    console.log('\n=== Verification ===');
    
    // Verify tables exist
    const [tables] = await conn.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME IN ('Allergies', 'DevelopmentAssessments')
    `, [process.env.DB_NAME]);
    
    console.log('\nTables created:');
    tables.forEach(t => console.log(`  - ${t.TABLE_NAME}`));

    // Verify data
    const [allergyCount] = await conn.query('SELECT COUNT(*) as cnt FROM Allergies WHERE IsActive=1');
    const [medCount] = await conn.query('SELECT COUNT(*) as cnt FROM MedicationRequests');
    const [devCount] = await conn.query('SELECT COUNT(*) as cnt FROM DevelopmentAssessments WHERE TermPeriod=?', ['2026-07']);

    console.log('\nData inserted:');
    console.log(`  - Allergies: ${allergyCount[0].cnt}`);
    console.log(`  - MedicationRequests: ${medCount[0].cnt}`);
    console.log(`  - DevelopmentAssessments: ${devCount[0].cnt}`);

    // Verify HealthRecords Notes column
    const [columns] = await conn.query(`
      SELECT COLUMN_NAME 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'HealthRecords'
    `, [process.env.DB_NAME]);
    
    console.log('\nHealthRecords columns:');
    columns.forEach(c => console.log(`  - ${c.COLUMN_NAME}`));
    const hasNotes = columns.some(c => c.COLUMN_NAME === 'Notes');
    console.log(`  Notes column exists: ${hasNotes ? 'YES' : 'NO'}`);

    console.log('\n=== All migrations completed successfully! ===');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    console.error('Stack:', e.stack);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

runMigrations();
