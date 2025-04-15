FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Instala dependências
RUN npm install

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Compila o projeto
RUN npm run build

# Usa nginx para servir os arquivos estáticos
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
