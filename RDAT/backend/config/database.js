const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'refugio_tilin',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('amazonaws.com') ? 'Amazon RDS' : false,
  connectTimeout: 60000
});

const usingSQLite = false;

console.log('Using MySQL/AWS RDS database');

module.exports = { connection, usingSQLite };