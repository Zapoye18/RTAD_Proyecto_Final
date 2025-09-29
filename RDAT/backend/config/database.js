const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let connection;
let usingSQLite = true;

console.log('Usando SQLite como base de datos...');
const dbPath = path.join(__dirname, '..', 'refugio.db');
connection = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a SQLite exitosamente');
  }
});

module.exports = { connection, usingSQLite };