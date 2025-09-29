# Refugio de Animales - Sistema de Gestión

Sistema web para gestión integral de refugio de animales con funcionalidades de:
- Gestión de animales (registro, adopción, estados)
- Inventario (productos, stock, vencimientos)
- Voluntarios (registro, disponibilidad, estados)
- Donaciones (registro, tipos, estadísticas)
- Usuarios y autenticación

## Estructura del Proyecto

```
RDAT/
├── backend/          # API REST con Node.js + Express
├── frontend/         # Interfaz web con HTML/CSS/JS
├── docker-compose.yml
└── .env.example
```

## Instalación

1. Instalar dependencias:
```bash
chmod +x install-deps.sh
./install-deps.sh
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales de base de datos
```

3. Ejecutar tests:
```bash
cd backend && npm test
cd frontend && npm test
```

## Desarrollo Local

Backend: `cd backend && npm start` (puerto 5000)
Frontend: Servir archivos estáticos (puerto 80)

## Despliegue

El proyecto usa CI/CD con GitHub Actions:
- Tests automáticos
- Build de imágenes Docker
- Deploy a EC2 con Docker Compose

## Base de Datos

Aurora MySQL con tablas:
- usuario, animal, inventario, voluntarios, donaciones

## API Endpoints

- `/api/login` - Autenticación
- `/api/usuarios` - Gestión usuarios
- `/api/animales` - Gestión animales
- `/api/inventario` - Gestión inventario
- `/api/voluntarios` - Gestión voluntarios
- `/api/donaciones` - Gestión donaciones