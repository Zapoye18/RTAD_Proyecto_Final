const express = require('express');
const router = express.Router();
const { connection } = require('../config/database');

// Listar donaciones
router.get('/', (req, res) => {
  console.log('GET /donaciones - Intentando obtener donaciones...');
  
  connection.query('SELECT id_donacion, tipo_donacion, descripcion, monto, fecha_donado FROM donacion ORDER BY fecha_donado DESC', (err, results) => {
    if (err) {
      console.error('=== ERROR AL OBTENER DONACIONES ===');
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      console.error('SQL State:', err.sqlState);
      console.error('Error number:', err.errno);
      return res.status(500).json({ 
        mensaje: 'Error al obtener donaciones', 
        error: err.message,
        code: err.code 
      });
    }
    
    console.log('Donaciones obtenidas exitosamente:', results?.length || 0, 'registros');
    res.json(results || []);
  });
});

// Agregar donación
router.post('/', (req, res) => {
  const { tipo_donacion, monto, descripcion } = req.body;
  
  console.log('POST /donaciones - Data received:', { tipo_donacion, monto });
  
  const query = `
    INSERT INTO donacion (id_donante, tipo_donacion, descripcion, monto, fecha_donado) 
    VALUES (1, ?, ?, ?, NOW())
  `;
  
  connection.query(query, [tipo_donacion, descripcion, monto || 0], (err, result) => {
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