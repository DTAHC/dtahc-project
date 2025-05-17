# Guide d'Environnement de Développement DTAHC

Ce document décrit l'environnement de développement standardisé pour le projet DTAHC afin d'assurer la cohérence et l'efficacité du travail entre tous les membres de l'équipe.

## 🔄 Standardisation Next.js + TailwindCSS

En accord avec les meilleures pratiques identifiées, nous avons standardisé l'environnement de développement sur:

- **Framework frontend**: Next.js 14+ avec App Router
- **Framework CSS**: TailwindCSS
- **Langage**: TypeScript pour tous les composants
- **Gestion d'état**: React Query + Zustand
- **Backend**: NestJS avec Prisma ORM

> **IMPORTANT**: Tout nouveau développement doit suivre ces standards. L'ancienne version React (CRA) est maintenue uniquement pour la compatibilité avec les conteneurs Docker existants.

## 📋 Structure du projet standardisée

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
│   │   │   │   └── accounting/   # Module comptable
│   │   │   └── main.ts
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts           # Données de test
│   ├── frontend/        # Next.js (STANDARD)
│   │   ├── app/                  # Pages organisées par route
│   │   │   ├── comptable/        # Module comptable
│   │   │   ├── clients/          # Module clients
│   │   │   └── layout.tsx        # Layout principal
│   │   ├── components/           # Composants réutilisables
│   │   │   └── layout/           # Composants de structure
│   │   │       └── Sidebar.tsx   # Barre latérale
│   │   └── lib/                  # Utilitaires et hooks
│   └── shared/          # Types partagés
├── src/                 # React CRA (LEGACY)
│   ├── App.js           # Routes React
│   ├── components/
│   │   └── layout/
│   └── pages/
├── docker/              # Configuration Docker
├── docs/                # Documentation
└── scripts/             # Scripts utilitaires
```

## 🛠️ Configuration de l'environnement local

### Prérequis

- Node.js 18+ (LTS recommandé)
- npm 8+
- Git
- Docker et Docker Compose (optionnel mais recommandé)
- PostgreSQL (si développement sans Docker)
- IDE recommandé: Visual Studio Code avec:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense

### Installation de l'environnement

1. **Cloner le dépôt**
```bash
git clone git@github.com:DTAHC/dtahc-project.git
cd dtahc-project
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
   - Copier `.env.example` vers `.env.local` dans `/packages/frontend`
   - Copier `.env.example` vers `.env` dans `/packages/backend`
   - Ajuster les valeurs selon votre environnement

4. **Initialiser la base de données (si développement sans Docker)**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. **Démarrer l'environnement de développement**
```bash
# Développement standard avec Next.js (recommandé)
npm run dev --workspace=frontend

# Ou démarrer tout le projet (backend + frontend)
npm run dev
```

## 🔨 Outils et Extensions

### VSCode Extensions Recommandées

Créez un fichier `.vscode/extensions.json` avec:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "streetsidesoftware.code-spell-checker",
    "eamodio.gitlens",
    "prisma.prisma"
  ]
}
```

### Configuration VSCode

Créez un fichier `.vscode/settings.json` avec:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.singleQuote": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "eslint.workingDirectories": [
    "./packages/backend",
    "./packages/frontend"
  ]
}
```

## 🚀 Scripts de développement

### Next.js (Recommandé)

```bash
# Démarrer le serveur Next.js
cd packages/frontend
npm run dev

# Linter
npm run lint

# Type-checking
npm run typecheck

# Build pour production
npm run build
```

### NestJS (Backend)

```bash
# Démarrer le serveur NestJS
cd packages/backend
npm run start:dev

# Linter
npm run lint

# Tests unitaires
npm run test

# Tests end-to-end
npm run test:e2e
```

### Prisma (Base de données)

```bash
# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:push

# Créer une migration
npx prisma migrate dev --name nom_migration

# Visualiser la base de données
npx prisma studio
```

## 🐳 Docker pour le développement

### Configuration Docker standardisée

Nous avons mis à jour la configuration Docker pour utiliser Next.js:

```bash
# Construire et démarrer tous les services
docker-compose -f docker/docker-compose.yml up -d

# Arrêter les services
docker-compose -f docker/docker-compose.yml down

# Voir les logs
docker-compose -f docker/docker-compose.yml logs -f
```

### Modification de fichiers dans Docker

Si vous devez modifier des fichiers dans un conteneur Docker:

1. Modifier les fichiers localement (dans `/packages/frontend`)
2. Reconstruire le conteneur ou utiliser les volumes pour la synchronisation automatique

## 📈 Monitoring et Logging

- Logs de développement: Disponibles dans la console lors de l'exécution
- Logs de Docker: `docker logs dtahc-frontend` ou `docker-compose logs frontend`
- Monitoring de production: Prometheus + Grafana (voir `/docker/monitoring/`)

## 🔍 Guides et Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Documentation](https://docs.docker.com/)

## 📝 Validation et Tests

Avant de soumettre du code:

1. Exécuter le linter et corriger les erreurs
   ```bash
   npm run lint
   ```

2. Vérifier les types TypeScript
   ```bash
   npm run typecheck
   ```

3. Exécuter les tests unitaires
   ```bash
   npm run test
   ```

4. Vérifier que l'application fonctionne correctement en local