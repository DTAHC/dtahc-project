# Standards du projet DTAHC

Ce document définit les standards du projet DTAHC et doit être respecté par tous les développeurs pour maintenir la cohérence et éviter les problèmes.

## 🚫 À ne jamais faire

1. **Ne jamais créer de doubles implémentations frontend**
   - Utiliser exclusivement Next.js pour tous les développements frontend
   - Ne pas réintroduire React CRA ou d'autres frameworks alternatifs

2. **Ne jamais conserver plusieurs versions des mêmes fichiers**
   - Éviter les fichiers avec des suffixes comme `.new`, `.old`, `.simple`
   - Utiliser Git pour la gestion des versions, pas des copies de fichiers

3. **Ne jamais laisser des fichiers temporaires dans le dépôt**
   - Les fichiers de test doivent être dans le dossier `tests/`
   - Supprimer tous les fichiers temporaires avant de commit

4. **Ne jamais dupliquer les dossiers de sauvegarde**
   - Utiliser uniquement le dossier `/backup` pour les sauvegardes
   - Ne pas créer de nouveaux dossiers de sauvegarde

## ✅ Bonnes pratiques à suivre

1. **Structure standard du projet**
   ```
   dtahc-project/
   ├── packages/
   │   ├── backend/         # API NestJS
   │   ├── frontend/        # Application Next.js
   │   └── shared/          # Types partagés
   ├── docker/              # Configuration Docker
   ├── docs/                # Documentation
   └── scripts/             # Scripts utilitaires
   ```

2. **Gestion de Docker**
   - Utiliser uniquement les Dockerfiles officiels dans `/docker/`
   - Modifier `docker-compose.yml` pour les changements de configuration
   - Utiliser le script `update-docker-frontend.sh` pour mettre à jour le frontend

3. **Environnements standardisés**
   - **Développement local**: Next.js sur http://localhost:3000
   - **Docker**: Next.js compilé sur http://localhost:3000 ou http://localhost (via NGINX)
   - Toujours vérifier les ports avant de lancer un environnement

4. **Scripts et commandes standard**
   ```bash
   # Développement local
   npm run dev                      # Tous les services
   npm run dev --workspace=frontend # Frontend uniquement
   npm run dev --workspace=backend  # Backend uniquement
   
   # Docker
   npm run docker:up                # Démarrer les conteneurs
   npm run docker:down              # Arrêter les conteneurs
   
   # Base de données
   npm run db:generate              # Générer les clients Prisma
   npm run db:push                  # Appliquer les changements à la DB
   ```

5. **Workflow Git**
   - Créer une branche par fonctionnalité (`feature/xxx`)
   - Utiliser le format de commit `type(scope): description`
   - Faire des pull requests vers `develop`
   - Ne fusionner dans `main` que pour les versions de production

## 🔄 Maintenance de la documentation

Ces documents doivent rester à jour et cohérents:

1. **CLAUDE.md** - Documentation technique et contexte du projet
2. **CONFIGURATION.md** - Guide de configuration globale
3. **DEVELOPMENT.md** - Guide détaillé pour le développement
4. **ENV_SETUP.md** - Configuration des environnements
5. **SESSIONS.md** - Journal des sessions de développement
6. **STANDARDS.md** (ce document) - Standards de développement

## 🛑 Résolution de conflits et problèmes courants

Si des conflits surgissent entre différentes implémentations ou approches:

1. **Principe de priorité**: Les standards définis dans ce document prévalent
2. **Résolution des problèmes**: Documenter le problème et sa solution dans SESSIONS.md
3. **Mise à jour des standards**: Mettre à jour ce document avec les nouvelles règles validées

Mise à jour: 18/05/2025 - Version 1.0