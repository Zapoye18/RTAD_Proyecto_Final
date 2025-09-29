const request = require('supertest');
const express = require('express');
const inventarioRoutes = require('../routes/inventario.routes');

// Mock de la base de datos
jest.mock('../config/database', () => ({
  connection: {
    query: jest.fn()
  }
}));

const { connection } = require('../config/database');

const app = express();
app.use(express.json());
app.use('/api/inventario', inventarioRoutes);

describe('Inventario Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/inventario should return inventory list', async () => {
    const mockInventario = [
      { id_item: 1, nombre: 'Alimento para perros', tipo_inventario: 'Alimento', cantidad_disponible: 50 }
    ];
    
    connection.query.mockImplementation((query, callback) => {
      callback(null, mockInventario);
    });

    const response = await request(app).get('/api/inventario');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockInventario);
  });

  test('POST /api/inventario should create new item', async () => {
    const newItem = {
      nombre: 'Medicamento',
      tipo_inventario: 'Medicamento',
      cantidad_disponible: 20,
      cantidad_solicitada: 0,
      fecha_ingreso: '2024-01-01',
      disponible: 1
    };

    connection.query.mockImplementation((query, params, callback) => {
      callback(null, { insertId: 1 });
    });

    const response = await request(app)
      .post('/api/inventario')
      .send(newItem);
    
    expect(response.status).toBe(200);
    expect(response.body.mensaje).toBe('Item agregado al inventario exitosamente');
  });
});