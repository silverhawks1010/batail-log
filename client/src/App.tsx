/**
 * @fileoverview Composant principal de l'application ProductHub
 * @description Point d'entrée de l'application React avec configuration du routing
 * @author Kévin Maublanc
 * @version 1.0.0
 * @since 2024-07-08
 */

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar.tsx";
import Footer from "./components/footer.tsx";

// Importez vos pages
import HomePage from './pages/HomePage.tsx';
import AddPage from './pages/AddPage.tsx';
import DetailPage from './pages/DetailPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

/**
 * Composant principal de l'application ProductHub
 * 
 * @description Ce composant configure l'architecture de l'application avec :
 * - Le système de routing React Router
 * - La structure de layout (Navbar, contenu principal, Footer)
 * - Les routes vers les différentes pages de l'application
 * 
 * @component
 * @example
 * ```tsx
 * // Utilisation dans main.tsx
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>
 * )
 * ```
 * 
 * @returns {JSX.Element} L'application React complète avec routing configuré
 * 
 * @author Kévin Maublanc
 * @version 1.0.0
 */
function App() {
  return (
    <Router>
      <div className="app">
        {/* Barre de navigation présente sur toutes les pages */}
        <Navbar />
        
        {/* Contenu principal avec système de routing */}
        <main className="main-content">
          <Routes>
            {/* Route pour la page d'accueil - Liste des produits */}
            <Route path="/" element={<HomePage />} />
            
            {/* Route pour la page d'ajout de nouveau produit */}
            <Route path="/add" element={<AddPage />} />
            
            {/* Route pour la page de détail d'un produit spécifique */}
            <Route path="/product/:id" element={<DetailPage />} />
            
            {/* Route 404 - Page de gestion des erreurs (doit être en dernier) */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Pied de page présent sur toutes les pages */}
        <Footer />
      </div>
    </Router>
  )
}

export default App
