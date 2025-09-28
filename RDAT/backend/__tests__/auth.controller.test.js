// Cubrimos login del controller que lee ../../usuarios.json
let mockFSShouldThrow = false;

jest.mock('fs', () => ({
  readFileSync: jest.fn(() => {
    if (mockFSShouldThrow) throw new Error('boom');
    return JSON.stringify([
      { id: 1, username: 'admin', password: 'refugio123', role: 'administrador' }
    ]);
  })
}));

const { login } = require('../controllers/auth.controller');

function resMock() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  mockFSShouldThrow = false;
  jest.clearAllMocks();
});

test('login OK responde 200 con usuario', async () => {
  const req = { body: { username: 'admin', password: 'refugio123' } };
  const res = resMock();
  await login(req, res);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      usuario: expect.objectContaining({ username: 'admin', role: 'administrador' })
    })
  );
});

test('login inválido responde 401', async () => {
  const req = { body: { username: 'admin', password: 'bad' } };
  const res = resMock();
  await login(req, res);
  expect(res.status).toHaveBeenCalledWith(401);
});

test('errores de lectura responden 500', async () => {
  mockFSShouldThrow = true;
  const req = { body: { username: 'x', password: 'y' } };
  const res = resMock();
  await login(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});
