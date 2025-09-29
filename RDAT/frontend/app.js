document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!username || !password) {
        document.getElementById('mensaje').textContent = 'Por favor, ingresa usuario y contraseña.';
        return;
      }

      // Enviar datos al backend para validar
      try {
        const res = await fetch('http://3.141.131.90:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok && data.usuario) {
          localStorage.setItem('usuarioLogueado', JSON.stringify(data.usuario));
          document.getElementById('mensaje').textContent = data.mensaje;
          setTimeout(() => {
            window.location.href = 'loggedpageemp.html';
          }, 1000);
        } else {
          document.getElementById('mensaje').textContent = data.mensaje || 'Usuario o contraseña incorrectos';
        }
      } catch (err) {
        document.getElementById('mensaje').textContent = 'Error de conexión al servidor';
      }
    });
  }
});