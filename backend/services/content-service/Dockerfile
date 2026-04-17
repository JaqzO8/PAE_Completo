FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar nodemon globalmente para hot-reload
RUN npm install -g nodemon

# Crear directorio de uploads
RUN mkdir -p /app/uploads/resources/pdfs \
    /app/uploads/resources/videos \
    /app/uploads/resources/audios \
    /app/uploads/resources/images \
    /app/uploads/resources/others

# Copiar código (esto se sobrescribe con el volume)
COPY . .

# Exponer puerto
EXPOSE 3003

# Comando de desarrollo con nodemon
CMD ["npm", "run", "dev"]