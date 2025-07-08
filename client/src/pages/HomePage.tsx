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
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [filterCondition, setFilterCondition] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const itemsPerPageOptions = [10, 20, 50, 100];
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
        .filter(product => {
            // Filtre texte
            const matchesText =
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            // Filtre prix
            const matchesMin = minPrice ? product.price >= parseFloat(minPrice) : true;
            const matchesMax = maxPrice ? product.price <= parseFloat(maxPrice) : true;
            // Filtre état
            const matchesCondition = filterCondition ? product.condition === filterCondition : true;
            return matchesText && matchesMin && matchesMax && matchesCondition;
        })
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

    // Pagination
    const totalProducts = filteredAndSortedProducts.length;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const paginatedProducts = filteredAndSortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

            {/* Ligne fusionnée : ajout + filtres */}
            <div className="filters-actions-bar" style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                <Link to="/add" className="btn btn-primary">
                    + Ajouter un produit
                </Link>
                <div className="filters-section" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', margin: 0 }}>
                    <div>
                        <label htmlFor="minPrice">Prix min :</label>
                        <input id="minPrice" type="number" min="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0" />
                    </div>
                    <div>
                        <label htmlFor="maxPrice">Prix max :</label>
                        <input id="maxPrice" type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="9999" />
                    </div>
                    <div>
                        <label htmlFor="filterCondition">État :</label>
                        <select id="filterCondition" value={filterCondition} onChange={e => setFilterCondition(e.target.value)}>
                            <option value="">Tous</option>
                            <option value="bon">Bon</option>
                            <option value="moyen">Moyen</option>
                            <option value="mauvais">Mauvais</option>
                        </select>
                    </div>
                    {(minPrice || maxPrice || filterCondition) && (
                        <button type="button" className="btn btn-secondary" onClick={() => { setMinPrice(''); setMaxPrice(''); setFilterCondition(''); }}>
                            Réinitialiser les filtres
                        </button>
                    )}
                </div>
                <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
                    <input
                        type="text"
                        placeholder="Rechercher par titre ou description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>
            </div>

            {/* Pagination : choix du nombre d'éléments par page et navigation */}
            <div className="pagination-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <span>Afficher </span>
                    <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                        {itemsPerPageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <span> par page</span>
                </div>
                <div>
                    <button className="btn btn-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>&laquo;</button>
                    <button className="btn btn-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>&lsaquo;</button>
                    <span style={{ margin: '0 8px' }}>Page {currentPage} / {totalPages || 1}</span>
                    <button className="btn btn-secondary" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>&rsaquo;</button>
                    <button className="btn btn-secondary" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(totalPages)}>&raquo;</button>
                </div>
                <div className="results-count">{totalProducts} produit(s) trouvé(s)</div>
            </div>

            {/* Table et reste du code */}
            {paginatedProducts.length === 0 ? (
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
                            {paginatedProducts.map(product => (
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