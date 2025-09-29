const express = require('express');
const router = express.Router();
const { connection, usingSQLite } = require('../config/database');

// Listar donaciones
router.get('/', (req, res) => {
  if (usingSQLite) {
    connection.all('SELECT * FROM donaciones ORDER BY fecha_donacion DESC', (err, results) => {
      if (err) {
        console.error('Error al obtener donaciones:', err);
        return res.status(500).json({ mensaje: 'Error al obtener donaciones' });
      }
      res.json(results || []);
    });
  } else {
    connection.query('SELECT * FROM donaciones ORDER BY fecha_donacion DESC', (err, results) => {
      if (err) {
        console.error('Error al obtener donaciones:', err);
        return res.status(500).json({ mensaje: 'Error al obtener donaciones' });
      }
      res.json(results);
    });
  }
});

// Agregar donación
router.post('/', (req, res) => {
  const { nombre_donante, email_donante, telefono_donante, tipo_donacion, monto, forma_pago, descripcion } = req.body;
  
  if (usingSQLite) {
    const query = `
      INSERT INTO donaciones (nombre_donante, email_donante, telefono_donante, tipo_donacion, monto, forma_pago, descripcion, fecha_donacion) 
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `;
    
    connection.run(query, [nombre_donante, email_donante, telefono_donante, tipo_donacion, monto || 0, forma_pago, descripcion], function(err) {
      if (err) {
        console.error('Error al registrar donación:', err);
        return res.status(500).json({ mensaje: 'Error al registrar donación' });
      }
      res.json({ id: this.lastID, mensaje: 'Donación registrada exitosamente' });
    });
  } else {
    const query = `
      INSERT INTO donaciones (nombre_donante, email_donante, telefono_donante, tipo_donacion, monto, forma_pago, descripcion, fecha_donacion) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    connection.query(query, [nombre_donante, email_donante, telefono_donante, tipo_donacion, monto || 0, forma_pago, descripcion], (err, result) => {
      if (err) {
        console.error('Error al registrar donación:', err);
        return res.status(500).json({ mensaje: 'Error al registrar donación' });
      }
      res.json({ id: result.insertId, mensaje: 'Donación registrada exitosamente' });
    });
  }
});

// Eliminar donación
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  connection.query('DELETE FROM donaciones WHERE id_donacion = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar donación:', err);
      return res.status(500).json({ mensaje: 'Error al eliminar donación' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Donación no encontrada' });
    }
    
    res.json({ mensaje: 'Donación eliminada exitosamente' });
  });
});

module.exports = router;