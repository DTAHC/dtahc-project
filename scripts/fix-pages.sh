#!/bin/bash
# Script pour créer manuellement les pages manquantes dans Docker

echo "Arrêt du conteneur frontend..."
docker stop dtahc-frontend

echo "Créant les dossiers pour les pages manquantes dans le conteneur..."

# Démarrer un conteneur temporaire pour modifier les fichiers
echo "Exécution d'un conteneur temporaire pour modifier les fichiers..."
docker run -d --name temp-container -v /Users/d972/dtahc-project/packages/frontend/app:/src dtahc-next:latest sleep 3600

# Créer les dossiers manquants
docker exec temp-container mkdir -p /app/packages/frontend/.next/server/app/clients
docker exec temp-container mkdir -p /app/packages/frontend/.next/server/app/admin
docker exec temp-container mkdir -p /app/packages/frontend/.next/server/app/communication

# Copier les fichiers compilés de dashboard comme base
docker exec temp-container cp /app/packages/frontend/.next/server/app/dashboard.html /app/packages/frontend/.next/server/app/clients.html
docker exec temp-container cp /app/packages/frontend/.next/server/app/dashboard.meta /app/packages/frontend/.next/server/app/clients.meta
docker exec temp-container cp /app/packages/frontend/.next/server/app/dashboard.rsc /app/packages/frontend/.next/server/app/clients.rsc

docker exec temp-container cp /app/packages/frontend/.next/server/app/dashboard.html /app/packages/frontend/.next/server/app/admin.html
docker exec temp-container cp /app/packages/frontend/.next/server/app/dashboard.meta /app/packages/frontend/.next/server/app/admin.meta
docker exec temp-container cp /app/packages/frontend/.next/server/app/dashboard.rsc /app/packages/frontend/.next/server/app/admin.rsc

docker exec temp-container cp /app/packages/frontend/.next/server/app/dashboard.html /app/packages/frontend/.next/server/app/communication.html
docker exec temp-container cp /app/packages/frontend/.next/server/app/dashboard.meta /app/packages/frontend/.next/server/app/communication.meta
docker exec temp-container cp /app/packages/frontend/.next/server/app/dashboard.rsc /app/packages/frontend/.next/server/app/communication.rsc

# Copier les fichiers du conteneur temporaire vers une image
echo "Créant une nouvelle image avec les pages ajoutées..."
docker commit temp-container dtahc-next:fixed

# Arrêter et supprimer le conteneur temporaire
docker stop temp-container
docker rm temp-container

# Redémarrer le conteneur frontend avec la nouvelle image
echo "Redémarrage du conteneur frontend avec la nouvelle image..."
docker run -d --name dtahc-frontend --network dtahc-network -p 3000:3000 dtahc-next:fixed

echo "Terminé! Les pages devraient maintenant être accessibles."