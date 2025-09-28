const { connection } = require('../config/database');

class Usuario {
  // Login
  static async login(username, password) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT id_usuario, nombre_usuario, rol_usuario FROM usuario WHERE nombre_usuario = ? AND contraseña = ?',
        [username, password],
        (err, results) => {
          if (err) reject(err);
          else resolve(results[0] || null);
        }
      );
    });
  }

  // Listar todos
  static async getAll() {
    return new Promise((resolve, reject) => {
      const connection = getConnection();
      connection.query(
        'SELECT id_usuario, nombre_usuario, rol_usuario FROM usuario',
        (err, results) => {
          connection.end();
          if (err) reject(err);
          else resolve(results || []);
        }
      );
    });
  }

  // Crear usuario
  static async create(username, password, role) {
    return new Promise((resolve, reject) => {
      const connection = getConnection();
      connection.query(
        'INSERT INTO usuario (nombre_usuario, contraseña, rol_usuario) VALUES (?, ?, ?)',
        [username, password, role],
        (err, result) => {
          connection.end();
          if (err) reject(err);
          else resolve(result.insertId);
        }
      );
    });
  }

  // Eliminar usuario
  static async delete(id) {
    return new Promise((resolve, reject) => {
      const connection = getConnection();
      connection.query(
        'DELETE FROM usuario WHERE id_usuario = ?',
        [id],
        (err, result) => {
          connection.end();
          if (err) reject(err);
          else resolve(result.affectedRows > 0);
        }
      );
    });
  }
}

module.exports = Usuario;