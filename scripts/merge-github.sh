#!/bin/bash

# Script pour récupérer l'ancien projet GitHub et le fusionner avec le nouveau
# Cette approche conserve l'historique existant

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TEMP_DIR="/tmp/dtahc-old-project"

echo -e "${CYAN}Ce script va récupérer l'ancien projet et le comparer avec le nouveau.${NC}"
echo -e "${CYAN}Vous pourrez ensuite décider comment procéder.${NC}"

# Vérification du dépôt distant
REPO_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$REPO_URL" ]; then
    echo -e "${RED}Aucun dépôt distant 'origin' n'est configuré.${NC}"
    read -p "Veuillez entrer l'URL du dépôt GitHub (ex: git@github.com:DTAHC/dtahc-project.git): " REPO_URL
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}Dépôt distant 'origin' configuré avec succès: $REPO_URL${NC}"
else
    echo -e "${GREEN}Dépôt distant déjà configuré: $REPO_URL${NC}"
fi

echo -e "${CYAN}Création d'une sauvegarde du projet actuel...${NC}"
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
BACKUP_BRANCH="backup-$(date +%Y%m%d%H%M%S)"
git branch "$BACKUP_BRANCH"
echo -e "${GREEN}Sauvegarde créée dans la branche $BACKUP_BRANCH${NC}"

echo -e "${CYAN}Récupération de l'ancien projet depuis GitHub...${NC}"
if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi
mkdir -p "$TEMP_DIR"

# Clone du dépôt distant dans un répertoire temporaire
git clone "$REPO_URL" "$TEMP_DIR"
cd "$TEMP_DIR"

echo -e "${CYAN}Branches distantes disponibles :${NC}"
git branch -r

echo -e "${YELLOW}Options disponibles :${NC}"
echo -e "1. Fusionner l'ancien projet dans le nouveau (conserver les deux historiques)"
echo -e "2. Créer une nouvelle branche à partir de l'ancien projet (conserver séparément)"
echo -e "3. Annuler et revenir au projet actuel"

read -p "Choisissez une option (1-3): " option

case $option in
    1)
        echo -e "${CYAN}Préparation de la fusion...${NC}"
        cd - > /dev/null # Retour au répertoire original
        git remote add old-project "$TEMP_DIR"
        git fetch old-project
        
        echo -e "${CYAN}Création d'une branche de fusion...${NC}"
        MERGE_BRANCH="merge-$(date +%Y%m%d%H%M%S)"
        git checkout -b "$MERGE_BRANCH"
        
        echo -e "${YELLOW}Tentative de fusion de l'ancien projet...${NC}"
        if git merge old-project/main --allow-unrelated-histories; then
            echo -e "${GREEN}Fusion réussie ! Résolvez les conflits éventuels, puis validez avec 'git commit'.${NC}"
            echo -e "${GREEN}Vous pouvez ensuite pousser le résultat avec 'git push origin $MERGE_BRANCH'${NC}"
        else
            echo -e "${YELLOW}Des conflits de fusion sont apparus. Vous devez les résoudre manuellement.${NC}"
            echo -e "${YELLOW}Après avoir résolu les conflits, utilisez 'git add .' puis 'git commit'${NC}"
        fi
        ;;
    2)
        echo -e "${CYAN}Création d'une nouvelle branche à partir de l'ancien projet...${NC}"
        cd - > /dev/null # Retour au répertoire original
        git remote add old-project "$TEMP_DIR"
        git fetch old-project
        
        LEGACY_BRANCH="old-project"
        git checkout -b "$LEGACY_BRANCH" old-project/main
        
        echo -e "${GREEN}Branche $LEGACY_BRANCH créée à partir de l'ancien projet.${NC}"
        echo -e "${GREEN}Vous pouvez maintenant basculer entre les branches avec 'git checkout'.${NC}"
        echo -e "${GREEN}Pour revenir à votre projet actuel: git checkout $CURRENT_BRANCH${NC}"
        ;;
    3)
        echo -e "${GREEN}Opération annulée. Retour au projet actuel.${NC}"
        cd - > /dev/null # Retour au répertoire original
        ;;
    *)
        echo -e "${RED}Option non valide. Opération annulée.${NC}"
        cd - > /dev/null # Retour au répertoire original
        ;;
esac

echo -e "${CYAN}Nettoyage...${NC}"
if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi

if [ "$option" != "3" ] && [ "$option" != "2" ]; then
    git remote remove old-project 2>/dev/null || true
fi

echo -e "${GREEN}Terminé !${NC}"
exit 0