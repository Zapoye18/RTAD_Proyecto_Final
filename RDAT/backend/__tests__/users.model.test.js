// Mock de fs con "estado" en memoria.
let store;
jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  readFileSync: jest.fn(() => JSON.stringify(store)),
  writeFileSync: jest.fn((_, data) => { store = JSON.parse(data); })
}));

const usersCtrl = require('../models/users');

function resMock() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  store = [
    { id: 1, username: 'admin', password: 'refugio123', role: 'administrador' },
    { id: 2, username: 'emp',   password: '123',        role: 'empleado' }
  ];
  jest.clearAllMocks();
});

test('list devuelve usuarios', () => {
  const res = resMock();
  usersCtrl.list({}, res);
  expect(res.json).toHaveBeenCalledWith(store);
});

test('login exitoso', () => {
  const res = resMock();
  usersCtrl.login({ body: { username: 'admin', password: 'refugio123' } }, res);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    user: expect.objectContaining({ username: 'admin', role: 'administrador' })
  }));
});

test('login inválido', () => {
  const res = resMock();
  usersCtrl.login({ body: { username: 'admin', password: 'zzz' } }, res);
  expect(res.status).toHaveBeenCalledWith(401);
});

test('add crea usuario nuevo y persiste', () => {
  const res = resMock();
  usersCtrl.add({ body: { username: 'nuevo', password: 'abc', role: 'empleado' } }, res);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username: 'nuevo' }));
});

test('add rechaza duplicado', () => {
  const res = resMock();
  usersCtrl.add({ body: { username: 'admin', password: 'x', role: 'empleado' } }, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('delete elimina por id y persiste', () => {
  const res = resMock();
  usersCtrl.delete({ params: { id: '2' } }, res);
  expect(res.json).toHaveBeenCalledWith({ success: true });
});
