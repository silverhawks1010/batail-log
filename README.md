# ProductHub - Documentation Technique

## 📋 Table des matières
- [Vue d'ensemble](#vue-densemble)
- [Architecture du projet](#architecture-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Installation et configuration](#installation-et-configuration)
- [Structure du projet](#structure-du-projet)
- [API Documentation](#api-documentation)
- [Base de données](#base-de-données)
- [Fonctionnalités](#fonctionnalités)
- [Déploiement](#déploiement)
- [Intelligence Artificielle](#intelligence-artificielle)
- [Auteur](#auteur)

## 🎯 Vue d'ensemble

ProductHub est une application web moderne de gestion de produits développée avec une architecture client-serveur. L'application permet aux utilisateurs de créer, consulter, modifier et supprimer des produits avec une interface utilisateur intuitive et responsive.

### Objectifs du projet
- Gestion complète des produits (CRUD)
- Interface utilisateur moderne et responsive
- API RESTful performante
- Base de données SQLite pour la persistance
- Architecture modulaire et maintenable

## 🏗️ Architecture du projet

Le projet suit une architecture client-serveur classique avec séparation des responsabilités :

```
ProductHub/
├── client/          # Application frontend React + TypeScript
├── server/          # API backend Node.js + Express
└── README.md        # Documentation technique
```

### Architecture Frontend
- **Framework** : React 19 avec TypeScript
- **Routing** : React Router DOM v7
- **Build Tool** : Vite
- **HTTP Client** : Axios
- **Styling** : CSS modules

### Architecture Backend
- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : SQLite3
- **Middleware** : CORS, JSON parsing
- **Architecture** : MVC (Model-View-Controller)

## 🛠️ Technologies utilisées

### Frontend
| Technologie | Version | Description |
|-------------|---------|-------------|
| React | 19.1.0 | Framework UI principal |
| TypeScript | 5.8.3 | Typage statique |
| Vite | 7.0.3 | Build tool et dev server |
| React Router | 7.6.3 | Navigation SPA |
| Axios | 1.10.0 | Client HTTP |
| ESLint | 9.30.1 | Linting et qualité de code |

### Backend
| Technologie | Version | Description |
|-------------|---------|-------------|
| Node.js | - | Runtime JavaScript |
| Express | 5.1.0 | Framework web |
| SQLite3 | 5.1.7 | Base de données |
| CORS | 2.8.5 | Middleware CORS |
| Nodemon | 3.1.10 | Hot reloading |

## 📦 Installation et configuration

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd batail-log
```

2. **Installation des dépendances frontend**
```bash
cd client
npm install
```

3. **Installation des dépendances backend**
```bash
cd ../server
npm install
```

### Configuration

1. **Variables d'environnement frontend** (`client/.env`)
```env
VITE_API_URL=http://localhost:3001/api/products
```

2. **Variables d'environnement backend** (`server/.env`)
```env
PORT=3001
NODE_ENV=development
```

### Lancement

1. **Démarrer le serveur backend**
```bash
cd server
npm start
```

2. **Démarrer le client frontend** (nouveau terminal)
```bash
cd client
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend API : http://localhost:3001

## 📁 Structure du projet

### Frontend (`client/`)
```
src/
├── components/          # Composants réutilisables
│   ├── navbar.tsx      # Barre de navigation
│   └── footer.tsx      # Pied de page
├── pages/              # Pages de l'application
│   ├── HomePage.tsx    # Page d'accueil
│   ├── AddPage.tsx     # Page d'ajout de produit
│   ├── DetailPage.tsx  # Page de détail produit
│   └── NotFoundPage.tsx # Page 404
├── services/           # Services API
│   └── api.ts         # Client API Axios
├── types/              # Définitions TypeScript
│   └── Product.ts     # Types des produits
├── utils/              # Utilitaires
│   └── apiUtils.ts    # Fonctions utilitaires API
├── assets/             # Ressources statiques
├── App.tsx            # Composant racine
└── main.tsx           # Point d'entrée
```

### Backend (`server/`)
```
src/
├── controllers/        # Contrôleurs métier
│   └── productController.js
├── routes/            # Routes API
│   └── productRouter.js
├── models/            # Modèles de données
├── app.js            # Configuration Express
├── server.js         # Point d'entrée serveur
├── db.js             # Configuration base de données
└── database.db       # Base de données SQLite
```

## 🔌 API Documentation

### Endpoints

#### Produits

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| GET | `/api/products` | Récupérer tous les produits | `search`, `condition`, `sort`, `order` |
| GET | `/api/products/:id` | Récupérer un produit par ID | `id` (path) |
| POST | `/api/products` | Créer un nouveau produit | Body JSON |
| PUT | `/api/products/:id` | Modifier un produit | `id` (path), Body JSON |
| DELETE | `/api/products/:id` | Supprimer un produit | `id` (path) |

### Modèles de données

#### Product
```typescript
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  condition: 'bon' | 'moyen' | 'mauvais';
}
```

#### CreateProductRequest
```typescript
interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  condition: ProductCondition;
}
```

### Exemples d'utilisation

#### Créer un produit
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 15",
    "description": "Smartphone Apple dernière génération",
    "price": 999.99,
    "condition": "bon"
  }'
```

#### Récupérer tous les produits
```bash
curl http://localhost:3001/api/products
```

## 🗄️ Base de données

### Schéma de la table `products`

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL CHECK (price > 0),
  condition TEXT CHECK (condition IN ('bon', 'moyen', 'mauvais')) NOT NULL
);
```

### Contraintes
- **id** : Clé primaire auto-incrémentée
- **title** : Unique, non null
- **price** : Doit être supérieur à 0
- **condition** : Valeurs autorisées : 'bon', 'moyen', 'mauvais'

## ✨ Fonctionnalités

### Frontend
- **Navigation** : Routing SPA avec React Router
- **Gestion des produits** : CRUD complet
- **Interface responsive** : Adaptation mobile/desktop
- **Gestion d'erreurs** : Intercepteurs Axios
- **Validation** : Validation côté client
- **UX moderne** : Interface intuitive

### Backend
- **API RESTful** : Endpoints standards
- **Validation** : Validation des données
- **Gestion d'erreurs** : Middleware d'erreur
- **Base de données** : Persistance SQLite
- **CORS** : Support cross-origin
- **Logging** : Logs de debug

## 🚀 Déploiement

### Frontend (Production)
```bash
cd client
npm run build
```

### Backend (Production)
```bash
cd server
NODE_ENV=production npm start
```

### Variables d'environnement production
```env
NODE_ENV=production
PORT=3001
```

## 🤖 Intelligence Artificielle

L'intelligence artificielle a été largement utilisée dans le développement de ce projet pour améliorer la qualité du code et accélérer le processus de développement :

### Utilisation de l'IA dans le projet

#### 1. **Amélioration du Frontend**
- **Génération de composants React** : Création de composants réutilisables avec TypeScript
- **Optimisation de l'UX/UI** : Suggestions d'amélioration de l'interface utilisateur
- **Responsive Design** : Aide à l'adaptation mobile/desktop
- **Gestion d'état** : Optimisation des hooks React et de la gestion des données

#### 2. **Rédaction de documents**
- **Documentation technique** : Génération de cette documentation complète
- **Commentaires de code** : Ajout de commentaires explicatifs
- **README** : Création de guides d'installation et d'utilisation
- **Documentation API** : Génération de la documentation des endpoints

#### 3. **Commentaires et documentation**
- **Commentaires de code** : Explication des fonctions complexes
- **JSDoc** : Documentation des fonctions et types
- **Inline comments** : Clarification du code métier
- **Documentation des types** : Explication des interfaces TypeScript

### Avantages de l'utilisation de l'IA
- **Accélération du développement** : Réduction du temps de codage
- **Amélioration de la qualité** : Code plus propre et maintenable
- **Documentation complète** : Documentation technique détaillée
- **Bonnes pratiques** : Respect des standards de développement
- **Détection d'erreurs** : Identification précoce des problèmes

### Outils IA utilisés
- **Claude Sonnet 4** : Assistant principal pour le développement
- **GitHub Copilot** : Suggestions de code en temps réel
- **ChatGPT** : Aide à la résolution de problèmes spécifiques

## 👨‍💻 Auteur

**Kévin Maublanc** - 08/07/2024

### Contact
- **Email** : kevmaublanc@gmail.com
- **GitHub** : https://github.com/silverhawks1010
- **LinkedIn** : https://www.linkedin.com/in/kevinmaublanc/

---

*Cette documentation a été générée avec l'aide de l'intelligence artificielle pour assurer sa complétude et sa qualité professionnelle.*

