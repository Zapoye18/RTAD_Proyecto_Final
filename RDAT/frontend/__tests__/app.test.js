beforeEach(() => {
  document.body.innerHTML = `
    <form id="loginForm">
      <input id="username" />
      <input id="password" />
      <div id="mensaje"></div>
    </form>`;
  const store = {};
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: k => store[k] || null,
      setItem: (k, v) => (store[k] = String(v)),
      removeItem: k => delete store[k],
      clear: () => Object.keys(store).forEach(k => delete store[k]),
    },
    writable: true
  });
  jest.resetModules();
});

test('login OK muestra bienvenida y guarda usuario', () => {
  require('../app.js'); // registra listener
  document.getElementById('username').value = 'admin';
  document.getElementById('password').value = 'refugio123';
  document.getElementById('loginForm').dispatchEvent(new Event('submit', { bubbles:true, cancelable:true }));
  expect(document.getElementById('mensaje').textContent).toMatch(/Bienvenido admin/i);
  expect(JSON.parse(localStorage.getItem('usuarioLogueado')).username).toBe('admin');
});

test('login inválido muestra error', () => {
  require('../app.js');
  document.getElementById('username').value = 'x';
  document.getElementById('password').value = 'y';
  document.getElementById('loginForm').dispatchEvent(new Event('submit', { bubbles:true, cancelable:true }));
  expect(document.getElementById('mensaje').textContent).toMatch(/incorrect/);
});
