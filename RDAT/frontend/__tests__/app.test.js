// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
  
  // Mock respuesta exitosa por defecto
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({
      mensaje: 'Bienvenido admin (admin) ✓',
      usuario: { id: 1, username: 'admin', role: 'admin' }
    })
  });
  document.body.innerHTML = `
    <form id="loginForm">
      <input id="username" />
      <input id="password" />
      <div id="mensaje"></div>
    </form>
  `;

  // Mock simple de localStorage (en memoria)
  const store = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: k => (k in store ? store[k] : null),
      setItem: (k, v) => (store[k] = String(v)),
      removeItem: k => delete store[k],
      clear: () => Object.keys(store).forEach(k => delete store[k]),
    },
    writable: true,
  });

  jest.resetModules(); // para que app.js se ejecute de nuevo en cada test
});

test('login OK muestra bienvenida y guarda usuario', async () => {
  require('../app.js');
  document.dispatchEvent(new Event('DOMContentLoaded'));

  document.getElementById('username').value = 'admin';
  document.getElementById('password').value = '112233';
  
  const form = document.getElementById('loginForm');
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  
  // Esperar a que se procese la promesa
  await new Promise(resolve => setTimeout(resolve, 100));

  expect(document.getElementById('mensaje').textContent)
    .toMatch(/Bienvenido admin/i);
  expect(JSON.parse(localStorage.getItem('usuarioLogueado')).username)
    .toBe('admin');
});

test('login inválido muestra error', async () => {
  // Mock respuesta de error
  fetch.mockResolvedValueOnce({
    ok: false,
    json: () => Promise.resolve({ mensaje: 'Usuario o contraseña incorrectos' })
  });
  
  require('../app.js');
  document.dispatchEvent(new Event('DOMContentLoaded'));

  document.getElementById('username').value = 'x';
  document.getElementById('password').value = 'y';
  document.getElementById('loginForm')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  // Esperar a que se procese la promesa
  await new Promise(resolve => setTimeout(resolve, 100));

  expect(document.getElementById('mensaje').textContent)
    .toMatch(/incorrect/); // "incorrectos/incorrectas/incorrecto"
});

test('faltan campos muestra mensaje de validación', () => {
  require('../app.js');
  document.dispatchEvent(new Event('DOMContentLoaded'));

  // Deja campos vacíos
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('loginForm')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(document.getElementById('mensaje').textContent)
    .toMatch(/por favor|completa todos/i);
});





