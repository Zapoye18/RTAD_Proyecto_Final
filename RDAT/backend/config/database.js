const mysql = require('mysql2');

console.log('=== RDS CONNECTION DEBUG ===');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  ssl: false,
  connectTimeout: 30000,
  acquireTimeout: 30000,
  timeout: 30000,
  multipleStatements: true
});

connection.on('connect', () => {
  console.log('✅ RDS Connected successfully');
});

connection.on('error', (err) => {
  console.error('❌ RDS Error:', err.code);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Reconnecting...');
  }
});

const usingSQLite = false;

module.exports = { connection, usingSQLite };