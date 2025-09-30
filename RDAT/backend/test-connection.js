require('dotenv').config();
const mysql = require('mysql2');

console.log('Testing connection with:');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false },
  connectTimeout: 10000
});

connection.connect((err) => {
  if (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected to Aurora RDS successfully!');
    
    // Test query
    connection.query('SELECT * FROM usuario LIMIT 1', (err, results) => {
      if (err) {
        console.error('Query failed:', err.message);
      } else {
        console.log('✅ Query successful:', results);
      }
      connection.end();
      process.exit(0);
    });
  }
});