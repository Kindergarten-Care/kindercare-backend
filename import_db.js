import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const sqlPath = 'd:/DATN/Frontend/kindercare-frontend/kindercare_db_test (15).sql';
const sql = fs.readFileSync(sqlPath, 'utf8');

async function run() {
    let conn;
    try {
        console.log("Connecting to MySQL server...");
        // connect without DB first to create it
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });
        
        console.log("Creating database if not exists: kindercare_db");
        await conn.query("CREATE DATABASE IF NOT EXISTS kindercare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci");
        await conn.query("USE kindercare_db");
        
        console.log("Importing SQL dump (might take a moment)...");
        await conn.query(sql);
        
        console.log("SQL import finished successfully!");
        process.exit(0);
    } catch(e) {
        console.error("Error:", e.message);
        process.exit(1);
    } finally {
        if (conn) await conn.end();
    }
}
run();
