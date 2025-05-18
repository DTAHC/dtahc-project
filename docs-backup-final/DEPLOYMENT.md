# Guide de Déploiement

Ce document explique comment déployer l'application DTAHC sur un environnement de production.

## Prérequis

- Accès SSH au serveur de production
- Clé SSH configurée pour l'accès au serveur
- Git installé sur la machine locale
- Docker et Docker Compose installés sur le serveur

## Configuration SSH

Assurez-vous que votre clé SSH est correctement configurée pour accéder au serveur :

```bash
# Générer une nouvelle clé SSH si nécessaire
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_server

# Ajouter la clé au serveur
ssh-copy-id -i ~/.ssh/id_rsa_server root@82.165.42.244
```

## Déploiement avec le script automatisé

Un script de déploiement automatisé est disponible dans le répertoire `scripts/deploy-server.sh`. Ce script effectue les opérations suivantes :

1. Sauvegarde de l'installation existante (si présente)
2. Clonage du dépôt Git
3. Configuration des variables d'environnement
4. Installation des dépendances
5. Construction du projet
6. Démarrage des conteneurs Docker
7. Application des migrations de base de données
8. Initialisation des données de démonstration
9. Vérification du déploiement

Pour lancer le déploiement :

```bash
# Rendre le script exécutable
chmod +x /Users/d972/dtahc-project/scripts/deploy-server.sh

# Exécuter le script
/Users/d972/dtahc-project/scripts/deploy-server.sh
```

## Configuration post-déploiement

### Configuration Nginx

Après le déploiement, configurez Nginx pour exposer l'application :

```bash
# Créer une configuration Nginx
cat > /etc/nginx/sites-available/dtahc.conf << 'EOL'
server {
    listen 80;
    server_name dtahc.fr www.dtahc.fr;

    # Redirection vers HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name dtahc.fr www.dtahc.fr;

    # Configuration SSL
    ssl_certificate /etc/letsencrypt/live/dtahc.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dtahc.fr/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOL

# Activer la configuration
ln -s /etc/nginx/sites-available/dtahc.conf /etc/nginx/sites-enabled/

# Tester la configuration
nginx -t

# Redémarrer Nginx
systemctl restart nginx
```

### Configuration SSL avec Let's Encrypt

```bash
# Installer Certbot
apt-get update
apt-get install certbot python3-certbot-nginx

# Obtenir un certificat SSL
certbot --nginx -d dtahc.fr -d www.dtahc.fr
```

### Configuration de la sauvegarde automatique

Créez un script de sauvegarde automatique pour la base de données :

```bash
# Créer un script de sauvegarde
cat > /root/backup-db.sh << 'EOL'
#!/bin/bash

TIMESTAMP=$(date +%Y%m%d%H%M%S)
BACKUP_DIR="/var/backup/dtahc"
PROJECT_DIR="/var/www/dtahc-project"

# Sauvegarde de la base de données
docker exec dtahc-project_postgres_1 pg_dump -U postgres dtahc_db > $BACKUP_DIR/dtahc_db_$TIMESTAMP.sql

# Compression de la sauvegarde
gzip $BACKUP_DIR/dtahc_db_$TIMESTAMP.sql

# Nettoyage des sauvegardes anciennes (plus de 30 jours)
find $BACKUP_DIR -name "dtahc_db_*.sql.gz" -type f -mtime +30 -delete
EOL

# Rendre le script exécutable
chmod +x /root/backup-db.sh

# Configurer une tâche cron pour la sauvegarde quotidienne
(crontab -l 2>/dev/null; echo "0 2 * * * /root/backup-db.sh") | crontab -
```

## Monitoring et maintenance

### Vérification de l'état des conteneurs

```bash
# Voir l'état des conteneurs
docker ps

# Voir les logs des conteneurs
docker logs dtahc-project_backend_1
docker logs dtahc-project_frontend_1
```

### Redémarrer les services

```bash
cd /var/www/dtahc-project
npm run docker:restart
```

### Mise à jour de l'application

Pour mettre à jour l'application, réexécutez simplement le script de déploiement :

```bash
/Users/d972/dtahc-project/scripts/deploy-server.sh
```

## Résolution des problèmes

### Problèmes de connexion à la base de données

Vérifiez que les conteneurs sont en cours d'exécution et que la base de données est accessible :

```bash
# Vérifier l'état des conteneurs
docker ps | grep postgres

# Tester la connexion à la base de données
docker exec -it dtahc-project_postgres_1 psql -U postgres -d dtahc_db -c "\l"
```

### Problèmes d'accès à l'API

Vérifiez les logs de l'API pour identifier les erreurs potentielles :

```bash
docker logs dtahc-project_backend_1
```

### Problèmes de certificat SSL

Vérifiez l'état des certificats SSL et renouvelez-les si nécessaire :

```bash
certbot certificates
certbot renew --dry-run
```