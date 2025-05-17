# Structure du Projet DTAHC

## Contexte Technique

Le projet DTAHC est une application full-stack utilisant une architecture monorepo. Elle comporte une particularité importante: **deux implémentations du frontend coexistent**.

> **IMPORTANT**: Nous avons standardisé sur Next.js comme technologie frontend officielle. La version React (CRA) est maintenue uniquement pour la compatibilité avec l'existant, mais tout nouveau développement doit se faire en Next.js avec TailwindCSS.

> **IMPORTANT**: La version React (CRA) dans le conteneur Docker est différente de celle dans le répertoire local! Les modifications faites en local ne sont pas automatiquement reflétées dans le conteneur.

## Frontend

### 1. Version React (Create React App)
- **Localisation**: 
  - **Locale**: `/src` (mais pas utilisée par Docker)
  - **Docker**: `/app/src` (les fichiers à l'intérieur du conteneur)
- **Technologies**: React, React Router, TailwindCSS (pas Chakra UI)
- **Utilisée par**: L'environnement Docker actuel
- **Fichiers clés dans le conteneur**:
  - `/app/src/App.js` - Configuration des routes
  - `/app/src/components/layout/Layout.js` - Structure principale de l'UI qui inclut le Sidebar
  - `/app/src/pages/ComptablePage.jsx` - Module comptable

> **Note importante**: Le composant Layout.js dans le conteneur Docker inclut directement le Sidebar (pas de composant Sidebar séparé). Pour ajouter un lien dans la barre latérale, il faut modifier directement le fichier Layout.js dans le conteneur.

### 2. Version Next.js
- **Localisation**: `/packages/frontend`
- **Technologies**: Next.js, App Router, TailwindCSS, React Query, Zustand
- **Utilisée par**: Développement local et futur déploiement
- **Fichiers clés**:
  - `/packages/frontend/app/comptable/page.tsx` - Module comptable
  - `/packages/frontend/components/layout/Sidebar.tsx` - Barre de navigation

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
- **Frontend React**: `/src/pages/ComptablePage.jsx`
- **Frontend Next.js**: `/packages/frontend/app/comptable/page.tsx`
- **Sidebar React**: Lien `/comptable` dans `/src/components/layout/Sidebar.jsx`
- **Sidebar Next.js**: Lien `/comptable` dans `/packages/frontend/components/layout/Sidebar.tsx`

### Module Clients
- **Backend**: `/packages/backend/src/modules/clients`
- **Frontend React**: `/src/pages/ClientsPage.jsx`, `/src/components/client/*`
- **Frontend Next.js**: `/packages/frontend/app/clients/*`

## Docker et Déploiement

### Configuration Docker
- L'environnement Docker utilise actuellement la version React (CRA)
- La configuration se trouve dans `/docker`

### Déploiement
- Script de déploiement: `/scripts/deploy-server.sh`
- Migrations et seeds de base de données: `/packages/backend/prisma/seed.ts`

## Workflows de Développement

### 1. Développement avec Docker
```bash
docker-compose up
```
Cette commande démarre la version React du frontend dans le conteneur.

### 2. Développement local (Next.js)
```bash
cd packages/frontend
npm run dev
```
Cette commande démarre la version Next.js du frontend.

### 3. Modification de fichiers dans le conteneur Docker

Lorsque vous devez modifier des fichiers dans le conteneur Docker, suivez ces étapes:

1. Créez d'abord le fichier localement pour le versionner
2. Copiez ensuite le fichier dans le conteneur:
```bash
docker cp /chemin/local/du/fichier.js dtahc-frontend:/app/chemin/destination/du/fichier.js
```

3. Redémarrez le conteneur pour que les modifications prennent effet:
```bash
docker restart dtahc-frontend
```

### 4. Vérification des fichiers dans le conteneur
Pour vérifier la structure ou le contenu des fichiers dans le conteneur:

```bash
# Liste des fichiers
docker exec dtahc-frontend ls -la /app/chemin/du/dossier

# Afficher le contenu d'un fichier
docker exec dtahc-frontend cat /app/chemin/du/fichier.js
```

## Notes Importantes

1. Lors de l'ajout de nouvelles fonctionnalités, développez-les en priorité avec Next.js, puis adaptez-les pour React uniquement si nécessaire pour l'environnement Docker actuel.
2. La structure du sidebar est différente entre les deux implémentations:
   - React: Utilise Chakra UI et React Router
   - Next.js: Utilise TailwindCSS et App Router
3. La navigation vers le module comptable est accessible via `/comptable` dans les deux implémentations.

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