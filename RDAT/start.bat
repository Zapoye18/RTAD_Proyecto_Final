@echo off
echo Iniciando servidor backend...
cd backend
start "Backend" cmd /k "node server.js"
cd ..

echo Esperando servidor...
timeout /t 3 /nobreak >nul

echo Abriendo frontend...
start "" "frontend/index.html"

echo Sistema iniciado!
echo Backend: http://localhost:3001
echo Frontend: Abierto en navegador
pause