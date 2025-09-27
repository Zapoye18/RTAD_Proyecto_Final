const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend en puerto ${PORT}`);
  console.log('Rutas disponibles:');
  console.log('POST /api/login');
  console.log('GET /api/usuarios');
  console.log('POST /api/usuarios');
  console.log('DELETE /api/usuarios/:id');
});