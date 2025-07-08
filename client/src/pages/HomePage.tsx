import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../types/Product";
import { productApi } from "../services/api";
import "./HomePage.css";

type SortField = 'title' | 'price' | 'condition';
type SortDirection = 'asc' | 'desc';

function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('title');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [generating, setGenerating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productApi.getProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des produits');
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Génère automatiquement 100 produits de test
     * @description Appelle l'API pour créer 100 produits avec des données aléatoires
     * 
     * @async
     * @function handleGenerateTestProducts
     * @returns {Promise<void>}
     * @throws {Error} En cas d'erreur lors de la génération
     * 
     * @example
     * ```typescript
     * // Appelé lors du clic sur le bouton "Générer des produits de test"
     * await handleGenerateTestProducts();
     * ```
     */
    const handleGenerateTestProducts = async () => {
        if (!confirm('Êtes-vous sûr de vouloir générer 100 produits de test ? Cette action ne peut pas être annulée.')) {
            return;
        }

        try {
            setGenerating(true);
            const result = await productApi.generateTestProducts();
            
            // Afficher un message de succès
            alert(`${result.count} produits de test ont été générés avec succès !`);
            
            // Recharger la liste des produits
            await loadProducts();
        } catch (err) {
            alert('Erreur lors de la génération des produits de test');
            console.error('Error generating test products:', err);
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (id: number, title: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
            return;
        }

        try {
            await productApi.deleteProduct(id);
            setProducts(products.filter(product => product.id !== id));
        } catch (err) {
            alert('Erreur lors de la suppression du produit');
            console.error('Error deleting product:', err);
        }
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getConditionBadge = (condition: string) => {
        const badges = {
            bon: { text: 'Bon', className: 'badge-success' },
            moyen: { text: 'Moyen', className: 'badge-warning' },
            mauvais: { text: 'Mauvais', className: 'badge-danger' }
        };
        const badge = badges[condition as keyof typeof badges];
        return <span className={`badge ${badge.className}`}>{badge.text}</span>;
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return '↕️';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    // Filtrage et tri
    const filteredAndSortedProducts = products
        .filter(product => 
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let aValue: string | number = a[sortField];
            let bValue: string | number = b[sortField];

            // Tri spécial pour les prix
            if (sortField === 'price') {
                aValue = parseFloat(aValue.toString());
                bValue = parseFloat(bValue.toString());
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Chargement des produits...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button onClick={loadProducts} className="btn btn-primary">
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="home-page">
            <div className="page-header">
                <h1>Tableau de Bord</h1>
                <p className="page-subtitle">Gérez vos produits en toute simplicité</p>
            </div>

            {/* Section des actions rapides */}
            <div className="actions-section">
                <div className="actions-left">
                    <Link to="/add" className="btn btn-primary">
                        + Ajouter un produit
                    </Link>
                </div>
                <div className="actions-right">
                    <button
                        onClick={handleGenerateTestProducts}
                        disabled={generating}
                        className={`btn btn-secondary ${generating ? 'btn-loading' : ''}`}
                        title="Générer 100 produits de test avec des données aléatoires"
                    >
                        {generating ? '⏳ Génération...' : '🎲 Générer 100 produits de test'}
                    </button>
                </div>
            </div>

            <div className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Rechercher par titre ou description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>
                <div className="results-count">
                    {filteredAndSortedProducts.length} produit(s) trouvé(s)
                </div>
            </div>

            {filteredAndSortedProducts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>Aucun produit trouvé</h3>
                    <p>
                        {searchTerm 
                            ? `Aucun produit ne correspond à "${searchTerm}"`
                            : "Aucun produit n'est disponible pour le moment"
                        }
                    </p>
                    <div className="empty-actions">
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')} 
                                className="btn btn-secondary"
                            >
                                Effacer la recherche
                            </button>
                        )}
                        {!searchTerm && (
                            <button 
                                onClick={handleGenerateTestProducts}
                                disabled={generating}
                                className={`btn btn-primary ${generating ? 'btn-loading' : ''}`}
                            >
                                {generating ? '⏳ Génération...' : '🎲 Générer des produits de test'}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="table-container">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th 
                                    onClick={() => handleSort('title')}
                                    className="sortable-header"
                                >
                                    Titre {getSortIcon('title')}
                                </th>
                                <th>Description</th>
                                <th 
                                    onClick={() => handleSort('price')}
                                    className="sortable-header"
                                >
                                    Prix {getSortIcon('price')}
                                </th>
                                <th 
                                    onClick={() => handleSort('condition')}
                                    className="sortable-header"
                                >
                                    État {getSortIcon('condition')}
                                </th>
                                <th><center>Actions</center></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedProducts.map(product => (
                                <tr key={product.id} className="table-row">
                                    <td className="product-title">
                                        {product.title}
                                    </td>
                                    <td className="product-description">
                                        {product.description.length > 50 
                                            ? `${product.description.substring(0, 50)}...`
                                            : product.description
                                        }
                                    </td>
                                    <td className="product-price">
                                        {product.price.toFixed(2)} €
                                    </td>
                                    <td className="product-condition">
                                        {getConditionBadge(product.condition)}
                                    </td>
                                    <td className="product-actions">
                                        <button
                                            onClick={() => navigate(`/product/${product.id}`)}
                                            className="btn btn-sm btn-primary"
                                            title="Voir les détails"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id, product.title)}
                                            className="btn btn-sm btn-danger"
                                            title="Supprimer"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default HomePage;