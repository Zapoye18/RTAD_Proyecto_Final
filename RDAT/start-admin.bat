@echo off
echo Instalando dependencias del backend...
cd backend
npm install
echo.

echo Iniciando servidor backend...
start "Backend" cmd /k "node server.js"
cd ..

echo Esperando servidor...
timeout /t 3 /nobreak >nul

echo Abriendo frontend...
start "" "frontend/index.html"

echo Sistema iniciado!
echo Backend: http://localhost:3001
echo Frontend: Abierto en navegador
echo.
echo Para administrar usuarios, logueate como admin y ve a Administrador de Usuarios
pause