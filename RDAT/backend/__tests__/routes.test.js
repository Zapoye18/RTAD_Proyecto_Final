// Mock del modelo Usuario
jest.mock('../models/usuario.model', () => ({
  login: jest.fn(),
  getAll: jest.fn(),
  create: jest.fn(),
  delete: jest.fn()
}));

const express = require('express');
const request = require('supertest');
const router  = require('../routes/auth.routes');
const Usuario = require('../models/usuario.model');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', router);
  return app;
}

beforeEach(() => {
  jest.clearAllMocks();
});

test('POST /api/login 200', async () => {
  Usuario.login.mockResolvedValue({ id_usuario: 1, nombre_usuario: 'admin', rol_usuario: 'Admin' });
  const r = await request(makeApp()).post('/api/login').send({ username:'admin', password:'112233' });
  expect(r.status).toBe(200);
  expect(r.body.usuario.username).toBe('admin');
});

test('POST /api/login 401', async () => {
  Usuario.login.mockResolvedValue(null);
  const r = await request(makeApp()).post('/api/login').send({ username:'admin', password:'bad' });
  expect(r.status).toBe(401);
});

test('GET /api/usuarios', async () => {
  Usuario.getAll.mockResolvedValue([{ id_usuario: 1, nombre_usuario: 'admin', rol_usuario: 'Admin' }]);
  const r = await request(makeApp()).get('/api/usuarios');
  expect(r.status).toBe(200);
  expect(r.body.length).toBe(1);
});

test('POST /api/usuarios', async () => {
  Usuario.create.mockResolvedValue(1);
  const r = await request(makeApp()).post('/api/usuarios').send({ username:'nuevo', password:'x', role:'empleado' });
  expect(r.status).toBe(200);
  expect(r.body.username).toBe('nuevo');
});

test('DELETE /api/usuarios/:id', async () => {
  Usuario.delete.mockResolvedValue(true);
  const r = await request(makeApp()).delete('/api/usuarios/2');
  expect(r.status).toBe(200);
  expect(r.body).toEqual({ success:true });
});
