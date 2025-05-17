# Informations d'accès et sécurité DTAHC

Ce document contient les informations d'accès essentielles pour le projet DTAHC. **GARDEZ CE FICHIER SÉCURISÉ ET NE LE PARTAGEZ JAMAIS SUR GITHUB**.

## 🔐 Accès serveur production

```
Serveur: 82.165.42.244
Utilisateur: root
Méthode d'accès: SSH avec clé (ne pas utiliser de mot de passe)
Commande d'accès: ssh -i ~/.ssh/id_rsa_server root@82.165.42.244
URL production: http://autorisations.fr
```

## 📊 Accès base de données production

```
Type: PostgreSQL
Port: 5432
Base de données: dtahc_prod
Utilisateur: dtahc_admin
Mot de passe: [À CONFIGURER ET NE JAMAIS STOCKER ICI]
```

## 📁 Accès stockage MinIO production

```
Endpoint: https://storage.autorisations.fr
Access Key: [À CONFIGURER ET NE JAMAIS STOCKER ICI]
Secret Key: [À CONFIGURER ET NE JAMAIS STOCKER ICI]
```

## 🔄 Accès dépôt Git

```
Dépôt GitHub: git@github.com:DTAHC/dtahc-project.git
```

## 🚀 Instructions de déploiement

1. Les secrets de production doivent être configurés dans GitHub Actions
2. Ne jamais stocker d'informations d'identification dans le code source
3. Utiliser `.env.example` pour documenter les variables nécessaires, sans les valeurs
4. Toujours vérifier l'absence d'informations sensibles avant un commit

## 🛡️ Bonnes pratiques de sécurité

### Configuration des accès

1. **Clés SSH**: Utiliser des clés SSH avec passphrase; ne jamais stocker les clés privées dans le dépôt
2. **Secrets GitHub**: Configurer tous les secrets dans GitHub et non dans les fichiers
3. **Rotation des clés**: Changer les identifiants régulièrement

### Variables d'environnement

Pour le développement local, créer un fichier `.env.local` basé sur `.env.example`:

```bash
# Exemple pour le backend
DATABASE_URL=postgresql://user:password@localhost:5432/dtahc_dev
JWT_SECRET=your_local_development_secret
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

### Configuration GitHub Actions

Les secrets suivants doivent être configurés dans GitHub Actions:

```
PROD_SSH_KEY - Clé SSH privée pour le serveur de production
PROD_HOST - Adresse IP du serveur (82.165.42.244)
PROD_USER - Utilisateur SSH (root)
DATABASE_URL_PROD - URL de la base de données de production
JWT_SECRET_PROD - Secret JWT pour la production
MINIO_ACCESS_KEY_PROD - Clé d'accès MinIO pour la production
MINIO_SECRET_KEY_PROD - Clé secrète MinIO pour la production
```

## 🔍 Vérification avant déploiement

Avant chaque déploiement en production:

1. Exécuter `npm run lint` et `npm run test` pour tous les packages
2. Vérifier l'absence de secrets dans le code
3. Tester les migrations de base de données sur un environnement de staging
4. Vérifier que les sauvegardes récentes sont disponibles

## 🆘 Procédures d'urgence

### Rollback rapide

En cas de problème après déploiement:

```bash
# Se connecter au serveur
ssh -i ~/.ssh/id_rsa_server root@82.165.42.244

# Revenir à l'image Docker précédente
cd /opt/dtahc
docker-compose pull backend:previous frontend:previous
docker-compose up -d
```

### Restauration de base de données

```bash
# Se connecter au serveur
ssh -i ~/.ssh/id_rsa_server root@82.165.42.244

# Restaurer depuis la dernière sauvegarde
cd /opt/dtahc/backups
./restore.sh latest.sql
```

## ⚠️ IMPORTANT

**NE JAMAIS PARTAGER CE FICHIER OU SON CONTENU**

Toutes les informations d'identification réelles doivent être stockées dans un gestionnaire de mots de passe sécurisé et partagées uniquement avec les personnes autorisées. Ce fichier sert uniquement de référence pour les types d'informations nécessaires.

Pour toute question sur l'accès, contacter l'administrateur système.