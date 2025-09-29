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
        const res = await fetch('http://localhost:5000/api/login', {
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
        // Fallback: usar localStorage si no hay servidor
        let usuarios = JSON.parse(localStorage.getItem('usuarios'));
        if (!usuarios) {
          usuarios = [
            { id: 1, username: "admin", password: "112233", role: "admin" },
            { id: 2, username: "pepe12", password: "12345", role: "empleado" }
          ];
          localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
        
        const usuario = usuarios.find(u => u.username === username && u.password === password);
        
        if (usuario) {
          localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
          document.getElementById('mensaje').textContent = `Bienvenido ${usuario.username} (${usuario.role}) ✅`;
          setTimeout(() => {
            window.location.href = 'loggedpageemp.html';
          }, 1000);
        } else {
          document.getElementById('mensaje').textContent = 'Usuario o contraseña incorrectos ❌';
        }
      }
    });
  }
});