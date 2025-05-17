# DTAHC - Gestion des autorisations de travaux

Application web complète de gestion des dossiers d'autorisations de travaux, depuis l'acquisition client jusqu'au suivi des démarches administratives.

[![CI](https://github.com/DTAHC/dtahc-project/actions/workflows/ci.yml/badge.svg)](https://github.com/DTAHC/dtahc-project/actions/workflows/ci.yml)
[![Documentation](https://github.com/DTAHC/dtahc-project/actions/workflows/pages.yml/badge.svg)](https://dtahc.github.io/dtahc-project/)

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
├── docker/              # Configuration Docker
├── docs/                # Documentation
└── scripts/             # Scripts utilitaires
```

## 🚀 Installation et démarrage

### Installation rapide

```bash
# Cloner le dépôt
git clone git@github.com:DTAHC/dtahc-project.git
cd dtahc-project

# Exécuter le script de configuration
./scripts/setup.sh
```

Pour plus de détails, consultez le [Guide de démarrage](https://dtahc.github.io/dtahc-project/getting-started).

### Démarrage en mode développement

```bash
# Lancer le backend et le frontend en mode développement
npm run dev

# Ou lancer uniquement le backend
npm run dev --workspace=backend

# Ou lancer uniquement le frontend
npm run dev --workspace=frontend
```

## 📚 Documentation

La documentation complète est disponible sur [https://dtahc.github.io/dtahc-project/](https://dtahc.github.io/dtahc-project/)

## 🤝 Contribution

1. Forker le projet
2. Créer une branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'feat: add some amazing feature'`)
4. Pousser la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 🔐 Rôles et permissions

- **ADMIN**: Accès complet à toutes les fonctionnalités
- **COMPTABLE**: Tableau de bord, Clients, Comptabilité
- **GESTION**: Tableau de bord, Clients, Comptabilité (restreint), Modèles
- **PRODUCTION**: Tableau de bord, Clients (technique), Formulaires
- **CLIENT PRO**: Tableau de bord personnalisé, Ses clients, Suivi

## 📝 Licence

Propriétaire - DTAHC SARL