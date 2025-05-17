# DTAHC - Gestion des autorisations de travaux

Application web complète de gestion des dossiers d'autorisations de travaux, depuis l'acquisition client jusqu'au suivi des démarches administratives.

## 🚀 Fonctionnalités

- Gestion des clients et de leurs projets
- Workflow complet de traitement des dossiers d'urbanisme (DP, PC, ERP, etc.)
- Récupération automatique des documents cadastraux et réglementaires
- Génération automatique des CERFA pré-remplis
- Gestion comptable (devis, factures, suivi des paiements)
- Tableau de bord de suivi en temps réel
- Gestion des utilisateurs avec rôles et permissions

## 💻 Stack technique

### Backend
- TypeScript avec NestJS
- PostgreSQL avec Prisma ORM
- JWT pour l'authentification
- Socket.IO pour communications temps réel
- MinIO pour stockage de documents

### Frontend
- Next.js 14+ avec App Router
- React avec hooks
- TailwindCSS pour les styles
- React Query pour les requêtes API
- Zustand pour gestion d'état

### Infrastructure
- Docker et Docker Compose
- NGINX comme reverse proxy
- GitHub Actions pour CI/CD

## 🏗️ Structure du projet

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
│   │   │   │   └── accounting/
│   │   │   └── main.ts
│   │   └── prisma/
│   │       └── schema.prisma
│   ├── frontend/        # Application Next.js
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── shared/          # Types et utilitaires partagés
└── docker/              # Configuration Docker
```

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+
- npm ou yarn
- PostgreSQL (ou Docker pour l'exécution via conteneurs)

### Installation des dépendances

```bash
# Installation des dépendances pour tous les packages
npm install

# Générer les types Prisma
npm run db:generate
```

### Configuration

1. Créez un fichier `.env` dans le dossier `packages/backend` en vous inspirant du fichier `.env.example`
2. Configurez vos variables d'environnement (connexion à la base de données, clés JWT, etc.)

### Démarrage en mode développement

```bash
# Lancer le backend et le frontend en mode développement
npm run dev

# Ou lancer uniquement le backend
npm run dev --workspace=backend

# Ou lancer uniquement le frontend
npm run dev --workspace=frontend
```

### Construction pour la production

```bash
# Construire tous les packages
npm run build

# Démarrer en mode production
npm start
```

## 📚 Documentation

- [Documentation backend API](packages/backend/README.md)
- [Documentation frontend](packages/frontend/README.md)

## 🔐 Rôles et permissions

- **ADMIN**: Accès complet à toutes les fonctionnalités
- **COMPTABLE**: Tableau de bord, Clients, Comptabilité
- **GESTION**: Tableau de bord, Clients, Comptabilité (restreint), Modèles
- **PRODUCTION**: Tableau de bord, Clients (technique), Formulaires
- **CLIENT PRO**: Tableau de bord personnalisé, Ses clients, Suivi

## 📝 Licence

Propriétaire - DTAHC SARL