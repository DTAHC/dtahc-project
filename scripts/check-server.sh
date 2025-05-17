#!/bin/bash

# Script de vérification du serveur pour le déploiement
# À exécuter sur le serveur distant pour vérifier l'environnement

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}=== Vérification de l'environnement serveur DTAHC ===${NC}\n"

# Vérifier les prérequis serveur
echo -e "${CYAN}Vérification des prérequis...${NC}"

# Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker n'est pas installé. Il est requis pour le déploiement.${NC}"
    echo -e "${YELLOW}Installez Docker avec: curl -fsSL https://get.docker.com | sh${NC}"
    exit 1
else
    echo -e "${GREEN}Docker est installé: $(docker --version)${NC}"
fi

# Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose n'est pas installé. Il est requis pour le déploiement.${NC}"
    echo -e "${YELLOW}Installez Docker Compose avec: curl -L \"https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose${NC}"
    exit 1
else
    echo -e "${GREEN}Docker Compose est installé: $(docker-compose --version)${NC}"
fi

# Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git n'est pas installé. Il est recommandé pour le déploiement.${NC}"
    echo -e "${YELLOW}Installez Git avec: apt-get update && apt-get install -y git${NC}"
else
    echo -e "${GREEN}Git est installé: $(git --version)${NC}"
fi

# Vérifier l'espace disque
echo -e "\n${CYAN}Vérification de l'espace disque...${NC}"
df_output=$(df -h / | tail -n 1)
disk_usage=$(echo $df_output | awk '{print $5}' | tr -d '%')
available_space=$(echo $df_output | awk '{print $4}')

if [ "$disk_usage" -gt 90 ]; then
    echo -e "${RED}Attention: L'espace disque est presque plein ($disk_usage%). Disponible: $available_space${NC}"
else
    echo -e "${GREEN}Espace disque disponible: $available_space (Utilisation: $disk_usage%)${NC}"
fi

# Vérifier la mémoire
echo -e "\n${CYAN}Vérification de la mémoire...${NC}"
total_mem=$(free -m | awk '/^Mem:/{print $2}')
available_mem=$(free -m | awk '/^Mem:/{print $7}')

if [ "$available_mem" -lt 1024 ]; then
    echo -e "${YELLOW}Attention: Moins de 1 Go de mémoire disponible ($available_mem Mo)${NC}"
else
    echo -e "${GREEN}Mémoire disponible: $available_mem Mo sur $total_mem Mo${NC}"
fi

# Vérifier les ports
echo -e "\n${CYAN}Vérification des ports requis...${NC}"
required_ports=(80 443 3000 3001 5432 9000 9001)

for port in "${required_ports[@]}"; do
    if netstat -tuln | grep -q ":$port "; then
        echo -e "${YELLOW}Attention: Le port $port est déjà utilisé${NC}"
    else
        echo -e "${GREEN}Port $port disponible${NC}"
    fi
done

# Vérifier les certificats SSL (si déployé en production)
if [ -d "/etc/letsencrypt/live" ]; then
    echo -e "\n${CYAN}Vérification des certificats SSL...${NC}"
    for domain in $(ls /etc/letsencrypt/live); do
        if [ -f "/etc/letsencrypt/live/$domain/fullchain.pem" ]; then
            expiry=$(openssl x509 -enddate -noout -in "/etc/letsencrypt/live/$domain/fullchain.pem" | cut -d= -f 2)
            echo -e "${GREEN}Certificat pour $domain expire le: $expiry${NC}"
        fi
    done
fi

# Recommandations finales
echo -e "\n${CYAN}=== Recommandations pour le déploiement ===${NC}"
echo -e "1. Créez un fichier .env avec les configurations appropriées pour l'environnement de production"
echo -e "2. Configurez les volumes Docker dans /var/docker/dtahc-data pour la persistance des données"
echo -e "3. Configurez un service systemd pour le redémarrage automatique des conteneurs"
echo -e "4. Mettez en place une sauvegarde automatique de la base de données et des fichiers"
echo -e "5. Configurez un certificat SSL Let's Encrypt pour HTTPS\n"

echo -e "${GREEN}Vérification terminée.${NC}"