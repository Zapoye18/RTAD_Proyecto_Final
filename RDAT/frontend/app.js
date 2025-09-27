document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!username || !password) {
        document.getElementById('mensaje').textContent = 'Por favor, ingresa usuario y contraseña.';
        return;
      }

      // Cargar usuarios del localStorage o usar por defecto
      let usuarios = JSON.parse(localStorage.getItem('usuarios'));
      if (!usuarios) {
        usuarios = [
          { id: 1, username: "admin", password: "refugio123", role: "administrador" }
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
      
      // Buscar usuario
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
    });
  }
});