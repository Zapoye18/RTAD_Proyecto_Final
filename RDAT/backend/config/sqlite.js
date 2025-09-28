const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../refugio.db');

function getDB() {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error conectando a SQLite:', err);
    } else {
      console.log('Conectado a SQLite ✅');
    }
  });
}

// Crear tabla si no existe
function initDB() {
  const db = getDB();
  db.run(`
    CREATE TABLE IF NOT EXISTS usuario (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_usuario TEXT UNIQUE NOT NULL,
      contraseña TEXT NOT NULL,
      rol_usuario TEXT DEFAULT 'Empleado'
    )
  `);
  
  // Insertar usuarios por defecto
  db.run(`
    INSERT OR IGNORE INTO usuario (nombre_usuario, contraseña, rol_usuario) 
    VALUES ('admin', '112233', 'Admin'), ('pepe12', '12345', 'Empleado')
  `);
  
  db.close();
}

module.exports = { getDB, initDB };