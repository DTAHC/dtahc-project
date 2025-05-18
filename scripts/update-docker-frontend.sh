#!/bin/bash
# Script pour mettre à jour le frontend dans Docker avec les nouvelles pages

echo "Arrêt du conteneur frontend..."
docker stop dtahc-frontend

echo "Reconstruction de l'image avec les nouvelles pages..."
cd /Users/d972/dtahc-project
docker-compose -f docker/docker-compose.yml build frontend

echo "Redémarrage du conteneur frontend..."
docker start dtahc-frontend

echo "Mise à jour terminée ! Les nouvelles pages sont désormais disponibles dans Docker."
echo "Vous pouvez accéder aux pages via:"
echo "- http://localhost (via le proxy NGINX)"
echo "- http://localhost:3000 (directement vers le frontend)"