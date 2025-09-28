let mockStore;

jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
  readFileSync: jest.fn(() => JSON.stringify(mockStore)),
  writeFileSync: jest.fn((_, data) => { mockStore = JSON.parse(data); })
}));

const usersCtrl = require('../models/users');

function resMock() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => {
  mockStore = [
    { id: 1, username: 'admin', password: 'refugio123', role: 'administrador' },
    { id: 2, username: 'emp',   password: '123',        role: 'empleado' }
  ];
  jest.clearAllMocks();
});

test('list devuelve usuarios', () => {
  const res = resMock();
  usersCtrl.list({}, res);
  expect(res.json).toHaveBeenCalledWith(mockStore);
});

test('login OK', () => {
  const res = resMock();
  usersCtrl.login({ body: { username: 'admin', password: 'refugio123' } }, res);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    user: expect.objectContaining({ username: 'admin' })
  }));
});

test('login 401', () => {
  const res = resMock();
  usersCtrl.login({ body: { username: 'admin', password: 'bad' } }, res);
  expect(res.status).toHaveBeenCalledWith(401);
});

test('add crea usuario', () => {
  const res = resMock();
  usersCtrl.add({ body: { username: 'nuevo', password: 'x', role: 'empleado' } }, res);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username: 'nuevo' }));
});

test('add rechaza duplicado', () => {
  const res = resMock();
  usersCtrl.add({ body: { username: 'admin', password: 'x', role: 'empleado' } }, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('delete elimina', () => {
  const res = resMock();
  usersCtrl.delete({ params: { id: '2' } }, res);
  expect(res.json).toHaveBeenCalledWith({ success: true });
});

