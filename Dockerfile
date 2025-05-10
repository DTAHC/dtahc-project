# Utiliser une image Node.js officielle comme base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Métadonnées du conteneur
LABEL maintainer="DTAHC <dev@dtahc.fr>"
LABEL version="1.0.0"
LABEL description="Application DTAHC pour la gestion de dossiers clients"

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Installer les dépendances nécessaires
RUN apk add --no-cache dumb-init python3 make g++ gcc

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances de production uniquement
RUN npm ci --only=production

# Copier le code source de l'application
COPY . .

# Créer les répertoires nécessaires avec les bons permissions
RUN mkdir -p logs uploads \
    && chown -R node:node /app

# Changer l'utilisateur pour des raisons de sécurité
USER node

# Exposer le port utilisé par l'application
EXPOSE 3000

# Utiliser dumb-init comme point d'entrée
ENTRYPOINT ["dumb-init", "--"]

# Commande par défaut pour démarrer l'application
CMD ["node", "src/index.js"]