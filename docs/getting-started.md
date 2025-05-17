# Guide de démarrage

Ce guide vous aidera à installer et configurer votre environnement de développement pour le projet DTAHC.

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [npm](https://www.npmjs.com/) v8 ou supérieur
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (optionnel pour le développement local, recommandé pour la production)
- [Docker Compose](https://docs.docker.com/compose/) (optionnel pour le développement local, recommandé pour la production)

## Installation

1. Clonez le dépôt GitHub :

```bash
git clone git@github.com:DTAHC/dtahc-project.git
cd dtahc-project
```

2. Exécutez le script de configuration :

```bash
./scripts/setup.sh
```

Ce script vérifie les prérequis, installe les dépendances, génère les clients Prisma, et configure l'environnement de développement.

## Configuration manuelle (alternative)

Si vous préférez ne pas utiliser le script de configuration, vous pouvez effectuer les étapes suivantes manuellement :

1. Installez les dépendances :

```bash
npm install
```

2. Configurez les variables d'environnement :
   - Copiez `.env.example` vers `.env` dans le dossier `packages/backend`
   - Modifiez les valeurs selon votre environnement

3. Générez les clients Prisma :

```bash
npm run db:generate
```

4. Vérifiez l'environnement :

```bash
npm run check:env
```

## Démarrage du développement

Pour démarrer l'application en mode développement :

```bash
npm run dev
```

Cela lancera à la fois le backend (http://localhost:3001) et le frontend (http://localhost:3000).

Pour démarrer uniquement le backend ou le frontend :

```bash
# Backend seulement
npm run dev --workspace=backend

# Frontend seulement
npm run dev --workspace=frontend
```

## Services Docker

Pour démarrer les services Docker (PostgreSQL, MinIO) :

```bash
npm run docker:up
```

Pour arrêter les services :

```bash
npm run docker:down
```

## Structure du projet

Le projet est organisé comme un monorepo avec la structure suivante :

```
dtahc-project/
├── packages/
│   ├── backend/         # API NestJS
│   ├── frontend/        # Application Next.js
│   └── shared/          # Types et utilitaires partagés
├── docker/              # Configuration Docker
├── scripts/             # Scripts utilitaires
└── docs/                # Documentation
```

## Ressources supplémentaires

Pour plus d'informations, consultez :

- [DEVELOPMENT.md](https://github.com/DTAHC/dtahc-project/blob/main/DEVELOPMENT.md) - Guide détaillé de développement
- [CLAUDE.md](https://github.com/DTAHC/dtahc-project/blob/main/CLAUDE.md) - Suivi du développement