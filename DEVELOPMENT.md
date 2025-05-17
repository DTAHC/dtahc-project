# Guide de développement DTAHC

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
└── ...
```

#### Installation

1. Cloner le dépôt Git
```bash
git clone <repository-url> dtahc-project
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
git clone <repository-url> dtahc-project
cd dtahc-project
```

2. Configurer les variables d'environnement
   - Créer un fichier `.env` dans le dossier racine pour Docker Compose
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

## Suivi du développement

Pour assurer la cohérence et le suivi entre les sessions de développement, nous utilisons les outils suivants :

### CLAUDE.md

Ce fichier sert à documenter l'état actuel du développement pour les sessions avec Claude. Il contient :
- L'état d'avancement de chaque module
- Les tâches en cours et à venir
- Les problèmes connus et leur statut

### Fichiers de référence

Le dossier `/Users/d972/dtahc-project/element-david` contient les fichiers de référence pour l'interface et les fonctionnalités. Ces fichiers ne doivent pas être modifiés et servent uniquement de guide pour le développement.

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