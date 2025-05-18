# Guide de développement DTAHC

> ⚠️ **IMPORTANT**: Avant de commencer, consultez le fichier STANDARDS.md qui définit les règles du projet pour éviter les doubles implémentations et autres problèmes.

Ce document décrit les environnements de développement et production pour le projet DTAHC, ainsi que les procédures pour assurer la cohérence entre les environnements.

## Environnements

### Environnement local

L'environnement local est configuré pour le développement et les tests. Il doit être identique à l'environnement de production pour éviter les problèmes de compatibilité.

#### Configuration requise

- Node.js 18+
- npm 8+
- PostgreSQL 14+
- Docker et Docker Compose (optionnel pour le développement local)

#### Structure des répertoires

```
dtahc-project/
├── packages/
│   ├── backend/        # API NestJS
│   ├── frontend/       # Application Next.js
│   └── shared/         # Types et utilitaires partagés
├── docker/             # Configuration Docker
├── docs/               # Documentation
├── scripts/            # Scripts utilitaires
└── ...
```

#### Installation

1. Cloner le dépôt Git
```bash
git clone git@github.com:DTAHC/dtahc-project.git
cd dtahc-project
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
   - Copier le fichier `.env.example` vers `.env` dans le dossier `packages/backend`
   - Ajuster les variables selon votre configuration locale

4. Initialiser la base de données
```bash
npm run db:generate
npm run db:push
```

5. Démarrer l'application en mode développement
```bash
npm run dev
```

### Environnement de production

L'environnement de production est configuré via Docker pour assurer la cohérence et la facilité de déploiement.

#### Prérequis serveur

- Docker
- Docker Compose
- Accès réseau pour les ports 80/443

#### Déploiement

1. Cloner le dépôt sur le serveur
```bash
git clone git@github.com:DTAHC/dtahc-project.git
cd dtahc-project
```

2. Configurer les variables d'environnement
   - Créer un fichier `.env` dans le dossier `docker` pour Docker Compose
   - S'assurer que les informations sensibles sont sécurisées

3. Construire et démarrer les conteneurs
```bash
cd docker
docker-compose up -d
```

4. Vérifier le déploiement
```bash
docker-compose ps
```

## Gestion de version avec Git

### Workflow Git

Nous utilisons la méthode Git Flow pour organiser notre développement :

- `main` : branche de production stable
- `develop` : branche de développement principal
- `feature/*` : branches pour les nouvelles fonctionnalités
- `bugfix/*` : branches pour les corrections de bugs
- `release/*` : branches pour la préparation des versions

### Dépôt GitHub

Le dépôt GitHub du projet se trouve à l'adresse : [https://github.com/DTAHC/dtahc-project](https://github.com/DTAHC/dtahc-project)

Pour gérer le dépôt GitHub, plusieurs scripts sont disponibles :

- `scripts/reset-github.sh` : Pour remplacer complètement l'ancien contenu par le nouveau (⚠️ Attention, perte d'historique !)
- `scripts/merge-github.sh` : Pour intégrer l'ancien et le nouveau contenu (préserve l'historique)

### Conventions de commit

Format : `type(scope): description concise`

Types :
- `feat` : nouvelle fonctionnalité
- `fix` : correction de bug
- `docs` : modifications de documentation
- `style` : formatage du code
- `refactor` : refactorisation du code
- `test` : ajout ou modification de tests
- `chore` : tâches de maintenance
- `ci` : changements dans la configuration CI/CD

Exemple : `feat(clients): ajouter le formulaire de création de client`

### Procédure de développement

1. Créer une branche à partir de `develop` pour votre fonctionnalité
```bash
git checkout develop
git pull
git checkout -b feature/ma-nouvelle-fonctionnalite
```

2. Effectuer les modifications nécessaires

3. Committer régulièrement avec des messages descriptifs
```bash
git add .
git commit -m "feat(module): description de la modification"
```

4. Pousser la branche vers le dépôt distant
```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

5. Créer une Pull Request vers `develop`

6. Après revue et tests, fusionner dans `develop`

## Documentation

### GitHub Pages

La documentation du projet est hébergée sur GitHub Pages et disponible à l'adresse [https://dtahc.github.io/dtahc-project/](https://dtahc.github.io/dtahc-project/)

Pour ajouter ou modifier la documentation :

1. Modifiez les fichiers dans le dossier `docs/`
2. Committer et pousser vers GitHub
3. GitHub Actions s'occupera automatiquement de la publication

## Suivi du développement

Pour assurer la cohérence et le suivi entre les sessions de développement, nous utilisons les outils suivants :

### CLAUDE.md

Ce fichier sert à documenter l'état actuel du développement pour les sessions avec Claude. Il contient :
- L'état d'avancement de chaque module
- Les tâches en cours et à venir
- Les problèmes connus et leur statut


## Base de données

La structure de la base de données est gérée via Prisma ORM. Le schéma est défini dans `packages/backend/prisma/schema.prisma`.

Pour appliquer des modifications au schéma :
```bash
npm run db:generate  # Générer le client Prisma
npm run db:push      # Appliquer les modifications à la base de données
```

## Services externes

### API Cadastre et Urbanisme

Les intégrations avec les API externes sont configurées dans les services:
- `packages/backend/src/modules/documents/services/cadastre.service.ts`
- `packages/backend/src/modules/documents/services/urbanisme.service.ts`

## Vérification de l'environnement

Avant de commencer le développement, exécutez le script de vérification pour confirmer que votre environnement est correctement configuré :

```bash
npm run check:env
```

Ce script vérifie :
- Les versions de Node.js et npm
- La disponibilité de la base de données
- Les variables d'environnement requises
- Les dépendances du projet

## CI/CD avec GitHub Actions

Le projet utilise GitHub Actions pour l'intégration continue et le déploiement continu. Les workflows sont définis dans le dossier `.github/workflows/` :

- `ci.yml` : Exécute les tests et les vérifications de code
- `deploy-docs.yml` : Déploie la documentation sur GitHub Pages
- `pages.yml` : Configuration générale pour GitHub Pages