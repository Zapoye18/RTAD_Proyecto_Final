const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false },
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000
});

const usingSQLite = false;

console.log('Connecting to Aurora RDS:', process.env.DB_HOST);

module.exports = { connection, usingSQLite };