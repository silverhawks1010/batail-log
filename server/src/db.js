/**
 * @fileoverview Configuration et initialisation de la base de données SQLite pour ProductHub
 * @description Gère la connexion à la base de données et la création des tables
 * @author Kévin Maublanc
 * @version 1.0.0
 * @since 2024-07-08
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.db');
const sqlPath = path.join(__dirname, '../../db/produits_realistes.sql');

// Vérifier si la base existe déjà
const dbExists = fs.existsSync(dbPath);

// Créer la connexion (cela crée le fichier si besoin)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Si la base n’existait pas, charger le SQL
    if (!dbExists) {
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        db.exec(sql, (err) => {
          if (err) {
            console.error('Erreur lors de l’import SQL:', err.message);
          } else {
            console.log('Données importées depuis produits_realistes.sql');
          }
        });
      } else {
        console.warn('produits_realistes.sql non trouvé, aucun produit chargé par défaut.');
      }
    }
  }
});

module.exports = db;


