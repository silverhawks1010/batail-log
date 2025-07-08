# 🚀 ProductHub - Gestion de Produits

Une application web moderne et intuitive pour gérer votre catalogue de produits avec une interface élégante et des fonctionnalités avancées.

![ProductHub](https://img.shields.io/badge/ProductHub-v1.0.0-blue)
![React](https://img.shields.io/badge/React-19.1.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178c6)
![Vite](https://img.shields.io/badge/Vite-7.0.3-646cff)

## ✨ Fonctionnalités

### 🎯 **Gestion Complète des Produits**
- ✅ **CRUD complet** : Création, lecture, modification, suppression
- ✅ **Recherche avancée** : Par titre, description, prix
- ✅ **Filtrage intelligent** : Par état, prix, date
- ✅ **Tri multi-colonnes** : Titre, prix, état, date de création
- ✅ **Validation robuste** : Vérification d'unicité des titres
- ✅ **Interface responsive** : Optimisé mobile, tablette, desktop

### 🎨 **Design Moderne**
- 🎨 **Interface élégante** : Design Material avec gradients
- 🌈 **Palette de couleurs** : Bleu moderne et professionnel
- 📱 **Responsive design** : S'adapte à tous les écrans
- ⚡ **Animations fluides** : Transitions et micro-interactions
- 🎯 **UX optimisée** : Navigation intuitive et feedback visuel

### 🔧 **Architecture Technique**
- ⚛️ **React 19** : Dernière version avec nouvelles fonctionnalités
- 🔷 **TypeScript** : Type safety et meilleure DX
- ⚡ **Vite** : Build tool ultra-rapide
- 🎨 **CSS moderne** : Variables CSS, Flexbox, Grid
- 🔄 **React Router** : Navigation SPA fluide

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <votre-repo>
cd producthub

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📁 Structure du Projet

```
src/
├── components/           # Composants React
│   ├── navbar.tsx       # Barre de navigation moderne
│   └── footer.tsx       # Pied de page
├── pages/               # Pages de l'application
│   ├── HomePage.tsx     # Page d'accueil avec tableau
│   ├── AddPage.tsx      # Formulaire d'ajout
│   └── NotFoundPage.tsx # Page 404
├── services/            # Services API
│   └── api.ts          # Client HTTP et méthodes API
├── types/               # Types TypeScript
│   └── Product.ts      # Interfaces et types
├── App.tsx             # Composant principal avec routing
└── main.tsx            # Point d'entrée
```

## 🎨 Design System

### Palette de Couleurs
- **Primaire** : `#6366f1` (Bleu indigo)
- **Secondaire** : `#10b981` (Vert émeraude)
- **Accent** : `#f59e0b` (Orange ambre)
- **Danger** : `#ef4444` (Rouge)
- **Warning** : `#f97316` (Orange)

### Typographie
- **Police** : Inter (Google Fonts)
- **Hiérarchie** : Système de tailles cohérent
- **Poids** : 300, 400, 500, 600, 700

### Composants
- **Boutons** : Gradients, ombres, animations
- **Badges** : États colorés avec gradients
- **Cartes** : Ombres, hover effects
- **Formulaires** : Validation visuelle

## 🔧 Configuration API

### Configuration simple

L'application utilise un fichier `.env.local` pour configurer la connexion au serveur backend.

1. **Créez un fichier `.env.local` à la racine du projet :**
```env
# Configuration de l'API backend
VITE_API_URL=http://localhost:3001/api

# Configuration de l'application
VITE_APP_NAME=ProductHub
```

2. **Démarrez votre serveur backend sur le port 3001**

### Endpoints requis
L'application s'attend à ce que votre backend expose les endpoints suivants :

- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit
- `GET /api/products/:id` - Détail d'un produit
- `GET /api/products/search?q=term` - Recherche de produits

### Structure des données
Voir le fichier `API_CONFIG.md` pour la documentation complète de l'API.

## 🎯 Utilisation

### Navigation
- **Accueil** : Tableau des produits avec recherche et tri
- **Produits** : Gestion complète des produits
- **Ajouter** : Formulaire de création de produit

### Fonctionnalités
1. **Recherche** : Tapez dans la barre de recherche pour filtrer
2. **Tri** : Cliquez sur les en-têtes de colonnes pour trier
3. **Actions** : Utilisez les boutons pour voir/modifier/supprimer
4. **Responsive** : L'interface s'adapte automatiquement

## 🚧 Développement

### Scripts Disponibles
```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run lint         # Vérification du code
```

### Structure des Composants
Chaque composant suit une structure cohérente :
- Types TypeScript
- Hooks React
- Gestion d'erreurs
- États de chargement
- Responsive design

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **React Team** pour l'excellent framework
- **Vite** pour l'outil de build ultra-rapide
- **Inter Font** pour la typographie moderne
- **Tailwind CSS** pour l'inspiration du design system

---

**ProductHub** - Votre solution moderne de gestion de produits 🚀
