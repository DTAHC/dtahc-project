# Guide de référence rapide du projet DTAHC

## 🔍 Informations essentielles du projet

### Vue d'ensemble
DTAHC est une application de gestion des dossiers techniques d'urbanisme avec workflow, documents, facturation et intégration APIs cadastre/PLU.

### Structure du projet (Monorepo)
```
dtahc-project/
├── packages/
│   ├── backend/         # API NestJS
│   ├── frontend/        # Application Next.js
│   └── shared/          # Types et utilitaires partagés
├── docker/              # Configuration Docker
├── docs/                # Documentation
└── scripts/             # Scripts utilitaires
```

### Technologies principales
- **Backend**: TypeScript, NestJS, Prisma, PostgreSQL
- **Frontend**: TypeScript, Next.js, React, TailwindCSS
- **Infrastructure**: Docker, NGINX, Redis, MinIO
- **CI/CD**: GitHub Actions

### Environnements
- **Local**: Docker Compose sur machine de développement
- **Staging**: Déploiement automatique depuis branche develop
- **Production**: Déploiement manuel depuis branche main
  - Serveur: `82.165.42.244`
  - URL: `http://autorisations.fr`

## 🚀 Démarrage rapide

### Lancer l'environnement complet
```bash
# À la racine du projet
docker compose up -d
```

### Arrêter l'environnement
```bash
docker compose down
```

### Accéder aux services
- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:3001/api
- **API Documentation**: http://localhost:3001/docs
- **MinIO Console**: http://localhost:9001
- **PgAdmin**: http://localhost:5050

### Commandes fréquentes

#### Backend (dans packages/backend)
```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run start:dev

# Migrations Prisma
npx prisma migrate dev
npx prisma studio

# Tests
npm run test
```

#### Frontend (dans packages/frontend)
```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Build production
npm run build
```

## 📂 Points d'entrée principaux

### Backend (NestJS)
- Fichier principal: `packages/backend/src/main.ts`
- Module App: `packages/backend/src/app.module.ts`
- Schéma Prisma: `packages/backend/prisma/schema.prisma`
- Modules principaux:
  - Auth: `packages/backend/src/modules/auth`
  - Users: `packages/backend/src/modules/users`
  - Clients: `packages/backend/src/modules/clients`
  - Workflow: `packages/backend/src/modules/workflow`
  - Documents: `packages/backend/src/modules/documents`
  - Accounting: `packages/backend/src/modules/accounting`

### Frontend (Next.js)
- Configuration: `packages/frontend/next.config.js`
- Points d'entrée: `packages/frontend/app`
- Composants: `packages/frontend/components`
- Hooks: `packages/frontend/hooks`
- Services API: `packages/frontend/lib/api`

## 🔧 Configuration

### Variables d'environnement
- Backend: `packages/backend/.env`
- Frontend: `packages/frontend/.env.local`
- Docker: `.env` (racine)

### GitOps
- Branches:
  - `main`: production
  - `develop`: staging
  - `feature/*`: fonctionnalités en cours
- Pipeline CI/CD: `.github/workflows/ci-cd.yml`

## 🤝 Bonnes pratiques

### Conventions de code
- TypeScript strict mode
- ESLint + Prettier
- Commits sémantiques (feat, fix, docs, chore, etc.)

### Workflow Git
1. Créer une branche feature à partir de develop
2. Développer et tester localement
3. Pousser et créer une PR vers develop
4. Après review, merge vers develop (déploiement staging auto)
5. Merge vers main pour production

### Tests
- Backend: Jest
- Frontend: Vitest + React Testing Library
- E2E: Playwright

## 📚 Documentation

- API: Swagger (http://localhost:3001/docs)
- Architecture: `docs/architecture.md`
- Guide d'utilisation: `docs/user-guide.md`
- Workflow métier: `docs/workflow.md`

## 🔐 Accès et sécurité

### GitHub
- Dépôt: `git@github.com:DTAHC/dtahc-project.git`

### Serveur production
- IP: `82.165.42.244`
- SSH: `ssh -i ~/.ssh/id_rsa_server root@82.165.42.244`
- URL: `http://autorisations.fr`

> ⚠️ **IMPORTANT**: Ne jamais stocker les credentials directs dans le code source.
> Les mots de passe et clés d'API doivent être dans le .env (gitignore) ou les secrets GitHub.

## 🆘 Résolution de problèmes

### Logs
- Backend: `docker compose logs -f backend`
- Frontend: `docker compose logs -f frontend`
- NGINX: `docker compose logs -f nginx`

### Outils de diagnostic
- Prisma Studio: `npx prisma studio`
- Redis Commander: http://localhost:8081
- PgAdmin: http://localhost:5050

### Problèmes courants
- **Erreur de connexion PostgreSQL**: Vérifier que le service est démarré et les env vars
- **Problèmes CORS**: Vérifier la configuration NGINX et le middleware NestJS
- **Erreurs de build frontend**: Vérifier les dépendances et les types TS