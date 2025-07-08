/**
 * @fileoverview Définitions des types TypeScript pour l'application ProductHub
 * @description Interfaces et types pour la gestion des produits et des réponses API
 * @author Kévin Maublanc
 * @version 1.0.0
 * @since 2024-07-08
 */

/**
 * État de condition d'un produit
 * @description Définit les trois niveaux de condition possibles pour un produit
 * @typedef {'bon' | 'moyen' | 'mauvais'} ProductCondition
 * 
 * @example
 * ```typescript
 * const condition: ProductCondition = 'bon';
 * ```
 */
export type ProductCondition = 'bon' | 'moyen' | 'mauvais';

/**
 * Interface représentant un produit dans l'application
 * @description Structure complète d'un produit avec toutes ses propriétés
 * 
 * @interface Product
 * @property {number} id - Identifiant unique du produit (auto-généré)
 * @property {string} title - Titre/nom du produit
 * @property {string} description - Description détaillée du produit
 * @property {number} price - Prix du produit en euros
 * @property {ProductCondition} condition - État de condition du produit
 * 
 * @example
 * ```typescript
 * const product: Product = {
 *   id: 1,
 *   title: "iPhone 15",
 *   description: "Smartphone Apple dernière génération",
 *   price: 999.99,
 *   condition: "bon"
 * };
 * ```
 */
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  condition: ProductCondition;
}

/**
 * Interface pour la création d'un nouveau produit
 * @description Données requises pour créer un nouveau produit (sans l'ID)
 * 
 * @interface CreateProductRequest
 * @property {string} title - Titre/nom du produit (obligatoire)
 * @property {string} description - Description détaillée du produit (obligatoire)
 * @property {number} price - Prix du produit en euros (obligatoire)
 * @property {ProductCondition} condition - État de condition du produit (obligatoire)
 * 
 * @example
 * ```typescript
 * const newProduct: CreateProductRequest = {
 *   title: "MacBook Pro",
 *   description: "Ordinateur portable professionnel",
 *   price: 2499.99,
 *   condition: "bon"
 * };
 * ```
 */
export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  condition: ProductCondition;
}

/**
 * Interface pour la mise à jour d'un produit existant
 * @description Données optionnelles pour modifier un produit existant
 * 
 * @interface UpdateProductRequest
 * @extends {Partial<CreateProductRequest>} - Toutes les propriétés sont optionnelles
 * @property {number} id - Identifiant du produit à modifier (obligatoire)
 * 
 * @example
 * ```typescript
 * const updateData: UpdateProductRequest = {
 *   id: 1,
 *   price: 899.99, // Seul le prix est modifié
 *   condition: "moyen"
 * };
 * ```
 */
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

/**
 * Interface pour les filtres de recherche de produits
 * @description Paramètres optionnels pour filtrer la liste des produits
 * 
 * @interface ProductFilters
 * @property {string} [search] - Terme de recherche dans le titre et la description
 * @property {ProductCondition} [condition] - Filtre par condition du produit
 * @property {number} [minPrice] - Prix minimum pour le filtrage
 * @property {number} [maxPrice] - Prix maximum pour le filtrage
 * 
 * @example
 * ```typescript
 * const filters: ProductFilters = {
 *   search: "iPhone",
 *   condition: "bon",
 *   minPrice: 500,
 *   maxPrice: 1000
 * };
 * ```
 */
export interface ProductFilters {
  search?: string;
  condition?: ProductCondition;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Interface générique pour les réponses d'API
 * @description Structure standardisée pour toutes les réponses de l'API
 * 
 * @template T - Type des données contenues dans la réponse
 * @interface ApiResponse
 * @property {T} data - Données principales de la réponse
 * @property {string} [message] - Message informatif optionnel
 * @property {boolean} success - Indicateur de succès de l'opération
 * 
 * @example
 * ```typescript
 * const response: ApiResponse<Product> = {
 *   data: product,
 *   message: "Produit récupéré avec succès",
 *   success: true
 * };
 * ```
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Interface pour les réponses paginées
 * @description Structure pour les listes de données avec pagination
 * 
 * @template T - Type des éléments dans la liste
 * @interface PaginatedResponse
 * @property {T[]} data - Liste des éléments de la page courante
 * @property {number} total - Nombre total d'éléments
 * @property {number} page - Numéro de la page courante
 * @property {number} limit - Nombre d'éléments par page
 * @property {number} totalPages - Nombre total de pages
 * 
 * @example
 * ```typescript
 * const paginatedResponse: PaginatedResponse<Product> = {
 *   data: products,
 *   total: 100,
 *   page: 1,
 *   limit: 10,
 *   totalPages: 10
 * };
 * ```
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}