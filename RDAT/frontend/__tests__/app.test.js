beforeEach(() => {
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

test('login OK muestra bienvenida y guarda usuario', () => {
  require('../app.js'); // registra el listener de DOMContentLoaded
  document.dispatchEvent(new Event('DOMContentLoaded')); // 👈 dispara el init

  document.getElementById('username').value = 'admin';
  document.getElementById('password').value = 'refugio123';
  document.getElementById('loginForm')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  expect(document.getElementById('mensaje').textContent)
    .toMatch(/Bienvenido admin/i);
  expect(JSON.parse(localStorage.getItem('usuarioLogueado')).username)
    .toBe('admin');
});

test('login inválido muestra error', () => {
  require('../app.js');
  document.dispatchEvent(new Event('DOMContentLoaded'));

  document.getElementById('username').value = 'x';
  document.getElementById('password').value = 'y';
  document.getElementById('loginForm')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

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
test('redirige a loggedpageemp.html tras login OK', () => {
  jest.useFakeTimers(); // 👈 importante para cubrir la callback del setTimeout

  require('../app.js');
  document.dispatchEvent(new Event('DOMContentLoaded'));

  // Hacemos window.location asignable en JSDOM
  const originalLocation = window.location;
  delete window.location;
  window.location = { href: 'http://localhost/' };

  // Login válido
  document.getElementById('username').value = 'admin';
  document.getElementById('password').value = 'refugio123';
  document.getElementById('loginForm')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  // Avanza el temporizador de 1s
  jest.advanceTimersByTime(1000);

  // Verifica el redirect
  expect(window.location.href).toMatch(/loggedpageemp\.html$/);

  // Limpieza
  window.location = originalLocation;
});

