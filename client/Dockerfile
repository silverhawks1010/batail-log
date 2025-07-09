FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Exposer le port Vite
EXPOSE 5173

# Commande de démarrage avec Vite en mode développement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 