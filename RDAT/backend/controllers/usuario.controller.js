const Usuario = require('../models/usuario.model');

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Usuario.login(username, password);
    
    if (usuario) {
      return res.json({ 
        mensaje: `Bienvenido ${usuario.nombre_usuario} (${usuario.rol_usuario}) ✅`,
        usuario: { 
          id: usuario.id_usuario, 
          username: usuario.nombre_usuario, 
          role: usuario.rol_usuario.toLowerCase() 
        }
      });
    }
    
    return res.status(401).json({ mensaje: "Usuario o contraseña inválidos ❌" });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: "Error de conexión a la base de datos RDS" });
  }
};

// Listar usuarios
exports.list = async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();
    const usuariosFormateados = usuarios.map(u => ({
      id: u.id_usuario,
      username: u.nombre_usuario,
      role: u.rol_usuario.toLowerCase()
    }));
    res.json(usuariosFormateados);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ mensaje: "Error de conexión a la base de datos" });
  }
};

// Agregar usuario
exports.add = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const roleDB = role === 'admin' ? 'Admin' : 
                   role === 'empleado' ? 'Empleado' : 'Veterinario';
    
    const id = await Usuario.create(username, password, roleDB);
    res.json({ 
      id, 
      username, 
      role 
    });
  } catch (error) {
    // Fallback: agregar a JSON
    const fs = require('fs');
    const path = require('path');
    const usuariosPath = path.join(__dirname, '../../usuarios_db.json');
    
    try {
      let usuarios = [];
      if (fs.existsSync(usuariosPath)) {
        usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf8'));
      }
      
      if (usuarios.some(u => u.username === username)) {
        return res.status(400).json({ message: 'El usuario ya existe.' });
      }
      
      const newUser = {
        id: usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
        username,
        password,
        role
      };
      
      usuarios.push(newUser);
      fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
      res.json(newUser);
    } catch (err) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
};

// Eliminar usuario
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Usuario.delete(id);
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    // Fallback: eliminar del JSON
    const fs = require('fs');
    const path = require('path');
    const usuariosPath = path.join(__dirname, '../../usuarios_db.json');
    
    try {
      if (fs.existsSync(usuariosPath)) {
        let usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf8'));
        usuarios = usuarios.filter(u => u.id !== parseInt(id));
        fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
        res.json({ success: true });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (err) {
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
};