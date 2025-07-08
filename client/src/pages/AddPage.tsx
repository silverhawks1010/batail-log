import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { CreateProductRequest } from '../types/Product';
import { productApi } from '../services/api';
import './AddPage.css';

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

function AddPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    condition: 'bon'
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {};

    // Validation du titre
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    } else {
      // Vérifier si le titre existe déjà
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setLoading(true);
      
      const productData: CreateProductRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        condition: formData.condition
      };

      await productApi.createProduct(productData);
      navigate('/');
    } catch (err: unknown) {
      let errorMessage = 'Erreur lors de la création du produit';
      if (err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string') {
        errorMessage = (err as { message: string }).message;
      }
      setErrors({ general: errorMessage });
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="add-page">
      <div className="page-header">
        <h1>Nouveau Produit</h1>
        <p className="page-subtitle">Ajoutez un nouveau produit à votre catalogue</p>
      </div>

      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="product-form">
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
            <Link to="/" className="btn btn-secondary">
              Annuler
            </Link>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPage;