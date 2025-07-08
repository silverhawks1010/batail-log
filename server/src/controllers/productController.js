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
  console.log('Creating product with body:', req.body);
  const { title, description, price, condition } = req.body;

  // Validation des champs obligatoires
  if (!title || !description || !price || !condition) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Insertion du nouveau produit
  db.run('INSERT INTO products (title, description, price, condition) VALUES (?, ?, ?, ?)',
    [title, description, price, condition],
    function(err) {
      if (err) {
        console.error('Error creating product:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      // Retourne l'ID du produit créé
      res.status(201).json({ id: this.lastID });
    }
  );
}

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

  // Validation des champs obligatoires
  if (!title || !description || !price || !condition) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Mise à jour du produit
  db.run('UPDATE products SET title = ?, description = ?, price = ?, condition = ? WHERE id = ?',
    [title, description, price, condition, id],
    function(err) {
      if (err) {
        console.error('Error updating product:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      // Vérification si le produit a été trouvé et modifié
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
}

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

/**
 * Génère automatiquement 100 produits de test
 * @description Crée 100 produits avec des données aléatoires pour les tests et démonstrations
 * 
 * @async
 * @function generateTestProducts
 * @param {import('express').Request} req - Objet requête Express
 * @param {import('express').Response} res - Objet réponse Express
 * @returns {Promise<void>} Envoie le nombre de produits créés ou erreur
 * @throws {Error} En cas d'erreur de base de données
 * 
 * @example
 * ```javascript
 * // POST /api/products/generate
 * // Retourne: { "message": "100 test products generated successfully", "count": 100 }
 * ```
 */
exports.generateTestProducts = (req, res) => {
  // Données de test pour générer des produits variés
  const productTemplates = [
    {
      titles: ['iPhone', 'Samsung Galaxy', 'MacBook Pro', 'Dell XPS', 'iPad', 'Surface Pro', 'PlayStation', 'Xbox', 'Nintendo Switch', 'AirPods'],
      descriptions: [
        'Smartphone de dernière génération avec performances exceptionnelles',
        'Ordinateur portable professionnel pour tous vos besoins',
        'Tablette tactile avec écran haute résolution',
        'Console de jeu nouvelle génération',
        'Écouteurs sans fil avec qualité audio premium',
        'Montre connectée avec suivi santé avancé',
        'Caméra numérique haute définition',
        'Écran 4K pour une expérience immersive',
        'Clavier mécanique pour gamers',
        'Souris sans fil ergonomique'
      ],
      conditions: ['bon', 'moyen', 'mauvais'],
      priceRanges: [
        { min: 100, max: 500 },
        { min: 500, max: 1000 },
        { min: 1000, max: 2000 },
        { min: 2000, max: 5000 }
      ]
    }
  ];

  const template = productTemplates[0];
  const productsToCreate = [];
  const count = 100;

  // Génération des données pour 100 produits
  for (let i = 1; i <= count; i++) {
    const title = template.titles[Math.floor(Math.random() * template.titles.length)];
    const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
    const condition = template.conditions[Math.floor(Math.random() * template.conditions.length)];
    const priceRange = template.priceRanges[Math.floor(Math.random() * template.priceRanges.length)];
    const price = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;

    productsToCreate.push({
      title: `${title} ${i}`,
      description: `${description} - Modèle ${i}`,
      price: price,
      condition: condition
    });
  }

  // Insertion en lot des produits
  const insertPromises = productsToCreate.map(product => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO products (title, description, price, condition) VALUES (?, ?, ?, ?)',
        [product.title, product.description, product.price, product.condition],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  });

  // Exécution de toutes les insertions
  Promise.all(insertPromises)
    .then((ids) => {
      console.log(`Successfully generated ${count} test products`);
      res.status(201).json({
        message: `${count} test products generated successfully`,
        count: count,
        generatedIds: ids
      });
    })
    .catch((err) => {
      console.error('Error generating test products:', err.message);
      res.status(500).json({ error: 'Internal server error while generating test products' });
    });
}
