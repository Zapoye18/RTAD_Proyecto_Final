# Etapa deps
FROM node:18-alpine AS deps
WORKDIR /RDAT/backend
COPY backend/package*.json ./

# Herramientas de build para deps nativas (gyp)
RUN apk add --no-cache --virtual .gyp python3 make g++ \
 && npm ci --omit=dev --no-audit --no-fund --loglevel verbose \
 && apk del .gyp

# Etapa final
FROM node:18-alpine
WORKDIR /RDAT/backend
COPY --from=deps /RDAT/backend/node_modules ./node_modules
COPY backend/ ./

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]

