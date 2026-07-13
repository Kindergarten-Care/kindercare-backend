import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function runMigration() {
  let conn;
  try {
    console.log('Connecting to MySQL server...');
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    console.log(`Connected to database: ${process.env.DB_NAME}`);

    console.log('Altering Attendances table to add dropoffImage and pickupImage...');
    
    try {
      await conn.query(`
        ALTER TABLE \`Attendances\` 
        ADD COLUMN \`dropoffImage\` varchar(500) DEFAULT NULL COMMENT 'Ảnh chụp lúc phụ huynh đưa trẻ đến trường',
        ADD COLUMN \`pickupImage\` varchar(500) DEFAULT NULL COMMENT 'Ảnh chụp lúc phụ huynh đón trẻ về';
      `);
      console.log('Success! Columns dropoffImage and pickupImage have been added.');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('Notice: Columns already exist in the Attendances table. Skipping...');
      } else {
        throw err;
      }
    }

    // Verify
    const [columns] = await conn.query(`
      SELECT COLUMN_NAME 
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Attendances'
    `, [process.env.DB_NAME]);
    
    const hasDropoff = columns.some(c => c.COLUMN_NAME === 'dropoffImage');
    const hasPickup = columns.some(c => c.COLUMN_NAME === 'pickupImage');

    console.log('\n=== Verification ===');
    console.log(`- dropoffImage exists: ${hasDropoff ? 'YES' : 'NO'}`);
    console.log(`- pickupImage exists: ${hasPickup ? 'YES' : 'NO'}`);
    console.log('\nMigration completed successfully!');

    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

runMigration();
