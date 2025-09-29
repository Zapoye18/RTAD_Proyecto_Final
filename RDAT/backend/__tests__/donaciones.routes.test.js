const request = require('supertest');
const express = require('express');
const donacionesRoutes = require('../routes/donaciones.routes');

// Mock de la base de datos
jest.mock('../config/database', () => ({
  connection: {
    query: jest.fn()
  }
}));

const { connection } = require('../config/database');

const app = express();
app.use(express.json());
app.use('/api/donaciones', donacionesRoutes);

describe('Donaciones Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/donaciones should return donaciones list', async () => {
    const mockDonaciones = [
      { id_donacion: 1, nombre_donante: 'María López', tipo_donacion: 'Monetaria', monto: 100 }
    ];
    
    connection.query.mockImplementation((query, callback) => {
      callback(null, mockDonaciones);
    });

    const response = await request(app).get('/api/donaciones');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockDonaciones);
  });

  test('POST /api/donaciones should create new donacion', async () => {
    const newDonacion = {
      nombre_donante: 'Carlos Ruiz',
      email_donante: 'carlos@test.com',
      telefono_donante: '987654321',
      tipo_donacion: 'Monetaria',
      monto: 500,
      forma_pago: 'Transferencia',
      descripcion: 'Donación para alimentos'
    };

    connection.query.mockImplementation((query, params, callback) => {
      callback(null, { insertId: 1 });
    });

    const response = await request(app)
      .post('/api/donaciones')
      .send(newDonacion);
    
    expect(response.status).toBe(200);
    expect(response.body.mensaje).toBe('Donación registrada exitosamente');
  });

  test('DELETE /api/donaciones/:id should delete donacion', async () => {
    connection.query.mockImplementation((query, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).delete('/api/donaciones/1');
    
    expect(response.status).toBe(200);
    expect(response.body.mensaje).toBe('Donación eliminada exitosamente');
  });
});