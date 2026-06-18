import pool from './src/config/db.js';

async function diagnose() {
  try {
    const [attendances] = await pool.query("SELECT * FROM Attendances ORDER BY AttendanceID DESC LIMIT 10");
    console.log("LAST 10 ATTENDANCES:");
    console.table(attendances);

    const [leaves] = await pool.query("SELECT * FROM LeaveRequests ORDER BY RequestID DESC LIMIT 10");
    console.log("LAST 10 LEAVE REQUESTS:");
    console.table(leaves);
  } catch (err) {
    console.error("Diagnostic error:", err);
  } finally {
    process.exit(0);
  }
}

diagnose();
