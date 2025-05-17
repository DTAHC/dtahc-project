#!/bin/bash

# Script de déploiement sur le serveur de production
# Ce script sauvegarde le contenu existant, clone le dépôt Git, 
# et configure l'environnement sur le serveur

# Paramètres
SERVER_HOST="82.165.42.244"
SERVER_USER="root"
SSH_KEY="~/.ssh/id_rsa_server"
WEB_DIR="/var/www"
PROJECT_NAME="dtahc-project"
BACKUP_DIR="/var/backups/dtahc"
GIT_REPO="git@github.com:DTAHC/dtahc-project.git"
GIT_BRANCH="main"
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Fonction pour exécuter des commandes sur le serveur distant
run_remote() {
    ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST "$1"
}

# Afficher le début du déploiement
echo "🚀 Déploiement de $PROJECT_NAME sur $SERVER_HOST"
echo "------------------------------------------------"

# 1. Créer le répertoire de sauvegarde s'il n'existe pas
echo "📦 Préparation de la sauvegarde..."
run_remote "mkdir -p $BACKUP_DIR"

# 2. Vérifier si le projet existe déjà et le sauvegarder
if run_remote "[ -d $WEB_DIR/$PROJECT_NAME ]"; then
    echo "💾 Sauvegarde du contenu existant..."
    run_remote "tar -czf $BACKUP_DIR/$PROJECT_NAME-backup-$TIMESTAMP.tar.gz -C $WEB_DIR $PROJECT_NAME && echo 'Sauvegarde terminée : $BACKUP_DIR/$PROJECT_NAME-backup-$TIMESTAMP.tar.gz'"
    echo "🗑️ Suppression du contenu existant..."
    run_remote "rm -rf $WEB_DIR/$PROJECT_NAME"
else
    echo "ℹ️ Aucun contenu existant à sauvegarder"
fi

# 3. Cloner le dépôt Git
echo "⬇️ Clonage du dépôt Git ($GIT_BRANCH)..."
run_remote "git clone -b $GIT_BRANCH $GIT_REPO $WEB_DIR/$PROJECT_NAME"

# 4. Configuration de l'environnement
echo "⚙️ Configuration de l'environnement..."
# Création du fichier .env pour le backend
run_remote "cat > $WEB_DIR/$PROJECT_NAME/packages/backend/.env << 'EOL'
# Environment variables
NODE_ENV=production

# Database
DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/dtahc_db\"

# JWT
JWT_SECRET=\"dtahc-production-secret-key-$(openssl rand -hex 12)\"
JWT_EXPIRATION=\"1d\"
JWT_REFRESH_EXPIRATION=\"7d\"

# MinIO Configuration for document storage
MINIO_ENDPOINT=\"localhost\"
MINIO_PORT=9000
MINIO_ACCESS_KEY=\"minioadmin\"
MINIO_SECRET_KEY=\"minioadmin\"
MINIO_USE_SSL=false
MINIO_BUCKET=\"dtahc-documents\"

# API
API_PORT=3001
API_PREFIX=\"/api\"
ALLOWED_ORIGINS=\"https://dtahc.fr,http://localhost:3000\"
EOL"

# 5. Installation des dépendances
echo "📥 Installation des dépendances..."
run_remote "cd $WEB_DIR/$PROJECT_NAME && npm install"

# 6. Construction du projet
echo "🔨 Construction du projet..."
run_remote "cd $WEB_DIR/$PROJECT_NAME && npm run build"

# 7. Démarrage des conteneurs Docker
echo "🐳 Démarrage des conteneurs Docker..."
run_remote "cd $WEB_DIR/$PROJECT_NAME && npm run docker:up"

# 8. Vérification finale
echo "✅ Vérification du déploiement..."
run_remote "docker ps --format 'table {{.Names}}\t{{.Status}}'"
run_remote "curl -s http://localhost:3001/api/health || echo 'API non accessible'"
run_remote "curl -s http://localhost:3000 -o /dev/null -w 'Frontend Status: %{http_code}\\n' || echo 'Frontend non accessible'"

echo ""
echo "🎉 Déploiement terminé avec succès !"
echo "------------------------------------------------"
echo "📝 Prochaines étapes :"
echo "1. Configurer le serveur web (Nginx/Apache) pour exposer l'application"
echo "2. Configurer les certificats SSL"
echo "3. Mettre en place une sauvegarde automatique de la base de données"
echo "4. Configurer le monitoring"
echo ""