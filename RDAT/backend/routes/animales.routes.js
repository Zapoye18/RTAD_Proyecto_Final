const express = require('express');
const router = express.Router();
const { connection } = require('../config/database');

// Listar todos los animales
router.get('/', (req, res) => {
  connection.query('SELECT * FROM animal ORDER BY fecha_ingreso ASC', (err, results) => {
    if (err) {
      console.error('Error al obtener animales:', err);
      return res.status(500).json({ mensaje: 'Error al obtener animales' });
    }
    res.json(results);
  });
});

// Agregar nuevo animal
router.post('/', (req, res) => {
  const { nombre, especie, raza, edad, sexo, estado_salud, historial_medico, vacunas, fecha_ingreso, disponible_adopcion } = req.body;
  
  const query = `
    INSERT INTO animal (nombre, especie, raza, edad, sexo, estado_salud, historial_medico, vacunas, fecha_ingreso, disponible_adopcion) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  connection.query(query, [nombre, especie, raza, edad, sexo, estado_salud, historial_medico, vacunas, fecha_ingreso, disponible_adopcion], (err, result) => {
    if (err) {
      console.error('Error al agregar animal:', err);
      return res.status(500).json({ mensaje: 'Error al agregar animal' });
    }
    res.json({ id: result.insertId, mensaje: 'Animal agregado exitosamente' });
  });
});

// Actualizar estado de adopción
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { disponible_adopcion } = req.body;
  
  connection.query('UPDATE animal SET disponible_adopcion = ? WHERE id_animal = ?', [disponible_adopcion, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar animal:', err);
      return res.status(500).json({ mensaje: 'Error al actualizar animal' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Animal no encontrado' });
    }
    
    res.json({ mensaje: 'Estado actualizado exitosamente' });
  });
});

// Eliminar animal
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  connection.query('DELETE FROM animal WHERE id_animal = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar animal:', err);
      return res.status(500).json({ mensaje: 'Error al eliminar animal' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Animal no encontrado' });
    }
    
    res.json({ mensaje: 'Animal eliminado exitosamente' });
  });
});

module.exports = router;