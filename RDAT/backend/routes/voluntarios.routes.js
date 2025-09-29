const express = require('express');
const router = express.Router();
const { connection, usingSQLite } = require('../config/database');

// Listar voluntarios
router.get('/', (req, res) => {
  if (usingSQLite) {
    connection.all('SELECT * FROM voluntarios ORDER BY fecha_registro DESC', (err, results) => {
      if (err) {
        console.error('Error al obtener voluntarios:', err);
        return res.status(500).json({ mensaje: 'Error al obtener voluntarios' });
      }
      res.json(results || []);
    });
  } else {
    connection.query('SELECT * FROM voluntarios ORDER BY fecha_registro DESC', (err, results) => {
      if (err) {
        console.error('Error al obtener voluntarios:', err);
        return res.status(500).json({ mensaje: 'Error al obtener voluntarios' });
      }
      res.json(results);
    });
  }
});

// Agregar voluntario
router.post('/', (req, res) => {
  const { nombre, apellido, email, telefono, direccion, disponibilidad, habilidades, activo } = req.body;
  
  if (usingSQLite) {
    const query = `
      INSERT INTO voluntarios (nombre, apellido, email, telefono, direccion, disponibilidad, habilidades, activo, fecha_registro) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `;
    
    connection.run(query, [nombre, apellido, email, telefono, direccion, disponibilidad, habilidades, activo || 1], function(err) {
      if (err) {
        console.error('Error al agregar voluntario:', err);
        return res.status(500).json({ mensaje: 'Error al agregar voluntario' });
      }
      res.json({ id: this.lastID, mensaje: 'Voluntario registrado exitosamente' });
    });
  } else {
    const query = `
      INSERT INTO voluntarios (nombre, apellido, email, telefono, direccion, disponibilidad, habilidades, activo, fecha_registro) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    connection.query(query, [nombre, apellido, email, telefono, direccion, disponibilidad, habilidades, activo || 1], (err, result) => {
      if (err) {
        console.error('Error al agregar voluntario:', err);
        return res.status(500).json({ mensaje: 'Error al agregar voluntario' });
      }
      res.json({ id: result.insertId, mensaje: 'Voluntario registrado exitosamente' });
    });
  }
});

// Actualizar voluntario
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;
  
  connection.query('UPDATE voluntarios SET activo = ? WHERE id_voluntario = ?', [activo, id], (err, result) => {
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
  
  connection.query('DELETE FROM voluntarios WHERE id_voluntario = ?', [id], (err, result) => {
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