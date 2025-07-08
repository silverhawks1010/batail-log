/**
 * @fileoverview Composant de pied de page pour l'application ProductHub
 * @description Pied de page avec informations de l'application, copyright et version
 * @author Kévin Maublanc
 * @version 1.0.0
 * @since 2024-07-08
 */

import './footer.css';

/**
 * Composant de pied de page
 * @description Pied de page responsive avec informations de l'application et copyright
 * 
 * @component Footer
 * @description Affiche un pied de page avec :
 * - Logo et description de l'application
 * - Copyright avec année dynamique
 * - Badge de version de l'application
 * - Informations de contact et légales
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
 *     <Footer />
 *   </div>
 * </Router>
 * ```
 * 
 * @returns {JSX.Element} Pied de page complet avec informations de l'application
 * 
 * @author Kévin Maublanc
 * @version 1.0.0
 */
function Footer() {
    /**
     * Année courante pour le copyright
     * @description Génère dynamiquement l'année actuelle pour le copyright
     * @type {number}
     */
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Section principale du footer avec informations de l'application */}
                <div className="footer-content">
                    <div className="footer-brand">
                        {/* Logo et titre de l'application */}
                        <div className="footer-logo">
                            <span className="footer-icon">📦</span>
                            <span className="footer-title">ProductHub</span>
                        </div>
                        {/* Description de l'application */}
                        <p className="footer-description">
                            Votre solution moderne de gestion de produits
                        </p>
                    </div>
                </div>
                
                {/* Section inférieure avec copyright et version */}
                <div className="footer-bottom">
                    {/* Copyright avec année dynamique */}
                    <div className="footer-copyright">
                        <p>&copy; {currentYear} ProductHub. Tous droits réservés.</p>
                    </div>
                    {/* Badge de version de l'application */}
                    <div className="footer-version">
                        <span className="version-badge">v1.0.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;