const express = require('express');
const router = express.Router();
const { connection } = require('../config/database');

// Listar donaciones
router.get('/', (req, res) => {
  connection.query('SELECT tipo_de_donacion as tipo_donacion, monto, descripcion_de_la_donacion as descripcion, fecha_donado, id_donacion FROM donacion ORDER BY fecha_donado DESC', (err, results) => {
    if (err) {
      console.error('Error al obtener donaciones:', err.code, err.message);
      return res.status(500).json({ mensaje: 'Error al obtener donaciones: ' + err.message });
    }
    res.json(results || []);
  });
});

// Agregar donación
router.post('/', (req, res) => {
  const { tipo_donacion, monto, descripcion } = req.body;
  
  console.log('POST /donaciones - Data received:', { tipo_donacion, monto });
  
  const query = `
    INSERT INTO donacion (tipo_de_donacion, monto, descripcion_de_la_donacion, fecha_donado) 
    VALUES (?, ?, ?, NOW())
  `;
  
  connection.query(query, [tipo_donacion, monto || 0, descripcion], (err, result) => {
    if (err) {
      console.error('Error al registrar donación:', err.code, err.message);
      if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        return res.status(500).json({ mensaje: 'Error de conexión a la base de datos. Verifica que RDS esté accesible.' });
      }
      return res.status(500).json({ mensaje: 'Error al registrar donación: ' + err.message });
    }
    console.log('Donación registrada exitosamente, ID:', result.insertId);
    res.json({ id: result.insertId, mensaje: 'Donación registrada exitosamente' });
  });
});

// Eliminar donación
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  connection.query('DELETE FROM donacion WHERE id_donacion = ?', [id], (err, result) => {
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