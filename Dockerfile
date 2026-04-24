# Estágio 1: Build do React
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
# npm ci é mais rápido e garante instalações consistentes
RUN npm ci --quiet
COPY . .
# Desabilitar source maps economiza MUITA memória e tempo de build no 1GB RAM
ENV GENERATE_SOURCEMAP=false
RUN npm run build

# Estágio 2: Servidor Nginx de Alta Performance
FROM nginx:stable-alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
# Copia sua configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]