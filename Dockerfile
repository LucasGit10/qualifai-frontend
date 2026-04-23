# Estágio 1: Build do React
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servidor Nginx de Alta Performance
FROM nginx:stable-alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
# Copia sua configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]