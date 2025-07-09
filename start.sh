#!/bin/bash

echo "🚀 Démarrage de l'application avec Docker Compose..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Construire et démarrer les services
echo "📦 Construction des images Docker..."
docker-compose build

echo "🌟 Démarrage des services..."
docker-compose up -d

echo "✅ Application démarrée avec succès!"
echo ""
echo "📱 Client React: http://localhost:5173"
echo "🔧 Serveur API: http://localhost:3000"
echo ""
echo "📋 Pour voir les logs: docker-compose logs -f"
echo "🛑 Pour arrêter: docker-compose down" 