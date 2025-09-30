const fs = require('fs');
const path = require('path');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Leer usuarios del JSON
    const usuariosPath = path.join(__dirname, '../usuarios.json');
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf8'));
    
    // Buscar usuario
    const usuario = usuarios.find(u => u.username === username && u.password === password);
    
    if (usuario) {
      return res.json({ 
        mensaje: `Bienvenido ${usuario.username} (${usuario.role}) ✅`,
        usuario: { id: usuario.id, username: usuario.username, role: usuario.role }
      });
    }
    
    return res.status(401).json({ mensaje: "Usuario o contraseña inválidos ❌" });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};