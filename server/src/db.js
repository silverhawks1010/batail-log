/**
 * @fileoverview Configuration et initialisation de la base de données SQLite pour ProductHub
 * @description Gère la connexion à la base de données et la création des tables
 * @author Kévin Maublanc
 * @version 1.0.0
 * @since 2024-07-08
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Instance de connexion à la base de données SQLite
 * @description Connexion persistante à la base de données avec gestion d'erreurs
 * @type {import('sqlite3').Database}
 * 
 * @example
 * ```javascript
 * // Utilisation dans les contrôleurs
 * const db = require('../db');
 * db.all('SELECT * FROM products', [], (err, rows) => {
 *   if (err) console.error(err);
 *   else console.log(rows);
 * });
 * ```
 */
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

/**
 * Initialisation de la base de données
 * @description Crée les tables nécessaires si elles n'existent pas
 * 
 * @function db.serialize
 * @description Exécute les requêtes SQL de manière séquentielle pour assurer l'ordre d'exécution
 * 
 * @example
 * ```sql
 * -- Création de la table products avec contraintes
 * CREATE TABLE IF NOT EXISTS products (
 *   id INTEGER PRIMARY KEY AUTOINCREMENT,
 *   title TEXT UNIQUE NOT NULL,
 *   description TEXT NOT NULL,
 *   price REAL NOT NULL CHECK (price > 0),
 *   condition TEXT CHECK (condition IN ('bon', 'moyen', 'mauvais')) NOT NULL
 * );
 * ```
 */
db.serialize(() => {
  /**
   * Création de la table products
   * @description Table principale pour stocker les informations des produits
   * 
   * Contraintes définies :
   * - id : Clé primaire auto-incrémentée
   * - title : Unique et non null (évite les doublons)
   * - description : Non null
   * - price : Non null et strictement positif
   * - condition : Valeurs autorisées : 'bon', 'moyen', 'mauvais'
   */
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL CHECK (price > 0),
      condition TEXT CHECK (condition IN ('bon', 'moyen', 'mauvais')) NOT NULL
    )
  `);
});

/**
 * Export de l'instance de base de données
 * @description Instance SQLite configurée et prête à l'utilisation
 * @type {import('sqlite3').Database}
 */
module.exports = db;


