# Prompts pour la préparation de l'environnement DTAHC

Ce document contient les prompts à utiliser avec Claude Code pour configurer votre environnement de développement local identique à l'environnement de production.

## 1. Configuration initiale de la machine locale

```
Je suis David, gérant de DTAHC (bureau d'étude en architecture spécialisé dans les autorisations de travaux). Je souhaite configurer mon environnement de développement local pour mon projet DTAHC.

Mon serveur de production est un Ubuntu 24.04 avec:
- Node.js
- Docker et Docker Compose
- PostgreSQL
- Redis
- MinIO (compatible S3)
- NGINX

Peux-tu me fournir un script bash complet pour configurer mon environnement local Ubuntu/Debian de manière identique? Je veux installer toutes les dépendances nécessaires au développement.

Assure-toi d'inclure:
- Installation de Git
- Installation de Docker et Docker Compose
- Installation de Node.js via NVM (dernière version LTS)
- Installation des outils CLI (TypeScript, NestJS CLI, etc.)
- Configuration des permissions Docker
- Configuration Git globale

Présente ce script étape par étape avec des explications claires.
```

## 2. Configuration Git et GitHub

```
Je dois configurer Git et GitHub pour mon projet DTAHC. J'ai déjà un dépôt GitHub à l'adresse git@github.com:DTAHC/dtahc-project.git.

Peux-tu me guider à travers les étapes suivantes:

1. Génération d'une clé SSH pour GitHub
2. Ajout de la clé SSH à mon compte GitHub
3. Configuration de Git en local avec mon nom et email
4. Clone du dépôt existant ou initialisation d'un nouveau si nécessaire
5. Configuration des branches (main pour production, develop pour développement)
6. Bonne configuration du .gitignore pour un projet TypeScript avec NestJS et Next.js

Fournis-moi les commandes exactes à exécuter à chaque étape et explique pourquoi chaque étape est importante.
```

## 3. Préparation de la structure du projet

```
Je vais utiliser une structure monorepo pour mon projet DTAHC avec TypeScript, NestJS pour le backend et Next.js pour le frontend. J'ai besoin de créer la structure de base du projet.

Peux-tu me donner les commandes exactes pour:

1. Initialiser un monorepo avec npm workspaces
2. Mettre en place la structure de dossiers recommandée:
   - packages/backend (NestJS)
   - packages/frontend (Next.js)
   - packages/shared (code partagé)
3. Initialiser les projets NestJS et Next.js avec TypeScript
4. Configurer tsconfig.json pour chaque projet et à la racine
5. Configurer les scripts de développement, build et test dans les package.json
6. Installer les dépendances communes et spécifiques

L'application utilisera PostgreSQL avec Prisma, authentification JWT, et Socket.IO pour le temps réel. Les configs doivent refléter ces choix technologiques.
```

## 4. Configuration Docker pour développement

```
Je veux configurer Docker et Docker Compose pour mon environnement de développement DTAHC, qui doit être identique à la production.

Peux-tu me fournir:

1. Un Dockerfile pour le backend NestJS
2. Un Dockerfile pour le frontend Next.js
3. Un docker-compose.yml complet incluant:
   - Service backend
   - Service frontend
   - PostgreSQL
   - Redis
   - MinIO
   - NGINX comme reverse proxy
4. Les fichiers de configuration NGINX nécessaires
5. Les volumes pour la persistance des données
6. Les variables d'environnement à configurer

Le tout doit fonctionner en développement avec hot reload, et être facile à adapter pour la production.

Explique-moi aussi comment lancer et arrêter l'environnement, et comment vérifier que tout fonctionne correctement.
```

## 5. Configuration Prisma avec PostgreSQL

```
Je dois configurer Prisma ORM pour mon projet DTAHC backend (NestJS) afin de gérer la base de données PostgreSQL.

Peux-tu me guider à travers:

1. L'installation de Prisma dans le projet NestJS
2. La création du schéma Prisma initial avec les modèles suivants:
   - User (admin, comptable, gestion, production, pro)
   - Client
   - Dossier (avec workflow et étapes)
   - Document
   - Task
   - Invoice
3. La configuration de la connexion à PostgreSQL via Docker
4. La création des migrations initiales
5. La génération du client Prisma
6. L'intégration de Prisma dans NestJS (service, module)

Fournis le code complet pour schema.prisma et explique comment structurer les relations entre les entités.
```

## 6. Configuration GitHub Actions pour CI/CD

```
Je veux mettre en place un pipeline CI/CD avec GitHub Actions pour mon projet DTAHC. Le workflow devrait:

1. Être déclenché sur push sur main (prod) et develop (staging)
2. Lancer les tests
3. Construire les images Docker
4. Déployer sur le serveur approprié

Peux-tu me fournir:

1. Le fichier workflow GitHub Actions complet (.github/workflows/ci-cd.yml)
2. Les secrets GitHub à configurer
3. Le script de déploiement à exécuter sur le serveur
4. La configuration pour les environnements staging et production

Le serveur de production est un Ubuntu 24.04 avec Docker installé (IP: 82.165.42.244). 
Le domaine de production est autorisations.fr.

Explique comment tester le pipeline et vérifier que le déploiement a fonctionné.
```

## 7. Configuration de l'environnement de développement VS Code

```
Pour faciliter le développement, je veux configurer VS Code de manière optimale pour mon projet DTAHC (TypeScript, NestJS, Next.js).

Peux-tu me fournir:

1. La liste des extensions VS Code essentielles pour ce stack
2. Les fichiers de configuration recommandés:
   - settings.json
   - launch.json (pour le débogage)
   - tasks.json
3. Les snippets utiles pour TypeScript, NestJS et React
4. La configuration ESLint et Prettier
5. Comment configurer IntelliSense pour maximiser la productivité

Explique chaque extension et configuration pour que je comprenne leur utilité.
```

## 8. Synchronisation environnement local et production

```
J'ai besoin de mettre en place un processus pour garder mon environnement local synchronisé avec la production.

Peux-tu me fournir:

1. Un script pour extraire une copie de la base de données de production et l'importer en local
2. Une méthode pour synchroniser les fichiers stockés dans MinIO
3. Une stratégie pour tester les migrations de base de données avant déploiement
4. Comment gérer les secrets et variables d'environnement de manière sécurisée
5. Une checklist pour vérifier que mon environnement local est correctement synchronisé

Tout cela doit être sécurisé et préserver la confidentialité des données clients.
```

## 9. Vérification de l'environnement

```
Mon environnement local DTAHC est maintenant configuré. J'ai besoin d'un script ou d'une série de commandes pour vérifier que tout est correctement installé et configuré.

Peux-tu me fournir:

1. Un script bash qui vérifie que toutes les dépendances requises sont installées et à la bonne version
2. Des commandes pour tester la connexion à PostgreSQL, Redis et MinIO
3. Comment vérifier que Docker et Docker Compose fonctionnent correctement
4. Comment tester que le hot reload fonctionne pour backend et frontend
5. Comment vérifier que la communication entre services fonctionne

Le script devrait produire un rapport clair indiquant ce qui est correctement configuré et ce qui nécessite attention.
```