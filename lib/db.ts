// lib/db.ts
import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST, // เช่น "localhost"
  user: process.env.DB_USER, // เช่น "root"
  password: process.env.DB_PASSWORD, // รหัสผ่านของฐานข้อมูล
  database: process.env.DB_NAME, // ชื่อ database
  port: Number(process.env.DB_PORT), // พอร์ตของฐานข้อมูล (ค่าเริ่มต้นคือ 3306)
});
