FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código (esto se sobrescribe con el volume)
COPY . .

# Exponer puerto de Vite
EXPOSE 5173

# Comando de desarrollo con hot-reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]