/**
 * @fileoverview Point d'entrée principal de l'application React ProductHub
 * @description Initialise et démarre l'application React avec StrictMode
 * @author Kévin Maublanc
 * @version 1.0.0
 * @since 2024-07-08
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Point d'entrée principal de l'application
 * @description Crée la racine React et rend l'application dans le DOM
 * 
 * @function createRoot
 * @description Crée une racine React pour le rendu concurrent
 * @param {HTMLElement} document.getElementById('root') - Élément DOM racine
 * 
 * @function render
 * @description Rend l'application React dans la racine créée
 * @param {JSX.Element} App - Composant principal de l'application
 * 
 * @example
 * ```tsx
 * // L'application sera rendue dans l'élément avec l'ID 'root'
 * // <div id="root"></div> dans index.html
 * 
 * createRoot(document.getElementById('root')!).render(
 *   <StrictMode>
 *     <App />
 *   </StrictMode>
 * );
 * ```
 * 
 * @throws {Error} Si l'élément 'root' n'existe pas dans le DOM
 * 
 * @author Kévin Maublanc
 * @version 1.0.0
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
