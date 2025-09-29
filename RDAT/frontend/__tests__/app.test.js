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
  document.getElementById('password').value = '112233';
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
  jest.useFakeTimers();

  // Hook para capturar la redirección
  window.__onRedirect = jest.fn();

  // Carga el script y dispara DOMContentLoaded
  require('../app.js');
  document.dispatchEvent(new Event('DOMContentLoaded'));

  // Login válido
  document.getElementById('username').value = 'admin';
  document.getElementById('password').value = '112233';
  document.getElementById('loginForm')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  // Ejecuta el timeout de 1s
  jest.advanceTimersByTime(1000);

  // Se intentó redirigir correctamente
  expect(window.__onRedirect).toHaveBeenCalledWith('loggedpageemp.html');

  // Limpieza
  delete window.__onRedirect;
  jest.useRealTimers();
});




