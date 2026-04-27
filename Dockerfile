# Estágio 1: Build do React
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
# npm install é usado aqui porque o package-lock.json pode estar dessincronizado
RUN npm install --quiet
COPY . .
# Desabilitar source maps economiza MUITA memória e tempo de build
ENV GENERATE_SOURCEMAP=false

# Injeta a URL da API no momento do build (necessário para React)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Estágio 2: Servidor Nginx de Alta Performance
FROM nginx:stable-alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
# Copia sua configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]