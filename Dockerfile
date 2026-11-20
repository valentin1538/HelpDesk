# Image de développement commune à l'API (server) et au client (Vite).
# Même version de Node et mêmes dépendances (package-lock.json) pour toute l'équipe.
FROM node:20-alpine

WORKDIR /app

# 1. Dépendances d'abord (mis en cache tant que les package.json / lockfile ne changent pas)
COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/
RUN npm ci

# 2. Code source (remplacé en développement par les volumes montés dans compose.yaml)
COPY server ./server
COPY client ./client
