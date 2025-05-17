#!/bin/bash

# Script de migration pour le projet DTAHC
# Déplace les composants React vers Next.js et met à jour les fichiers Docker

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}====== Migration du projet DTAHC vers Next.js ======${NC}"
echo

# 1. Créer des répertoires de sauvegarde
echo -e "${YELLOW}Création des répertoires de sauvegarde...${NC}"
mkdir -p /Users/d972/dtahc-project/backup
mkdir -p /Users/d972/dtahc-project/backup/src
mkdir -p /Users/d972/dtahc-project/backup/docker

# 2. Sauvegarder les fichiers existants
echo -e "${YELLOW}Sauvegarde des fichiers existants...${NC}"
cp -r /Users/d972/dtahc-project/src/* /Users/d972/dtahc-project/backup/src/
cp /Users/d972/dtahc-project/docker/Dockerfile.frontend /Users/d972/dtahc-project/backup/docker/
cp /Users/d972/dtahc-project/docker/docker-compose.yml /Users/d972/dtahc-project/backup/docker/

# 3. Mettre à jour les fichiers Docker
echo -e "${YELLOW}Mise à jour des fichiers Docker...${NC}"
mv /Users/d972/dtahc-project/docker/Dockerfile.frontend.new /Users/d972/dtahc-project/docker/Dockerfile.frontend
mv /Users/d972/dtahc-project/docker/docker-compose.yml.new /Users/d972/dtahc-project/docker/docker-compose.yml

# 4. Vérifier si la page Comptable existe dans Next.js
echo -e "${YELLOW}Vérification des composants existants dans Next.js...${NC}"
if [ -f "/Users/d972/dtahc-project/packages/frontend/app/comptable/page.tsx" ]; then
    echo -e "${GREEN}Page comptable Next.js trouvée.${NC}"
else
    echo -e "${RED}Page comptable Next.js non trouvée. Veuillez vérifier manuellement.${NC}"
fi

# 5. Afficher un message de résumé et instructions
echo
echo -e "${GREEN}=== Migration terminée ====${NC}"
echo -e "${YELLOW}Pour terminer la migration:${NC}"
echo "1. Arrêtez les conteneurs Docker s'ils sont en cours d'exécution:"
echo "   docker-compose -f /Users/d972/dtahc-project/docker/docker-compose.yml down"
echo
echo "2. Démarrez les nouveaux conteneurs Docker avec Next.js:"
echo "   docker-compose -f /Users/d972/dtahc-project/docker/docker-compose.yml up -d"
echo
echo "3. Une sauvegarde des fichiers originaux a été créée dans:"
echo "   /Users/d972/dtahc-project/backup/"
echo
echo -e "${RED}Remarque importante:${NC} Les URL et fonctionnalités peuvent avoir changé. Veuillez tester soigneusement après la migration."
echo

# 6. Informations sur Next.js et TailwindCSS
echo -e "${BLUE}=== Informations sur la stack technologique ====${NC}"
echo "Frontend: Next.js 14+ avec TailwindCSS"
echo "Backend: NestJS avec Prisma ORM"
echo
echo -e "${YELLOW}Documentation Next.js:${NC} https://nextjs.org/docs"
echo -e "${YELLOW}Documentation TailwindCSS:${NC} https://tailwindcss.com/docs"