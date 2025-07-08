import api from '../services/api';

/**
 * Vérifie si le serveur backend est accessible
 */
export const checkServerConnection = async (): Promise<boolean> => {
  try {
    const response = await api.get('/');
    return response.status === 200;
  } catch (error) {
    console.error('Erreur de connexion au serveur:', error);
    return false;
  }
};

/**
 * Affiche les informations de configuration de l'API
 */
export const logApiConfig = (): void => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  const appName = import.meta.env.VITE_APP_NAME || 'ProductHub';
  
  console.log('🔧 Configuration API:');
  console.log(`   URL: ${apiUrl}`);
  console.log(`   App: ${appName}`);
  console.log(`   Mode: ${import.meta.env.MODE}`);
  console.log(`   Debug: ${import.meta.env.VITE_DEBUG || 'false'}`);
};

/**
 * Retourne l'URL de base de l'API
 */
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
};

/**
 * Retourne le nom de l'application
 */
export const getAppName = (): string => {
  return import.meta.env.VITE_APP_NAME || 'ProductHub';
};

/**
 * Vérifie si l'application est en mode développement
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.MODE === 'development';
};

/**
 * Affiche un message d'erreur de connexion formaté
 */
export const getConnectionErrorMessage = (error: unknown): string => {
  const err = error as { code?: string; response?: { status?: number } };
  
  if (err.code === 'ECONNABORTED') {
    return '⏰ Délai d\'attente dépassé. Vérifiez votre connexion internet.';
  }
  
  if (err.response?.status === 404) {
    return '🔍 Ressource non trouvée sur le serveur.';
  }
  
  if (err.response?.status === 500) {
    return '💥 Erreur serveur. Veuillez réessayer plus tard.';
  }
  
  if (!err.response) {
    return '🔌 Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur http://localhost:3002';
  }
  
  return '❌ Erreur de connexion inconnue.';
}; 