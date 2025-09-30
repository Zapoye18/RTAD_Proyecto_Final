const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'refugio.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Crear tabla usuario
  db.run(`CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_usuario TEXT NOT NULL,
    contraseña TEXT NOT NULL,
    rol_usuario TEXT DEFAULT 'Empleado'
  )`);

  // Insertar usuario admin
  db.run(`INSERT OR REPLACE INTO usuario (id_usuario, nombre_usuario, contraseña, rol_usuario) 
          VALUES (1, 'admin', '112233', 'Admin')`);

  // Crear tabla inventario
  db.run(`CREATE TABLE IF NOT EXISTS inventario (
    id_item INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo_inventario TEXT,
    cantidad_disponible INTEGER DEFAULT 0,
    cantidad_solicitada INTEGER DEFAULT 0,
    fecha_ingreso TEXT,
    fecha_vencimiento TEXT,
    disponible INTEGER DEFAULT 1
  )`);

  // Crear tabla donaciones
  db.run(`CREATE TABLE IF NOT EXISTS donaciones (
    id_donacion INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_donante TEXT NOT NULL,
    email_donante TEXT,
    telefono_donante TEXT,
    tipo_donacion TEXT,
    monto REAL DEFAULT 0,
    forma_pago TEXT,
    descripcion TEXT,
    fecha_donacion TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // Crear tabla voluntarios
  db.run(`CREATE TABLE IF NOT EXISTS voluntarios (
    id_voluntario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT,
    telefono TEXT,
    direccion TEXT,
    disponibilidad TEXT,
    habilidades TEXT,
    activo INTEGER DEFAULT 1,
    fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log('Database initialized successfully');
});

db.close();