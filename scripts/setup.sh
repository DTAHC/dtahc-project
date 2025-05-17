#!/bin/bash

# Script d'initialisation du projet DTAHC
# À exécuter lors de la première installation

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}=== Configuration initiale du projet DTAHC ===${NC}\n"

# Vérifier les prérequis
echo -e "${CYAN}Vérification des prérequis...${NC}"

# Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js n'est pas installé. Veuillez l'installer avant de continuer.${NC}"
    exit 1
fi

# npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm n'est pas installé. Veuillez l'installer avant de continuer.${NC}"
    exit 1
fi

# Docker (optionnel)
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker n'est pas installé. Il n'est pas requis pour le développement local, mais recommandé.${NC}"
else
    echo -e "${GREEN}Docker détecté.${NC}"
fi

echo -e "${GREEN}Prérequis validés.${NC}\n"

# Installation des dépendances
echo -e "${CYAN}Installation des dépendances...${NC}"
npm install
echo -e "${GREEN}Dépendances installées avec succès.${NC}\n"

# Configuration de Husky
echo -e "${CYAN}Configuration de Husky pour les hooks Git...${NC}"
npm run prepare
chmod +x .husky/pre-commit
echo -e "${GREEN}Husky configuré.${NC}\n"

# Génération des clients Prisma
echo -e "${CYAN}Génération des clients Prisma...${NC}"
npm run db:generate
echo -e "${GREEN}Clients Prisma générés.${NC}\n"

# Migration des données de référence
echo -e "${CYAN}Migration des données de référence...${NC}"
npm run migrate:data
echo -e "${GREEN}Données de référence migrées.${NC}\n"

# Vérification de l'environnement complet
echo -e "${CYAN}Vérification finale de l'environnement...${NC}"
npm run check:env
echo -e "${GREEN}Environnement vérifié.${NC}\n"

# Affichage des instructions finales
echo -e "${CYAN}=== Installation terminée avec succès ===${NC}\n"
echo -e "Pour démarrer le projet en mode développement, exécutez:"
echo -e "${GREEN}npm run dev${NC}\n"

echo -e "Pour démarrer les services Docker (PostgreSQL, MinIO):"
echo -e "${GREEN}npm run docker:up${NC}\n"

echo -e "Consultez le fichier README.md pour plus d'informations."
echo -e "Consultez le fichier DEVELOPMENT.md pour les détails sur les environnements de développement."
echo -e "Consultez le fichier CLAUDE.md pour le suivi du développement."

exit 0