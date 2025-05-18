# Structure du Projet DTAHC

## Contexte Technique

Le projet DTAHC est une application full-stack utilisant une architecture monorepo.

> **IMPORTANT**: La version dans le conteneur Docker utilise une compilation de production de Next.js. Les modifications faites en local ne sont pas automatiquement reflétées dans le conteneur et nécessitent une reconstruction de l'image Docker avec le script `/Users/d972/dtahc-project/scripts/update-docker-frontend.sh`.

## Frontend

### Frontend Next.js
- **Localisation**: `/packages/frontend`
- **Localisation dans Docker**: `/app/packages/frontend`
- **Technologies**: Next.js, App Router, TailwindCSS, React Query, Zustand
- **Fichiers clés**:
  - `/packages/frontend/app/comptable/page.tsx` - Module comptable
  - `/packages/frontend/components/layout/Sidebar.tsx` - Barre de navigation
  - `/packages/frontend/app/clients/page.tsx` - Gestion des clients
  - `/packages/frontend/app/admin/page.tsx` - Administration
- **Accès Développement**: `http://localhost:3002` (le port peut varier si 3000 et 3001 sont utilisés)
- **Accès Docker**: `http://localhost:3000` ou `http://localhost` (via NGINX)

## Backend (NestJS)

- **Localisation**: `/packages/backend`
- **Technologies**: NestJS, Prisma ORM, PostgreSQL, JWT
- **Structure modulaire**:
  - `auth` - Authentification et sécurité
  - `users` - Gestion des utilisateurs
  - `clients` - Gestion des clients
  - `accounting` - Module comptable
  - `workflow` - Gestion des dossiers d'urbanisme
  - `documents` - Gestion documentaire

## Modules Principaux

### Module Comptable
- **Backend**: `/packages/backend/src/modules/accounting`
- **Frontend**: `/packages/frontend/app/comptable/page.tsx`
- **Sidebar**: Lien `/comptable` dans `/packages/frontend/components/layout/Sidebar.tsx`

### Module Clients
- **Backend**: `/packages/backend/src/modules/clients`
- **Frontend**: `/packages/frontend/app/clients/page.tsx`
- **Sidebar**: Lien `/clients` dans `/packages/frontend/components/layout/Sidebar.tsx`

### Module Administration
- **Backend**: Utilise multiples modules (users, auth)
- **Frontend**: `/packages/frontend/app/admin/page.tsx`
- **Sidebar**: Lien `/admin` dans `/packages/frontend/components/layout/Sidebar.tsx`

### Module Communication
- **Backend**: À implémenter
- **Frontend**: `/packages/frontend/app/communication/page.tsx`
- **Sidebar**: Lien `/communication` dans `/packages/frontend/components/layout/Sidebar.tsx`

## Docker et Déploiement

### Configuration Docker
- L'environnement Docker utilise une image compilée de Next.js
- La configuration se trouve dans `/docker`
- Le fichier principal est `docker-compose.yml` dans `/docker`

### Déploiement
- Script de déploiement conteneur: `/scripts/deploy-server.sh`
- Script de mise à jour frontend: `/Users/d972/dtahc-project/scripts/update-docker-frontend.sh`
- Migrations et seeds de base de données: `/packages/backend/prisma/seed.ts`

## Workflows de Développement

### 1. Développement avec Docker
```bash
docker-compose up
```
Cette commande démarre tous les services, y compris le frontend et le backend.

### 2. Développement local
```bash
cd /Users/d972/dtahc-project
npm run dev --workspace=frontend
```
Cette commande démarre uniquement le frontend en local.

### 3. Mise à jour des pages dans le conteneur Docker

Lorsque vous avez créé de nouvelles pages ou composants et que vous voulez les rendre disponibles dans Docker:

```bash
# Exécuter le script de mise à jour
./scripts/update-docker-frontend.sh
```

Ce script va:
1. Arrêter le conteneur frontend
2. Reconstruire l'image Docker
3. Redémarrer le conteneur

### 4. Vérification des fichiers dans le conteneur
Pour vérifier la structure ou le contenu des fichiers dans le conteneur:

```bash
# Liste des fichiers
docker exec dtahc-frontend ls -la /app/chemin/du/dossier

# Afficher le contenu d'un fichier
docker exec dtahc-frontend cat /app/chemin/du/fichier.js
```

## Documentation supplémentaire

- **WORKFLOW.md**: Guide détaillé du workflow de développement
- **ENV_SETUP.md**: Guide de configuration de l'environnement
- **CONFIGURATION.md**: Configuration globale du projet
- **DEVELOPMENT.md**: Guide de développement complet
- **SESSIONS.md**: Journal des sessions de développement

## Note Importante

> ⚠️ Ce projet suit des standards stricts. Veuillez consulter le fichier STANDARDS.md avant de commencer à développer pour éviter de réintroduire des problèmes comme des implémentations multiples ou des fichiers en double.

## Notes Importantes

1. Lors de l'ajout de nouvelles fonctionnalités, développez-les en priorité en local, puis mettez à jour l'image Docker.
2. Assurez-vous de tester vos modifications dans les deux environnements (local et Docker).
3. Si certaines pages sont accessibles en local mais pas dans Docker, utilisez le script `update-docker-frontend.sh`.
4. La navigation doit être cohérente entre l'environnement de développement local et l'environnement Docker.

## Bonnes Pratiques de Développement

### 1. Standards de Codage
- Utilisez TypeScript pour tout nouveau code
- Suivez les conventions de nommage camelCase pour les variables et fonctions
- Utilisez les interfaces pour définir les types complexes
- Commentez le code uniquement quand nécessaire pour expliquer la logique complexe

### 2. Développement Frontend
- Utilisez les hooks React pour la gestion d'état (useState, useEffect)
- Préférez les composants fonctionnels aux composants de classe
- Utilisez React Query pour les appels API et la gestion du cache
- Structurez les composants pour maximiser la réutilisation
- Suivez la méthodologie Mobile First pour les styles

### 3. Développement Backend
- Structurez le code selon l'architecture NestJS (modules, controllers, services)
- Utilisez les décorateurs pour les métadonnées (routes, validation)
- Intégrez Prisma pour toutes les opérations de base de données
- Validez les données d'entrée avec les DTOs et class-validator
- Utilisez les gardes pour la sécurité et l'authentification

### 4. Workflow Git
- Faites des commits atomiques (une seule fonctionnalité par commit)
- Suivez le format de message `type(scope): description` (ex: `feat(comptable): ajouter filtres`)
- Créez des branches pour chaque fonctionnalité (`feature/xxx`)
- Faites des pull requests pour les revues de code
- Maintenez un historique git propre avec rebase si nécessaire

### 5. Sécurité
- N'exposez jamais les secrets dans le code ou les logs
- Validez toutes les entrées utilisateur côté serveur
- Utilisez les gardes CSRF et CORS pour la protection
- Implémentez des limites de taux pour les API
- Chiffrez les données sensibles en transit et au repos