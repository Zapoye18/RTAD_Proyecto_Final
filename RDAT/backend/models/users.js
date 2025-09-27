const fs = require('fs');
const path = require('path');
const usersPath = path.join(__dirname, '../../frontend/usuarios.json');

// Leer usuarios
function getUsers() {
  if (!fs.existsSync(usersPath)) return [];
  return JSON.parse(fs.readFileSync(usersPath, 'utf8'));
}

// Login
exports.login = (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ 
      mensaje: `Bienvenido ${user.username} (${user.role})`,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } else {
    res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
  }
};

// Guardar usuarios
function saveUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf8');
}


// Listar usuarios
exports.list = (req, res) => {
  res.json(getUsers());
};

// Agregar usuario
exports.add = (req, res) => {
  const { username, password, role } = req.body;
  let users = getUsers();
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: 'El usuario ya existe.' });
  }
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    username,
    password,
    role
  };
  users.push(newUser);
  saveUsers(users);
  res.json(newUser);
};

// Eliminar usuario
exports.delete = (req, res) => {
  let users = getUsers();
  const id = parseInt(req.params.id);
  users = users.filter(u => u.id !== id);
  saveUsers(users);
  res.json({ success: true });
};