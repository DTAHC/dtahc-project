# Guide complet du projet DTAHC

Ce document est le guide principal pour le projet DTAHC, consolidant les informations essentielles auparavant réparties dans plusieurs fichiers.

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Structure et architecture](#2-structure-et-architecture)
3. [Standards et bonnes pratiques](#3-standards-et-bonnes-pratiques)
4. [Environnements de développement](#4-environnements-de-développement)
5. [Workflow de développement](#5-workflow-de-développement)
6. [Guide de contribution](#6-guide-de-contribution)
7. [Checklist de validation](#7-checklist-de-validation)
8. [Historique du projet](#8-historique-du-projet)

## 1. Présentation du projet

DTAHC est une application web complète de gestion des dossiers d'autorisations de travaux, depuis l'acquisition client jusqu'au suivi des démarches administratives.

### Fonctionnalités principales

- Gestion des clients et de leurs projets
- Workflow complet de traitement des dossiers d'urbanisme (DP, PC, ERP, etc.)
- Récupération automatique des documents cadastraux et réglementaires
- Génération automatique des CERFA pré-remplis
- Gestion comptable (devis, factures, suivi des paiements)
- Tableau de bord de suivi en temps réel
- Gestion des utilisateurs avec rôles et permissions

### Stack technique

- **Backend**: NestJS, PostgreSQL, Prisma ORM, JWT, Socket.IO
- **Frontend**: Next.js avec App Router, React, TailwindCSS, React Query, Zustand
- **Infrastructure**: Docker, Docker Compose, NGINX, GitHub Actions

## 2. Structure et architecture

```
dtahc-project/
├── packages/
│   ├── backend/         # API NestJS
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── clients/
│   │   │   │   ├── workflow/
│   │   │   │   ├── documents/
│   │   │   │   └── accounting/   # Module comptable backend
│   │   │   └── main.ts
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts           # Données de test initiales
│   ├── frontend/        # Application Next.js
│   │   ├── app/
│   │   │   ├── comptable/        # Module comptable
│   │   │   ├── clients/          # Module clients
│   │   │   ├── admin/            # Module administration
│   │   │   └── communication/     # Module communication
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── Sidebar.tsx   # Barre latérale
│   │   └── lib/
│   └── shared/          # Types et utilitaires partagés
├── docker/              # Configuration Docker
├── docs/                # Documentation
├── backup/              # Sauvegardes
└── scripts/             # Scripts utilitaires
```

## 3. Standards et bonnes pratiques

### À ne jamais faire

1. **Ne jamais créer de doubles implémentations frontend**

   - Utiliser exclusivement Next.js pour tous les développements frontend
   - Ne pas réintroduire d'autres frameworks alternatifs

2. **Ne jamais conserver plusieurs versions des mêmes fichiers**

   - Éviter les fichiers avec des suffixes comme `.new`, `.old`, `.simple`
   - Utiliser Git pour la gestion des versions, pas des copies de fichiers

3. **Ne jamais laisser des fichiers temporaires dans le dépôt**

   - Les fichiers de test doivent être dans le dossier `tests/`
   - Supprimer tous les fichiers temporaires avant de commit

4. **Ne jamais dupliquer les dossiers de sauvegarde**
   - Utiliser uniquement le dossier `/backup` pour les sauvegardes

### Bonnes pratiques à suivre

1. **Gestion de Docker**

   - Utiliser uniquement les Dockerfiles officiels dans `/docker/`
   - Modifier `docker-compose.yml` pour les changements de configuration
   - Utiliser le script `update-docker-frontend.sh` pour mettre à jour le frontend

2. **Standards de codage**

   - Utiliser TypeScript pour tout nouveau code
   - Suivre les conventions de nommage camelCase pour les variables et fonctions
   - Utiliser les interfaces pour définir les types complexes
   - Commenter le code uniquement quand nécessaire pour expliquer la logique complexe

3. **Développement Frontend**

   - Utiliser les hooks React pour la gestion d'état (useState, useEffect)
   - Préférer les composants fonctionnels aux composants de classe
   - Utiliser React Query pour les appels API et la gestion du cache
   - Structurer les composants pour maximiser la réutilisation
   - Suivre la méthodologie Mobile First pour les styles

4. **Développement Backend**
   - Structurer le code selon l'architecture NestJS (modules, controllers, services)
   - Utiliser les décorateurs pour les métadonnées (routes, validation)
   - Intégrer Prisma pour toutes les opérations de base de données
   - Valider les données d'entrée avec les DTOs et class-validator
   - Utiliser les gardes pour la sécurité et l'authentification

## 4. Environnements de développement

Le projet DTAHC dispose de deux environnements distincts qui partagent le même code:

### Environnement de développement local

- **Objectif**: Développement et tests
- **Exécution**: Next.js directement sur votre machine
- **Accès**: http://localhost:3002 (port peut varier)
- **Configuration requise**: Node.js 18+, npm 8+, PostgreSQL 14+

### Environnement Docker

- **Objectif**: Production et tests d'intégration
- **Exécution**: Next.js compilé dans des conteneurs Docker
- **Accès**: http://localhost:3000 ou http://localhost (via NGINX)
- **Configuration requise**: Docker, Docker Compose

### Installation et démarrage

```bash
# Cloner le dépôt
git clone git@github.com:DTAHC/dtahc-project.git
cd /Users/d972/dtahc-project

# Installer les dépendances
npm install

# Configurer les variables d'environnement
# - Copier .env.example vers .env dans packages/backend
# - Copier .env.example vers .env.local dans packages/frontend

# Initialiser la base de données
npm run db:generate
npm run db:push

# Démarrage en mode développement
npm run dev                      # Tous les services
npm run dev --workspace=frontend # Frontend uniquement
npm run dev --workspace=backend  # Backend uniquement

# Démarrage avec Docker
cd /Users/d972/dtahc-project/docker
docker-compose up -d
```

## 5. Workflow de développement

### Workflow recommandé

1. **Développement de nouvelles fonctionnalités**

   - Créer une branche depuis `develop` (`git checkout -b feature/ma-fonctionnalite`)
   - Développer et tester en local
   - Exécuter les tests et le linter

2. **Test dans l'environnement Docker**

   - Mettre à jour l'image Docker avec vos modifications:

   ```bash
   /Users/d972/dtahc-project/scripts/update-docker-frontend.sh
   ```

   - Tester à nouveau dans l'environnement Docker

3. **Validation et déploiement**
   - Vérifier avec la checklist de validation
   - Commit avec format standardisé (`type(scope): description`)
   - Push et création d'une Pull Request vers `develop`

### Résolution des problèmes courants

#### Pages 404 dans Docker mais pas en local

Si vous obtenez des erreurs 404 pour certaines pages dans Docker mais pas en local:

1. L'image Docker n'a pas été reconstruite avec les nouvelles pages
2. Solution: `/Users/d972/dtahc-project/scripts/update-docker-frontend.sh`

#### Conflits de port

Si vous obtenez des messages indiquant que les ports sont déjà utilisés, c'est normal:

- Docker utilise les ports 3000-3001
- Votre serveur local utilisera le premier port disponible (généralement 3002)

## 6. Guide de contribution

1. **Workflow Git**

   - Créer une branche par fonctionnalité (`feature/xxx`)
   - Utiliser le format de commit `type(scope): description`
   - Types de commit: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
   - Faire des pull requests vers `develop`
   - Ne fusionner dans `main` que pour les versions de production

2. **Revue de code**
   - Toute contribution doit être revue avant d'être fusionnée
   - Les problèmes identifiés doivent être corrigés dans la branche de fonctionnalité
   - Le code doit passer tous les tests et le linter

## 7. Checklist de validation

Utilisez cette checklist avant chaque commit:

### Structure du code

- [ ] Le code frontend utilise uniquement Next.js
- [ ] Le code backend utilise uniquement NestJS
- [ ] Les composants suivent les conventions de nommage et d'organisation
- [ ] L'interface utilisateur respecte les styles TailwindCSS du projet

### Environnement de développement

- [ ] Aucune double implémentation n'a été créée
- [ ] Aucun fichier temporaire n'a été laissé dans le dépôt
- [ ] Les configurations Docker sont cohérentes

### Qualité du code

- [ ] Le code est typé avec TypeScript
- [ ] Le linter ne signale aucune erreur (`npm run lint`)
- [ ] Le format du code est cohérent (`npm run format`)
- [ ] Les erreurs potentielles sont gérées

### Git

- [ ] Le message de commit suit le format standard (`type(scope): description`)
- [ ] Les changements sont atomiques (une seule fonctionnalité par commit)
- [ ] Aucun fichier sensible n'est inclus dans le commit

## 8. Historique du projet

Consultez le fichier [HISTORY.md](HISTORY.md) pour un historique détaillé du projet.

---

## Notes

- Documentation complète disponible sur [https://dtahc.github.io/dtahc-project/](https://dtahc.github.io/dtahc-project/)
- Pour des problèmes spécifiques, consultez la section [Résolution des problèmes](#5-workflow-de-développement)
- Pour toute question, contactez l'équipe de développement via GitHub ou par email
