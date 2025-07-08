/**
 * @fileoverview Configuration principale de l'application Express pour l'API ProductHub
 * @description Configure les middlewares, les routes et l'architecture de l'API
 * @author Kévin Maublanc
 * @version 1.0.0
 * @since 2024-07-08
 */

const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/productRouter');

/**
 * Instance de l'application Express
 * @description Application Express configurée avec tous les middlewares et routes
 * @type {import('express').Application}
 */
const app = express();

/**
 * Configuration du middleware CORS
 * @description Permet les requêtes cross-origin depuis le frontend
 * @middleware cors
 * 
 * @example
 * ```javascript
 * // Permet les requêtes depuis http://localhost:5173 (frontend Vite)
 * app.use(cors());
 * ```
 */
app.use(cors());

/**
 * Configuration du middleware de parsing JSON
 * @description Parse automatiquement les corps de requêtes JSON
 * @middleware express.json
 * 
 * @example
 * ```javascript
 * // POST /api/products
 * // Body: { "title": "iPhone", "price": 999.99 }
 * // req.body sera automatiquement parsé en objet JavaScript
 * ```
 */
app.use(express.json());

/**
 * Configuration des routes de l'API
 * @description Montage du routeur des produits sur le préfixe /api/products
 * @route /api/products
 * 
 * @example
 * ```javascript
 * // Toutes les routes du routeur products seront préfixées par /api/products
 * // GET /api/products -> productsRouter.getAllProducts
 * // POST /api/products -> productsRouter.createProduct
 * // GET /api/products/:id -> productsRouter.getProductById
 * // etc.
 * ```
 */
app.use('/api/products', productsRouter);

/**
 * Export de l'application Express configurée
 * @description Application prête à être utilisée par le serveur
 * @type {import('express').Application}
 */
module.exports = app;