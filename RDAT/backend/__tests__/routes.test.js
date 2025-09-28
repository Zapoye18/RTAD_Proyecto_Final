let mockMem;

jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  readFileSync: jest.fn(() => JSON.stringify(mockMem)),
  writeFileSync: jest.fn((_, data) => { mockMem = JSON.parse(data); })
}));

const express = require('express');
const request = require('supertest');
const router  = require('../routes/auth.routes');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', router);
  return app;
}

beforeEach(() => {
  mockMem = [
    { id: 1, username: 'admin', password: 'refugio123', role: 'administrador' },
    { id: 2, username: 'emp',   password: '123',        role: 'empleado' }
  ];
});

test('POST /api/login 200', async () => {
  const r = await request(makeApp()).post('/api/login').send({ username:'admin', password:'refugio123' });
  expect(r.status).toBe(200);
  expect(r.body.user.username).toBe('admin');
});

test('POST /api/login 401', async () => {
  const r = await request(makeApp()).post('/api/login').send({ username:'admin', password:'bad' });
  expect(r.status).toBe(401);
});

test('GET /api/usuarios', async () => {
  const r = await request(makeApp()).get('/api/usuarios');
  expect(r.status).toBe(200);
  expect(r.body.length).toBe(2);
});

test('POST /api/usuarios', async () => {
  const r = await request(makeApp()).post('/api/usuarios').send({ username:'nuevo', password:'x', role:'empleado' });
  expect(r.status).toBe(200);
  expect(r.body.username).toBe('nuevo');
});

test('DELETE /api/usuarios/:id', async () => {
  const r = await request(makeApp()).delete('/api/usuarios/2');
  expect(r.status).toBe(200);
  expect(r.body).toEqual({ success:true });
});
