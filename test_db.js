import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function run() {
    try {
        console.log("Connecting to:", process.env.DB_HOST, process.env.DB_PORT, process.env.DB_NAME);
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 3306,
            database: process.env.DB_NAME
        });
        console.log("Connected successfully!");
        const [rows] = await conn.query("SHOW TABLES");
        console.log("Tables:", rows.map(r => Object.values(r)[0]));
        await conn.end();
    } catch(e) {
        console.error("Connection Error Object:", e);
    }
}
run();
