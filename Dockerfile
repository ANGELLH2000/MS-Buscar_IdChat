# Usar la imagen base de Node.js
FROM node:22

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 8080

# Ejecutar la aplicación
CMD ["npm", "run", "dev"]
