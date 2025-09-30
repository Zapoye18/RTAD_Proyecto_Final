const express = require('express');
const router = express.Router();
const { connection } = require('../config/database');

// Listar voluntarios
router.get('/', (req, res) => {
  connection.query('SELECT * FROM voluntario ORDER BY fecha_registro DESC', (err, results) => {
    if (err) {
      console.error('Error al obtener voluntarios:', err);
      return res.status(500).json({ mensaje: 'Error al obtener voluntarios' });
    }
    res.json(results);
  });
});

// Agregar voluntario
router.post('/', (req, res) => {
  const { nombre, apellido, email, telefono, direccion, disponibilidad, habilidades, activo } = req.body;
  
  console.log('POST /voluntarios - Data received:', { nombre, apellido, email });
  
  const query = `
    INSERT INTO voluntario (nombre, apellido, email, telefono, direccion, disponibilidad, habilidades, activo, fecha_registro) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  
  connection.query(query, [nombre, apellido, email, telefono, direccion, disponibilidad, habilidades, activo || 1], (err, result) => {
    if (err) {
      console.error('Error al agregar voluntario:', err.code, err.message);
      if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        return res.status(500).json({ mensaje: 'Error de conexión a la base de datos. Verifica que RDS esté accesible.' });
      }
      return res.status(500).json({ mensaje: 'Error al agregar voluntario: ' + err.message });
    }
    console.log('Voluntario registrado exitosamente, ID:', result.insertId);
    res.json({ id: result.insertId, mensaje: 'Voluntario registrado exitosamente' });
  });
});

// Actualizar voluntario
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;
  
  connection.query('UPDATE voluntario SET activo = ? WHERE id_voluntario = ?', [activo, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar voluntario:', err);
      return res.status(500).json({ mensaje: 'Error al actualizar voluntario' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Voluntario no encontrado' });
    }
    
    res.json({ mensaje: 'Voluntario actualizado exitosamente' });
  });
});

// Eliminar voluntario
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  connection.query('DELETE FROM voluntario WHERE id_voluntario = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar voluntario:', err);
      return res.status(500).json({ mensaje: 'Error al eliminar voluntario' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Voluntario no encontrado' });
    }
    
    res.json({ mensaje: 'Voluntario eliminado exitosamente' });
  });
});

module.exports = router;