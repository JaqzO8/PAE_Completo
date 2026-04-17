FROM node:20-alpine

WORKDIR /app

# Instalar dependencias del sistema para Sequelize y PostgreSQL
RUN apk add --no-cache postgresql-client

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar nodemon globalmente
RUN npm install -g nodemon

# Copiar código
COPY . .

# Crear directorio de uploads
RUN mkdir -p uploads

# Exponer puerto
EXPOSE 3002

# Comando de desarrollo
CMD ["npm", "run", "dev"]