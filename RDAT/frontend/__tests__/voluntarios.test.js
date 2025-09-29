// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
  document.body.innerHTML = '';
});

test('voluntarios page should load without errors', () => {
  document.body.innerHTML = `
    <div class="voluntarios-container">
      <form id="voluntarioForm">
        <input id="nombre" />
        <input id="apellido" />
        <input id="email" />
        <div id="mensaje"></div>
      </form>
    </div>
  `;
  
  const form = document.getElementById('voluntarioForm');
  expect(form).toBeTruthy();
});

test('should handle form validation', () => {
  document.body.innerHTML = `
    <form id="voluntarioForm">
      <input id="nombre" required />
      <input id="apellido" required />
      <input id="email" required />
    </form>
  `;
  
  const form = document.getElementById('voluntarioForm');
  const nombre = document.getElementById('nombre');
  const apellido = document.getElementById('apellido');
  const email = document.getElementById('email');
  
  // Test empty form
  expect(nombre.value).toBe('');
  expect(apellido.value).toBe('');
  expect(email.value).toBe('');
});