#!/bin/bash

# Script simplifié pour pousser le projet vers GitHub avec force
# ATTENTION: Cela supprimera tout l'historique existant sur le dépôt distant !

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  ATTENTION: Ce script va écraser le contenu du dépôt GitHub existant !${NC}"
echo -e "${YELLOW}⚠️  Toutes les données et l'historique existants seront supprimés !${NC}"
echo

echo -e "${CYAN}Vérification du dépôt distant...${NC}"
REPO_URL=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$REPO_URL" ]; then
    echo -e "${RED}Aucun dépôt distant 'origin' n'est configuré.${NC}"
    echo -e "${RED}Veuillez configurer le dépôt distant avant de continuer.${NC}"
    exit 1
else
    echo -e "${GREEN}Dépôt distant déjà configuré: $REPO_URL${NC}"
fi

echo -e "${CYAN}Poussée forcée vers GitHub...${NC}"
git push -f origin main

echo -e "${CYAN}Configuration de la branche par défaut...${NC}"
git branch --set-upstream-to=origin/main main

echo -e "${GREEN}✅ Dépôt GitHub réinitialisé avec succès !${NC}"
echo -e "${GREEN}✅ Les nouvelles modifications ont été poussées sur la branche main.${NC}"
echo
echo -e "${CYAN}Prochaines étapes :${NC}"
echo -e "1. Activez GitHub Pages dans les paramètres du dépôt"
echo -e "2. Configurez la source comme 'GitHub Actions'"
echo -e "3. Vérifiez que les workflows GitHub Actions fonctionnent correctement"
echo

exit 0