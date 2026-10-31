# Étape 1 : build du site statique (contexte = racine du dépôt)
FROM node:24-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
# "/" : les API sont servies sur le même domaine, derrière Caddy
ARG VITE_API_URL=/
ARG VITE_SIGNAL_API_URL=/
ENV VITE_API_URL=$VITE_API_URL VITE_SIGNAL_API_URL=$VITE_SIGNAL_API_URL
RUN npm run build

# Étape 2 : Caddy sert le site, gère le HTTPS et relaie /api vers les backends
FROM caddy:2-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
