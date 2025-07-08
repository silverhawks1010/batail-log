/**
 * @fileoverview Service API pour la communication avec le backend ProductHub
 * @description Client Axios configuré avec intercepteurs pour la gestion des erreurs et l'authentification
 * @author Kévin Maublanc
 * @version 1.0.0
 * @since 2024-07-08
 */

import axios from "axios";
import type { Product, CreateProductRequest, UpdateProductRequest } from "../types/Product";

/**
 * URL de base de l'API
 * @description Récupère l'URL depuis les variables d'environnement ou utilise la valeur par défaut
 * @type {string}
 * @default 'http://localhost:3002/api/products'
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api/products';

/**
 * Instance Axios configurée pour l'API ProductHub
 * @description Client HTTP avec configuration de base, timeout et headers
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
    baseURL: `${API_BASE_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 secondes de timeout
});

/**
 * Intercepteur de réponse Axios
 * @description Gère automatiquement les erreurs HTTP courantes et les convertit en messages d'erreur lisibles
 * 
 * @param {import('axios').AxiosResponse} response - Réponse HTTP réussie
 * @param {import('axios').AxiosError} error - Erreur HTTP à traiter
 * @returns {import('axios').AxiosResponse | Promise<never>} Réponse originale ou Promise rejetée avec erreur
 * 
 * @example
 * ```typescript
 * // Gestion automatique des erreurs 404, 500, etc.
 * try {
 *   const products = await productApi.getProducts();
 * } catch (error) {
 *   console.error(error.message); // Message d'erreur en français
 * }
 * ```
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Serveur injoignable ou timeout
    if (error.code === 'ECONNABORTED' || !error.response) {
      throw new Error('Serveur injoignable. Vérifiez votre connexion ou que le backend est démarré.');
    }
    // Message d'erreur précis du backend
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    // Cas particuliers
    if (error.response?.status === 404) {
      throw new Error('Ressource non trouvée.');
    }
    if (error.response?.status === 409) {
      throw new Error('Un produit avec ce nom existe déjà.');
    }
    if (error.response?.status === 400) {
      throw new Error('Requête invalide. Vérifiez les champs du formulaire.');
    }
    if (error.response?.status === 500) {
      throw new Error('Erreur interne du serveur.');
    }
    throw error;
  }
);

/**
 * Intercepteur de requête Axios
 * @description Ajoute automatiquement le token d'authentification aux requêtes si disponible
 * 
 * @param {import('axios').AxiosRequestConfig} config - Configuration de la requête
 * @param {import('axios').AxiosError} error - Erreur de configuration
 * @returns {import('axios').AxiosRequestConfig | Promise<never>} Configuration modifiée ou Promise rejetée
 * 
 * @example
 * ```typescript
 * // Le token est automatiquement ajouté aux headers si présent dans localStorage
 * localStorage.setItem('token', 'your-jwt-token');
 * const products = await productApi.getProducts(); // Token ajouté automatiquement
 * ```
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Interface pour la réponse de génération de produits de test
 * @description Structure de la réponse lors de la génération de produits de test
 * 
 * @interface GenerateTestProductsResponse
 * @property {string} message - Message de confirmation
 * @property {number} count - Nombre de produits générés
 * @property {number[]} generatedIds - Liste des IDs des produits générés
 * 
 * @example
 * ```typescript
 * const response: GenerateTestProductsResponse = {
 *   message: "100 test products generated successfully",
 *   count: 100,
 *   generatedIds: [1, 2, 3, ..., 100]
 * };
 * ```
 */
export interface GenerateTestProductsResponse {
    message: string;
    count: number;
    generatedIds: number[];
}

/**
 * API client pour la gestion des produits
 * @description Objet contenant toutes les méthodes pour interagir avec l'API des produits
 * 
 * @namespace productApi
 * @example
 * ```typescript
 * // Récupérer tous les produits
 * const products = await productApi.getProducts();
 * 
 * // Créer un nouveau produit
 * const newProduct = await productApi.createProduct({
 *   title: "iPhone 15",
 *   description: "Smartphone Apple",
 *   price: 999.99,
 *   condition: "bon"
 * });
 * ```
 */
export const productApi = {
    /**
     * Récupère la liste complète des produits
     * @description Effectue une requête GET vers l'endpoint /api/products
     * 
     * @async
     * @function getProducts
     * @returns {Promise<Product[]>} Promise résolue avec la liste des produits
     * @throws {Error} En cas d'erreur de connexion ou serveur
     * 
     * @example
     * ```typescript
     * try {
     *   const products = await productApi.getProducts();
     *   console.log(`Récupéré ${products.length} produits`);
     * } catch (error) {
     *   console.error('Erreur lors de la récupération des produits:', error.message);
     * }
     * ```
     */
    getProducts: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/');
        return response.data;
    },

    /**
     * Crée un nouveau produit
     * @description Effectue une requête POST vers l'endpoint /api/products
     * 
     * @async
     * @function createProduct
     * @param {CreateProductRequest} product - Données du produit à créer
     * @returns {Promise<Product>} Promise résolue avec le produit créé (incluant l'ID)
     * @throws {Error} En cas d'erreur de validation ou serveur
     * 
     * @example
     * ```typescript
     * const newProduct = await productApi.createProduct({
     *   title: "MacBook Pro",
     *   description: "Ordinateur portable professionnel",
     *   price: 2499.99,
     *   condition: "bon"
     * });
     * console.log(`Produit créé avec l'ID: ${newProduct.id}`);
     * ```
     */
    createProduct: async (product: CreateProductRequest): Promise<Product> => {
        const response = await api.post<Product>('/', product);
        return response.data;
    },

    /**
     * Met à jour un produit existant
     * @description Effectue une requête PUT vers l'endpoint /api/products/:id
     * 
     * @async
     * @function updateProduct
     * @param {number} id - Identifiant du produit à modifier
     * @param {UpdateProductRequest} product - Données partielles du produit à mettre à jour
     * @returns {Promise<Product>} Promise résolue avec le produit mis à jour
     * @throws {Error} En cas de produit non trouvé ou erreur serveur
     * 
     * @example
     * ```typescript
     * const updatedProduct = await productApi.updateProduct(1, {
     *   price: 899.99,
     *   condition: "moyen"
     * });
     * console.log(`Prix mis à jour: ${updatedProduct.price}€`);
     * ```
     */
    updateProduct: async (id: number, product: UpdateProductRequest): Promise<Product> => {
        const response = await api.put<Product>(`/${id}`, product);
        return response.data;
    },

    /**
     * Supprime un produit
     * @description Effectue une requête DELETE vers l'endpoint /api/products/:id
     * 
     * @async
     * @function deleteProduct
     * @param {number} id - Identifiant du produit à supprimer
     * @returns {Promise<void>} Promise résolue après suppression réussie
     * @throws {Error} En cas de produit non trouvé ou erreur serveur
     * 
     * @example
     * ```typescript
     * try {
     *   await productApi.deleteProduct(1);
     *   console.log('Produit supprimé avec succès');
     * } catch (error) {
     *   console.error('Erreur lors de la suppression:', error.message);
     * }
     * ```
     */
    deleteProduct: async (id: number): Promise<void> => {
        await api.delete(`/${id}`);
    },

    /**
     * Récupère un produit par son identifiant
     * @description Effectue une requête GET vers l'endpoint /api/products/:id
     * 
     * @async
     * @function getProductById
     * @param {number} id - Identifiant du produit à récupérer
     * @returns {Promise<Product>} Promise résolue avec le produit demandé
     * @throws {Error} En cas de produit non trouvé ou erreur serveur
     * 
     * @example
     * ```typescript
     * try {
     *   const product = await productApi.getProductById(1);
     *   console.log(`Produit trouvé: ${product.title}`);
     * } catch (error) {
     *   console.error('Produit non trouvé:', error.message);
     * }
     * ```
     */
    getProductById: async (id: number): Promise<Product> => {
        const response = await api.get<Product>(`/${id}`);
        return response.data;
    },

    /**
     * Recherche des produits par terme de recherche
     * @description Effectue une requête GET vers l'endpoint /api/products/search
     * 
     * @async
     * @function searchProducts
     * @param {string} searchTerm - Terme de recherche à utiliser
     * @returns {Promise<Product[]>} Promise résolue avec les produits correspondants
     * @throws {Error} En cas d'erreur de connexion ou serveur
     * 
     * @example
     * ```typescript
     * const searchResults = await productApi.searchProducts("iPhone");
     * console.log(`Trouvé ${searchResults.length} produits contenant "iPhone"`);
     * ```
     */
    searchProducts: async (searchTerm: string): Promise<Product[]> => {
        const response = await api.get<Product[]>(`/search?q=${searchTerm}`);
        return response.data;
    },
};

/**
 * Instance Axios exportée par défaut
 * @description Instance configurée avec tous les intercepteurs pour utilisation directe si nécessaire
 * @type {import('axios').AxiosInstance}
 */
export default api;