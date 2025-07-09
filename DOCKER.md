# 🐳 Docker Compose - Guide d'utilisation

Ce guide explique comment utiliser Docker Compose pour lancer l'application complète (serveur + client + base de données).

## 📋 Prérequis

- Docker installé sur votre machine
- Docker Compose installé
- Git (pour cloner le projet)

## 🚀 Démarrage rapide

### Option 1: Script automatique (recommandé)

```bash
# Rendre le script exécutable (Linux/Mac)
chmod +x start.sh

# Démarrer l'application
./start.sh
```

### Option 2: Commandes manuelles

```bash
# Construire les images
docker-compose build

# Démarrer tous les services
docker-compose up -d

# Voir les logs en temps réel
docker-compose logs -f
```

## 🛑 Arrêt de l'application

### Option 1: Script automatique

```bash
# Rendre le script exécutable (Linux/Mac)
chmod +x stop.sh

# Arrêter l'application
./stop.sh
```

### Option 2: Commande manuelle

```bash
docker-compose down
```

## 🌐 Accès aux services

Une fois démarrée, l'application sera accessible sur :

- **Client React (Frontend)**: http://localhost:5173
- **Serveur API (Backend)**: http://localhost:3000

## 📁 Structure des services

### 🖥️ Serveur (Port 3000)
- **Technologie**: Node.js + Express
- **Base de données**: SQLite
- **Hot reload**: Nodemon pour le développement

### 📱 Client (Port 5173)
- **Technologie**: React + Vite + TypeScript
- **Hot reload**: Vite pour le développement
- **API**: Se connecte au serveur sur localhost:3000

### 🗄️ Base de données
- **Type**: SQLite (fichier local)
- **Emplacement**: Dossier `./db/`
- **Fichier principal**: `produits_realistes.sql`

## 🔧 Commandes utiles

```bash
# Voir les logs d'un service spécifique
docker-compose logs -f server
docker-compose logs -f client

# Redémarrer un service
docker-compose restart server
docker-compose restart client

# Reconstruire un service après modification
docker-compose up -d --build server

# Accéder au shell d'un conteneur
docker-compose exec server sh
docker-compose exec client sh

# Voir l'état des services
docker-compose ps

# Nettoyer complètement (supprime volumes et images)
docker-compose down -v --rmi all
```

## 🐛 Dépannage

### Problème de ports déjà utilisés
Si les ports 3000 ou 5173 sont déjà utilisés, modifiez le fichier `docker-compose.yml` :

```yaml
ports:
  - "3001:3000"  # Changez 3000 en 3001
```

### Problème de permissions (Linux/Mac)
```bash
# Donner les bonnes permissions aux scripts
chmod +x start.sh stop.sh
```

### Problème de build
```bash
# Nettoyer et reconstruire
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🔄 Développement

### Hot reload
Les deux services (serveur et client) sont configurés avec le hot reload :
- Le serveur redémarre automatiquement avec Nodemon
- Le client se recharge automatiquement avec Vite

### Modifications de code
Vous pouvez modifier le code directement dans les dossiers `server/` et `client/`. Les changements seront automatiquement pris en compte grâce aux volumes montés.

### Variables d'environnement
Pour ajouter des variables d'environnement, créez un fichier `.env` dans le dossier racine ou modifiez directement le `docker-compose.yml`.

## 📝 Notes importantes

- Les `node_modules` sont montés en volumes pour éviter les conflits entre l'hôte et les conteneurs
- La base de données SQLite est persistante grâce au volume monté
- Le réseau `app-network` permet la communication entre les services
- Les services sont configurés pour le développement (hot reload activé) 