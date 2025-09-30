const mysql = require('mysql2');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let connection;
let usingSQLite = false;

try {
  connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'refugio_tilin',
    port: process.env.DB_PORT || 3306,
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('amazonaws.com') ? 'Amazon RDS' : false,
    connectTimeout: 10000
  });
  
  // Test connection
  connection.connect((err) => {
    if (err) {
      console.log('MySQL connection failed, using SQLite fallback');
      usingSQLite = true;
      const dbPath = path.join(__dirname, '..', 'refugio.db');
      connection = new sqlite3.Database(dbPath);
    } else {
      console.log('Connected to MySQL successfully');
    }
  });
} catch (err) {
  console.log('MySQL setup failed, using SQLite');
  usingSQLite = true;
  const dbPath = path.join(__dirname, '..', 'refugio.db');
  connection = new sqlite3.Database(dbPath);
}

module.exports = { connection, usingSQLite };