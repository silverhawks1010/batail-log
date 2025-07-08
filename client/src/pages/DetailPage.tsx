import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Product, UpdateProductRequest } from '../types/Product';
import { productApi } from '../services/api';
import './DetailPage.css';

interface FormData {
  title: string;
  description: string;
  price: string;
  condition: 'bon' | 'moyen' | 'mauvais';
}

interface FormErrors {
  title?: string;
  description?: string;
  price?: string;
  condition?: string;
  general?: string;
}

function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    condition: 'bon'
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [originalTitle, setOriginalTitle] = useState('');

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await productApi.getProductById(parseInt(id!));
      setProduct(productData);
      setFormData({
        title: productData.title,
        description: productData.description,
        price: productData.price.toString(),
        condition: productData.condition
      });
      setOriginalTitle(productData.title);
    } catch (err) {
      setError('Produit non trouvé');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {};

    // Validation du titre
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    } else if (formData.title.trim() !== originalTitle) {
      // Vérifier si le titre existe déjà seulement s'il a changé
      try {
        const exists = await productApi.searchProducts(formData.title.trim());
        if (exists.length > 0) {
          newErrors.title = 'Ce titre existe déjà';
        }
      } catch (err) {
        console.error('Error checking title:', err);
      }
    }

    // Validation de la description
    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }

    // Validation du prix
    if (!formData.price.trim()) {
      newErrors.price = 'Le prix est obligatoire';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Le prix doit être un nombre positif';
      }
    }

    // Validation de l'état
    if (!formData.condition) {
      newErrors.condition = 'L\'état est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setSaving(true);
      
      const productData: UpdateProductRequest = {
        id: parseInt(id!),
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        condition: formData.condition
      };

      const updatedProduct = await productApi.updateProduct(parseInt(id!), productData);
      setProduct(updatedProduct);
      setOriginalTitle(updatedProduct.title);
      setIsEditing(false);
      setErrors({});
    } catch (err) {
      setErrors({ general: 'Erreur lors de la mise à jour du produit' });
      console.error('Error updating product:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        condition: product.condition
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      await productApi.deleteProduct(parseInt(id!));
      navigate('/');
    } catch (err) {
      setError('Erreur lors de la suppression du produit');
      console.error('Error deleting product:', err);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'bon': return '#10b981';
      case 'moyen': return '#f59e0b';
      case 'mauvais': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'bon': return 'Bon';
      case 'moyen': return 'Moyen';
      case 'mauvais': return 'Mauvais';
      default: return condition;
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-page">
        <div className="error-container">
          <h2>Erreur</h2>
          <p>{error || 'Produit non trouvé'}</p>
          <Link to="/" className="btn btn-primary">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>{isEditing ? 'Modifier le produit' : product.title}</h1>
            <p className="page-subtitle">
              {isEditing ? 'Modifiez les informations du produit' : 'Détails du produit'}
            </p>
          </div>
          
          {!isEditing && (
            <div className="header-actions">
              <button 
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Modifier
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}

      <div className="detail-container">
        {isEditing ? (
          // Mode édition
          <div className="edit-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Titre du produit *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`form-control ${errors.title ? 'error' : ''}`}
                placeholder="Entrez le titre du produit"
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`form-control ${errors.description ? 'error' : ''}`}
                placeholder="Décrivez votre produit en détail"
                rows={4}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`form-control ${errors.price ? 'error' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="condition" className="form-label">
                  État *
                </label>
                <select
                  id="condition"
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className={`form-control ${errors.condition ? 'error' : ''}`}
                >
                  <option value="bon">Bon</option>
                  <option value="moyen">Moyen</option>
                  <option value="mauvais">Mauvais</option>
                </select>
                {errors.condition && <span className="error-text">{errors.condition}</span>}
              </div>
            </div>

            <div className="form-actions">
              <button 
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={saving}
              >
                Annuler
              </button>
              <button 
                onClick={handleSave}
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        ) : (
          // Mode affichage
          <div className="product-details">
            <div className="detail-section">
              <h3>Description</h3>
              <p className="description">{product.description}</p>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Prix</span>
                <span className="detail-value price">{product.price.toFixed(2)} €</span>
              </div>

              <div className="detail-item">
                <span className="detail-label">État</span>
                <span 
                  className="detail-value condition"
                  style={{ color: getConditionColor(product.condition) }}
                >
                  {getConditionText(product.condition)}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">ID</span>
                <span className="detail-value">{product.id}</span>
              </div>

            </div>
          </div>
        )}
      </div>

      <div className="back-link">
        <Link to="/" className="btn btn-secondary">
          ← Retour à la liste
        </Link>
      </div>
    </div>
  );
}

export default DetailPage; 