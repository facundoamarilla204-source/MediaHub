FROM node:20-slim

# Instalar Python 3 y FFmpeg (Requisitos obligatorios de yt-dlp)
RUN apt-get update && \
    apt-get install -y python3 ffmpeg curl && \
    rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias e instalarlas
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir el frontend (Vite) y el backend (esbuild)
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Set environment to production to prevent Vite dev server from running
ENV NODE_ENV=production

# Arrancar el servidor
CMD ["npm", "run", "start"]
