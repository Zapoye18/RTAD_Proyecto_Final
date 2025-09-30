const request = require('supertest');
const express = require('express');
const animalesRoutes = require('../routes/animales.routes');

// Mock de la base de datos
jest.mock('../config/database', () => ({
  connection: {
    query: jest.fn()
  }
}));

const { connection } = require('../config/database');

const app = express();
app.use(express.json());
app.use('/api/animales', animalesRoutes);

describe('Animales Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/animales should return animals list', async () => {
    const mockAnimales = [
      { id_animal: 1, nombre: 'Max', especie: 'Perro', disponible_adopcion: 1 }
    ];
    
    connection.query.mockImplementation((query, callback) => {
      callback(null, mockAnimales);
    });

    const response = await request(app).get('/api/animales');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnimales);
  });

  test('POST /api/animales should create new animal', async () => {
    const newAnimal = {
      nombre: 'Luna',
      especie: 'Gato',
      raza: 'Siamés',
      edad: 2,
      sexo: 'Hembra',
      fecha_ingreso: '2024-01-01',
      disponible_adopcion: 1
    };

    connection.query.mockImplementation((query, params, callback) => {
      callback(null, { insertId: 1 });
    });

    const response = await request(app)
      .post('/api/animales')
      .send(newAnimal);
    
    expect(response.status).toBe(200);
    expect(response.body.mensaje).toBe('Animal agregado exitosamente');
  });
});