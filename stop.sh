#!/bin/bash

echo "🛑 Arrêt de l'application Docker Compose..."

# Arrêter et supprimer les conteneurs
docker-compose down

echo "✅ Application arrêtée avec succès!"
echo ""
echo "🧹 Pour supprimer aussi les volumes: docker-compose down -v"
echo "🗑️  Pour supprimer les images: docker-compose down --rmi all" 