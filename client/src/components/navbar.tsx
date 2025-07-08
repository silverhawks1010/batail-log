/**
 * @fileoverview Composant de navigation principal pour l'application ProductHub
 * @description Barre de navigation avec logo, titre et lien vers l'ajout de produits
 * @author Kévin Maublanc
 * @version 1.0.0
 * @since 2024-07-08
 */

import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

/**
 * Composant de navigation principal
 * @description Barre de navigation responsive avec logo ProductHub et actions utilisateur
 * 
 * @component NavBar
 * @description Affiche une barre de navigation avec :
 * - Logo et titre de l'application
 * - Lien vers la page d'accueil
 * - Bouton d'ajout de nouveau produit
 * - Indication visuelle de la page active
 * 
 * @example
 * ```tsx
 * // Utilisation dans App.tsx
 * <Router>
 *   <div className="app">
 *     <NavBar />
 *     <main className="main-content">
 *       <Routes>...</Routes>
 *     </main>
 *   </div>
 * </Router>
 * ```
 * 
 * @returns {JSX.Element} Barre de navigation complète avec logo et actions
 * 
 * @author Kévin Maublanc
 * @version 1.0.0
 */
function NavBar() {
  /**
   * Hook pour récupérer l'emplacement actuel dans l'application
   * @description Utilisé pour déterminer quelle page est active et appliquer le style correspondant
   * @type {import('react-router-dom').Location}
   */
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Section du logo et titre de l'application */}
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            {/* Icône du logo (emoji package) */}
            <div className="logo-icon">📦</div>
            {/* Texte du logo avec titre et sous-titre */}
            <div className="logo-text">
              <h1>ProductHub</h1>
              <span className="logo-subtitle">Gestion de Produits</span>
            </div>
          </Link>
        </div>
        
        {/* Section des actions utilisateur */}
        <div className="navbar-actions">
          <Link 
            to="/add" 
            className={`navbar-link ${location.pathname === '/add' ? 'active' : ''}`}
          >
            + Nouveau Produit
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;