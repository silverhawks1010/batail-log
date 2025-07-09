FROM node:18-alpine

WORKDIR /app

# Installer les dépendances système nécessaires pour sqlite3
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite \
    sqlite-dev

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3000

# Commande de démarrage avec nodemon pour le développement
CMD ["npm", "start"] 