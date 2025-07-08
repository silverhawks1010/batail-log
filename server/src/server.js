/**
 * @fileoverview Point d'entrée du serveur ProductHub
 * @description Démarre le serveur Express sur le port configuré
 * @author Kévin Maublanc
 * @version 1.0.0
 * @since 2024-07-08
 */

require('dotenv').config();
const app = require('./app');

/**
 * Port d'écoute du serveur
 * @description Récupère le port depuis les variables d'environnement ou utilise la valeur par défaut
 * @type {string|number}
 * @default 3001
 * 
 * @example
 * ```bash
 * # Dans le fichier .env
 * PORT=3001
 * 
 * # Ou en ligne de commande
 * PORT=3001 npm start
 * ```
 */
const PORT = process.env.PORT || 3001;

/**
 * Démarrage du serveur Express
 * @description Lance le serveur sur le port configuré et affiche un message de confirmation
 * 
 * @function app.listen
 * @param {number} PORT - Port d'écoute du serveur
 * @param {Function} callback - Fonction de callback appelée quand le serveur démarre
 * 
 * @example
 * ```javascript
 * // Le serveur sera accessible sur http://localhost:3001
 * app.listen(PORT, () => {
 *   console.log(`Server listening on http://localhost:${PORT}`);
 * });
 * ```
 */
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});