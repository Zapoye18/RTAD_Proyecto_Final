const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const animalesRoutes = require('./routes/animales.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const voluntariosRoutes = require('./routes/voluntarios.routes');
const donacionesRoutes = require('./routes/donaciones.routes');

app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api', authRoutes);
app.use('/api/animales', animalesRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/voluntarios', voluntariosRoutes);
app.use('/api/donaciones', donacionesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend en puerto ${PORT}`);
  console.log('Rutas disponibles:');
  console.log('POST /api/login');
  console.log('GET /api/usuarios');
  console.log('POST /api/usuarios');
  console.log('DELETE /api/usuarios/:id');
  console.log('GET /api/animales');
  console.log('POST /api/animales');
  console.log('PUT /api/animales/:id');
  console.log('DELETE /api/animales/:id');
  console.log('GET /api/inventario');
  console.log('POST /api/inventario');
  console.log('PUT /api/inventario/:id/solicitar');
  console.log('PUT /api/inventario/:id/usar');
  console.log('DELETE /api/inventario/:id');
  console.log('GET /api/voluntarios');
  console.log('POST /api/voluntarios');
  console.log('PUT /api/voluntarios/:id');
  console.log('DELETE /api/voluntarios/:id');
  console.log('GET /api/donaciones');
  console.log('POST /api/donaciones');
  console.log('DELETE /api/donaciones/:id');
});