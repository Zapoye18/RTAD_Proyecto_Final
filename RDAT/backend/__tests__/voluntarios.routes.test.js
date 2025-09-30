const request = require('supertest');
const express = require('express');
const voluntariosRoutes = require('../routes/voluntarios.routes');

// Mock de la base de datos
jest.mock('../config/database', () => ({
  connection: {
    query: jest.fn()
  }
}));

const { connection } = require('../config/database');

const app = express();
app.use(express.json());
app.use('/api/voluntarios', voluntariosRoutes);

describe('Voluntarios Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/voluntarios should return voluntarios list', async () => {
    const mockVoluntarios = [
      { id_voluntario: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@test.com' }
    ];
    
    connection.query.mockImplementation((query, callback) => {
      callback(null, mockVoluntarios);
    });

    const response = await request(app).get('/api/voluntarios');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockVoluntarios);
  });

  test('POST /api/voluntarios should create new voluntario', async () => {
    const newVoluntario = {
      nombre: 'Ana',
      apellido: 'García',
      email: 'ana@test.com',
      telefono: '123456789',
      direccion: 'Calle 123',
      disponibilidad: 'Mañanas',
      habilidades: 'Cuidado de animales'
    };

    connection.query.mockImplementation((query, params, callback) => {
      callback(null, { insertId: 1 });
    });

    const response = await request(app)
      .post('/api/voluntarios')
      .send(newVoluntario);
    
    expect(response.status).toBe(200);
    expect(response.body.mensaje).toBe('Voluntario registrado exitosamente');
  });

  test('PUT /api/voluntarios/:id should update voluntario status', async () => {
    connection.query.mockImplementation((query, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app)
      .put('/api/voluntarios/1')
      .send({ activo: 0 });
    
    expect(response.status).toBe(200);
    expect(response.body.mensaje).toBe('Voluntario actualizado exitosamente');
  });

  test('DELETE /api/voluntarios/:id should delete voluntario', async () => {
    connection.query.mockImplementation((query, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).delete('/api/voluntarios/1');
    
    expect(response.status).toBe(200);
    expect(response.body.mensaje).toBe('Voluntario eliminado exitosamente');
  });
    test('GET /api/voluntarios -> 500 cuando falla la DB', async () => {
    connection.query.mockImplementation((q, cb) => cb(new Error('db')));
    const res = await request(app).get('/api/voluntarios');
    expect(res.status).toBe(500);
  });

  test('POST /api/voluntarios -> 500 cuando falla la DB', async () => {
    connection.query.mockImplementation((q, params, cb) => cb(new Error('db')));
    const res = await request(app)
      .post('/api/voluntarios')
      .send({ nombre: 'X', email: 'x@x.com' });
    expect(res.status).toBe(500);
  });

  test('PUT /api/voluntarios/:id -> 500 cuando falla la DB', async () => {
    connection.query.mockImplementation((q, params, cb) => cb(new Error('db')));
    const res = await request(app).put('/api/voluntarios/1').send({ activo: 0 });
    expect(res.status).toBe(500);
  });

  test('DELETE /api/voluntarios/:id -> 500 cuando falla la DB', async () => {
    connection.query.mockImplementation((q, params, cb) => cb(new Error('db')));
    const res = await request(app).delete('/api/voluntarios/1');
    expect(res.status).toBe(500);
  });
});