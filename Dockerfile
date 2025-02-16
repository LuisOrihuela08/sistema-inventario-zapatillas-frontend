# Etapa 1: Construcción de la aplicación Angular
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --prod

# Etapa 2: Servidor Nginx para servir la aplicación Angular
FROM nginx:alpine
EXPOSE 80
# Copiar la configuración personalizada de Nginx

COPY --from=build /app/dist/sistema-zapatillas-frontend/browser /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
