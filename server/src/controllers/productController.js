/**
 * @fileoverview Contrôleur pour la gestion des produits dans l'API ProductHub
 * @description Gère toutes les opérations CRUD sur les produits avec validation et gestion d'erreurs
 * @author Kévin Maublanc
 * @version 1.0.0
 * @since 2024-07-08
 */

const db = require('../db');

/**
 * Récupère tous les produits avec filtres optionnels
 * @description Effectue une requête SQL avec recherche, filtrage par condition et tri
 * 
 * @async
 * @function getAllProducts
 * @param {import('express').Request} req - Objet requête Express
 * @param {Object} req.query - Paramètres de requête
 * @param {string} [req.query.search=''] - Terme de recherche dans le titre
 * @param {string} [req.query.condtion] - Filtre par condition ('bon', 'moyen', 'mauvais')
 * @param {string} [req.query.sort='id'] - Champ de tri (id, title, price, condition)
 * @param {string} [req.query.order='asc'] - Ordre de tri ('asc' ou 'desc')
 * @param {import('express').Response} res - Objet réponse Express
 * @returns {Promise<void>} Envoie la liste des produits en JSON
 * @throws {Error} En cas d'erreur de base de données
 * 
 * @example
 * ```javascript
 * // GET /api/products?search=iPhone&condition=bon&sort=price&order=desc
 * // Retourne tous les produits contenant "iPhone" en bon état, triés par prix décroissant
 * ```
 */
exports.getAllProducts = (req, res) => {
  const { search = '', condtion, sort = 'id', order = 'asc' } = req.query;

  // Construction de la requête SQL avec filtres dynamiques
  let query = `SELECT * FROM products WHERE title LIKE ?`;
  const params = [`%${search}%`];
  
  // Ajout du filtre par condition si spécifié
  if (condtion) {
    query += ` AND condition = ?`;
    params.push(condtion);
  }
  
  // Ajout du tri
  query += ` ORDER BY ${sort} ${order.toUpperCase()}`;

  // Exécution de la requête
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
}

/**
 * Récupère un produit par son identifiant
 * @description Effectue une requête SQL pour récupérer un produit spécifique
 * 
 * @async
 * @function getProductById
 * @param {import('express').Request} req - Objet requête Express
 * @param {Object} req.params - Paramètres de route
 * @param {string} req.params.id - Identifiant du produit à récupérer
 * @param {import('express').Response} res - Objet réponse Express
 * @returns {Promise<void>} Envoie le produit en JSON ou erreur 404
 * @throws {Error} En cas d'erreur de base de données
 * 
 * @example
 * ```javascript
 * // GET /api/products/1
 * // Retourne le produit avec l'ID 1 ou une erreur 404 si non trouvé
 * ```
 */
exports.getProductById = (req, res) => {
  const id = req.params.id;

  // Requête SQL pour récupérer un produit par ID
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching product:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
}

/**
 * Crée un nouveau produit
 * @description Valide les données et insère un nouveau produit en base de données
 * 
 * @async
 * @function createProduct
 * @param {import('express').Request} req - Objet requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.title - Titre du produit (obligatoire)
 * @param {string} req.body.description - Description du produit (obligatoire)
 * @param {number} req.body.price - Prix du produit (obligatoire, > 0)
 * @param {string} req.body.condition - Condition du produit (obligatoire: 'bon', 'moyen', 'mauvais')
 * @param {import('express').Response} res - Objet réponse Express
 * @returns {Promise<void>} Envoie l'ID du produit créé ou erreur de validation
 * @throws {Error} En cas d'erreur de base de données ou validation échouée
 * 
 * @example
 * ```javascript
 * // POST /api/products
 * // Body: {
 * //   "title": "iPhone 15",
 * //   "description": "Smartphone Apple dernière génération",
 * //   "price": 999.99,
 * //   "condition": "bon"
 * // }
 * // Retourne: { "id": 1 }
 * ```
 */
exports.createProduct = (req, res) => {
  const { title, description, price, condition } = req.body;

  if (!title || !description || !price || !condition) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }

  db.run(
    'INSERT INTO products (title, description, price, condition) VALUES (?, ?, ?, ?)',
    [title, description, price, condition],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Un produit avec ce nom existe déjà.' });
        }
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};

/**
 * Met à jour un produit existant
 * @description Valide les données et met à jour un produit en base de données
 * 
 * @async
 * @function updateProduct
 * @param {import('express').Request} req - Objet requête Express
 * @param {Object} req.params - Paramètres de route
 * @param {string} req.params.id - Identifiant du produit à modifier
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.title - Nouveau titre du produit (obligatoire)
 * @param {string} req.body.description - Nouvelle description du produit (obligatoire)
 * @param {number} req.body.price - Nouveau prix du produit (obligatoire, > 0)
 * @param {string} req.body.condition - Nouvelle condition du produit (obligatoire: 'bon', 'moyen', 'mauvais')
 * @param {import('express').Response} res - Objet réponse Express
 * @returns {Promise<void>} Envoie un message de succès ou erreur
 * @throws {Error} En cas d'erreur de base de données, validation échouée ou produit non trouvé
 * 
 * @example
 * ```javascript
 * // PUT /api/products/1
 * // Body: {
 * //   "title": "iPhone 15 Pro",
 * //   "description": "Smartphone Apple Pro dernière génération",
 * //   "price": 1199.99,
 *   "condition": "bon"
 * // }
 * // Retourne: { "message": "Product updated successfully" }
 * ```
 */
exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const { title, description, price, condition } = req.body;

  if (!title || !description || !price || !condition) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }

  db.run(
    'UPDATE products SET title = ?, description = ?, price = ?, condition = ? WHERE id = ?',
    [title, description, price, condition, id],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Un produit avec ce nom existe déjà.' });
        }
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Produit non trouvé.' });
      }
      res.json({ message: 'Produit modifié avec succès.' });
    }
  );
};

/**
 * Supprime un produit
 * @description Supprime un produit de la base de données par son identifiant
 * 
 * @async
 * @function deleteProduct
 * @param {import('express').Request} req - Objet requête Express
 * @param {Object} req.params - Paramètres de route
 * @param {string} req.params.id - Identifiant du produit à supprimer
 * @param {import('express').Response} res - Objet réponse Express
 * @returns {Promise<void>} Envoie un message de succès ou erreur
 * @throws {Error} En cas d'erreur de base de données ou produit non trouvé
 * 
 * @example
 * ```javascript
 * // DELETE /api/products/1
 * // Retourne: { "message": "Product deleted successfully" }
 * // Ou erreur 404 si le produit n'existe pas
 * ```
 */
exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  
  // Suppression du produit
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting product:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Vérification si le produit a été trouvé et supprimé
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
}
