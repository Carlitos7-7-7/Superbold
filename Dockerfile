```dockerfile
# Imagen base
FROM node:20-alpine

# Carpeta de trabajo
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Build de producción
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Variables
ENV NODE_ENV=production
ENV PORT=3000

# Ejecutar app
CMD ["npm", "start"]
```
