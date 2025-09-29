const express = require('express');
const router = express.Router();
const { connection, usingSQLite } = require('../config/database');

// Listar todo el inventario
router.get('/', (req, res) => {
  if (usingSQLite) {
    connection.all('SELECT * FROM inventario ORDER BY fecha_ingreso DESC', (err, results) => {
      if (err) {
        console.error('Error al obtener inventario:', err);
        return res.status(500).json({ mensaje: 'Error al obtener inventario' });
      }
      res.json(results || []);
    });
  } else {
    connection.query('SELECT * FROM inventario ORDER BY fecha_ingreso DESC', (err, results) => {
      if (err) {
        console.error('Error al obtener inventario:', err);
        return res.status(500).json({ mensaje: 'Error al obtener inventario' });
      }
      res.json(results);
    });
  }
});

// Agregar nuevo item al inventario
router.post('/', (req, res) => {
  const { nombre, tipo_inventario, cantidad_disponible, cantidad_solicitada, fecha_ingreso, fecha_vencimiento, disponible } = req.body;
  
  if (usingSQLite) {
    const query = `
      INSERT INTO inventario (nombre, tipo_inventario, cantidad_disponible, cantidad_solicitada, fecha_ingreso, fecha_vencimiento, disponible) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    connection.run(query, [nombre, tipo_inventario, cantidad_disponible || 0, cantidad_solicitada || 0, fecha_ingreso, fecha_vencimiento, disponible || 1], function(err) {
      if (err) {
        console.error('Error al agregar item:', err);
        return res.status(500).json({ mensaje: 'Error al agregar item al inventario' });
      }
      res.json({ id: this.lastID, mensaje: 'Item agregado al inventario exitosamente' });
    });
  } else {
    const query = `
      INSERT INTO inventario (nombre, tipo_inventario, cantidad_disponible, cantidad_solicitada, fecha_ingreso, fecha_vencimiento, disponible) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    connection.query(query, [nombre, tipo_inventario, cantidad_disponible || 0, cantidad_solicitada || 0, fecha_ingreso, fecha_vencimiento, disponible || 1], (err, result) => {
      if (err) {
        console.error('Error al agregar item:', err);
        return res.status(500).json({ mensaje: 'Error al agregar item al inventario' });
      }
      res.json({ id: result.insertId, mensaje: 'Item agregado al inventario exitosamente' });
    });
  }
});

// Solicitar stock (aumentar cantidad_solicitada)
router.put('/:id/solicitar', (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;
  
  connection.query('UPDATE inventario SET cantidad_solicitada = cantidad_solicitada + ? WHERE id_item = ?', [cantidad, id], (err, result) => {
    if (err) {
      console.error('Error al solicitar stock:', err);
      return res.status(500).json({ mensaje: 'Error al solicitar stock' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }
    
    res.json({ mensaje: 'Stock solicitado exitosamente' });
  });
});

// Usar/reducir stock (disminuir cantidad_disponible)
router.put('/:id/usar', (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;
  
  // Primero verificar que hay suficiente stock
  connection.query('SELECT cantidad_disponible FROM inventario WHERE id_item = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al verificar stock:', err);
      return res.status(500).json({ mensaje: 'Error al verificar stock' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }
    
    const stockActual = results[0].cantidad_disponible;
    
    if (stockActual < cantidad) {
      return res.status(400).json({ mensaje: `Stock insuficiente. Disponible: ${stockActual}` });
    }
    
    // Reducir el stock
    connection.query('UPDATE inventario SET cantidad_disponible = cantidad_disponible - ? WHERE id_item = ?', [cantidad, id], (err, result) => {
      if (err) {
        console.error('Error al reducir stock:', err);
        return res.status(500).json({ mensaje: 'Error al reducir stock' });
      }
      
      res.json({ mensaje: 'Stock reducido exitosamente' });
    });
  });
});

// Actualizar item del inventario (para cambiar disponibilidad)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { disponible } = req.body;
  
  connection.query('UPDATE inventario SET disponible = ? WHERE id_item = ?', [disponible, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar item:', err);
      return res.status(500).json({ mensaje: 'Error al actualizar item' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }
    
    res.json({ mensaje: 'Item actualizado exitosamente' });
  });
});

// Eliminar item del inventario
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  connection.query('DELETE FROM inventario WHERE id_item = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar item:', err);
      return res.status(500).json({ mensaje: 'Error al eliminar item' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }
    
    res.json({ mensaje: 'Item eliminado exitosamente' });
  });
});

module.exports = router;