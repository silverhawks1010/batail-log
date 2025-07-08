/**
 * @fileoverview Routeur pour la gestion des produits dans l'API ProductHub
 * @description Définit toutes les routes CRUD pour les produits
 * @author Kévin Maublanc
 * @version 1.0.0
 * @since 2024-07-08
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * Route GET / - Récupération de tous les produits
 * @description Récupère la liste complète des produits avec filtres optionnels
 * @route GET /
 * @param {Object} req.query - Paramètres de requête (search, condition, sort, order)
 * @returns {Array} Liste des produits au format JSON
 * 
 * @example
 * ```bash
 * # Récupérer tous les produits
 * GET /api/products
 * 
 * # Rechercher des produits contenant "iPhone"
 * GET /api/products?search=iPhone
 * 
 * # Filtrer par condition et trier par prix
 * GET /api/products?condition=bon&sort=price&order=desc
 * ```
 */
router.get('/', productController.getAllProducts);

/**
 * Route GET /:id - Récupération d'un produit par ID
 * @description Récupère un produit spécifique par son identifiant
 * @route GET /:id
 * @param {string} req.params.id - Identifiant du produit
 * @returns {Object} Produit au format JSON ou erreur 404
 * 
 * @example
 * ```bash
 * # Récupérer le produit avec l'ID 1
 * GET /api/products/1
 * ```
 */
router.get('/:id', productController.getProductById);

/**
 * Route POST / - Création d'un nouveau produit
 * @description Crée un nouveau produit avec validation des données
 * @route POST /
 * @param {Object} req.body - Données du produit à créer
 * @param {string} req.body.title - Titre du produit (obligatoire)
 * @param {string} req.body.description - Description du produit (obligatoire)
 * @param {number} req.body.price - Prix du produit (obligatoire, > 0)
 * @param {string} req.body.condition - Condition du produit (obligatoire: 'bon', 'moyen', 'mauvais')
 * @returns {Object} ID du produit créé ou erreur de validation
 * 
 * @example
 * ```bash
 * # Créer un nouveau produit
 * POST /api/products
 * Content-Type: application/json
 * 
 * {
 *   "title": "iPhone 15",
 *   "description": "Smartphone Apple dernière génération",
 *   "price": 999.99,
 *   "condition": "bon"
 * }
 * 
 * # Réponse: { "id": 1 }
 * ```
 */
router.post('/', productController.createProduct);

/**
 * Route PUT /:id - Mise à jour d'un produit existant
 * @description Met à jour un produit existant avec validation des données
 * @route PUT /:id
 * @param {string} req.params.id - Identifiant du produit à modifier
 * @param {Object} req.body - Nouvelles données du produit
 * @param {string} req.body.title - Nouveau titre du produit (obligatoire)
 * @param {string} req.body.description - Nouvelle description du produit (obligatoire)
 * @param {number} req.body.price - Nouveau prix du produit (obligatoire, > 0)
 * @param {string} req.body.condition - Nouvelle condition du produit (obligatoire: 'bon', 'moyen', 'mauvais')
 * @returns {Object} Message de succès ou erreur
 * 
 * @example
 * ```bash
 * # Mettre à jour le produit avec l'ID 1
 * PUT /api/products/1
 * Content-Type: application/json
 * 
 * {
 *   "title": "iPhone 15 Pro",
 *   "description": "Smartphone Apple Pro dernière génération",
 *   "price": 1199.99,
 *   "condition": "bon"
 * }
 * 
 * # Réponse: { "message": "Product updated successfully" }
 * ```
 */
router.put('/:id', productController.updateProduct);

/**
 * Route DELETE /:id - Suppression d'un produit
 * @description Supprime un produit de la base de données
 * @route DELETE /:id
 * @param {string} req.params.id - Identifiant du produit à supprimer
 * @returns {Object} Message de succès ou erreur 404
 * 
 * @example
 * ```bash
 * # Supprimer le produit avec l'ID 1
 * DELETE /api/products/1
 * 
 * # Réponse: { "message": "Product deleted successfully" }
 * ```
 */
router.delete('/:id', productController.deleteProduct);

/**
 * Export du routeur configuré
 * @description Routeur Express avec toutes les routes CRUD pour les produits
 * @type {import('express').Router}
 */
module.exports = router;