# Etapa de dependencias
FROM node:18-alpine AS deps
WORKDIR /RDAT/backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Etapa final
FROM node:18-alpine
# Trabajaremos dentro de /RDAT/backend para mantener las rutas de tu código
WORKDIR /RDAT/backend

# Copiamos node_modules ya resueltas
COPY --from=deps /RDAT/backend/node_modules ./node_modules

# Copiamos TODO el backend (controllers, models, routes, server.js, etc.)
COPY backend/ ./

# Copiamos el JSON a /RDAT (dos niveles arriba de controllers)
WORKDIR /RDAT
COPY usuarios.json ./usuarios.json

# Volvemos a /RDAT/backend para arrancar la app
WORKDIR /RDAT/backend
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
