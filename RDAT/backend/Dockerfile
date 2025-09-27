# Etapa de dependencias
FROM node:18-alpine AS deps
WORKDIR /RDAT/backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Etapa final
FROM node:18-alpine
WORKDIR /RDAT/backend
COPY --from=deps /RDAT/backend/node_modules ./node_modules
# Copia TODO el backend (controllers, models, routes, server.js y usuarios.json)
COPY backend/ ./

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
