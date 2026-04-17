FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar nodemon globalmente para hot-reload
RUN npm install -g nodemon

# Copiar código (esto se sobrescribe con el volume)
COPY . .

# Exponer puerto
EXPOSE 3001

# Comando de desarrollo con nodemon
CMD ["npm", "run", "dev"]