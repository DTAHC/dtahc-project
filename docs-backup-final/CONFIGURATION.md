# Guide de configuration globale DTAHC

> ⚠️ **IMPORTANT**: Ce projet suit une structure standardisée. Consultez STANDARDS.md avant tout développement pour comprendre les règles à respecter.

Ce document résume l'ensemble des configurations du projet DTAHC et sert de référence rapide pour les développeurs.

## 📋 Structure du projet

```
dtahc-project/
├── packages/
│   ├── backend/         # API NestJS
│   │   ├── src/
│   │   ├── prisma/
│   │   └── .env
│   ├── frontend/        # Application Next.js 
│   │   ├── app/
│   │   ├── components/
│   │   └── .env.local
│   └── shared/          # Types partagés
├── docker/              # Configuration Docker
├── docs/                # Documentation
├── scripts/             # Scripts utilitaires
└── ... 
```

## 🔧 Environnements configurés

### Local (Développement)

- **Backend** : http://localhost:3001/api
- **Frontend** : http://localhost:3000
- **Base de données** : PostgreSQL (port 5432)
- **MinIO** : http://localhost:9000 (UI: http://localhost:9001)
- **Variables d'environnement** :
  - `packages/backend/.env`
  - `packages/frontend/.env.local`

### Production (via Docker)

- Tous les services sont configurés via `docker-compose.yml`
- Proxy inverse NGINX configuré sur le port 80/443
- Base de données et MinIO avec volumes persistants

## 🔑 Accès Github

- **Dépôt** : [https://github.com/DTAHC/dtahc-project](https://github.com/DTAHC/dtahc-project)
- **Documentation** : [https://dtahc.github.io/dtahc-project](https://dtahc.github.io/dtahc-project)
- **Branches** :
  - `main` : code de production stable
  - `develop` : développement actif

## 🚀 Commandes principales

### Installation et configuration

```bash
# Première installation
./scripts/setup.sh

# Vérification de l'environnement
npm run check:env

# Migration des données de référence
npm run migrate:data
```

### Développement

```bash
# Démarrer tous les services (frontend + backend)
npm run dev

# Démarrer uniquement le backend
npm run dev --workspace=backend

# Démarrer uniquement le frontend
npm run dev --workspace=frontend

# Générer les clients Prisma
npm run db:generate

# Appliquer les changements à la base de données
npm run db:push
```

### Docker

```bash
# Démarrer les conteneurs
npm run docker:up

# Arrêter les conteneurs
npm run docker:down
```

### Git

```bash
# Créer une branche de fonctionnalité
git checkout develop
git pull
git checkout -b feature/ma-fonctionnalite

# Pousser une branche
git push -u origin feature/ma-fonctionnalite
```

## 📊 État actuel du développement

| Module | Backend | Frontend | Priorité |
|--------|---------|----------|----------|
| Authentification | ✅ | ✅ | Terminé |
| Utilisateurs | ✅ | ✅ | Terminé |
| Clients | 🔄 | 🔄 | Haute |
| Workflow | 🔄 | 🔄 | Haute |
| Documents | 🔄 | 🔄 | Moyenne |
| Comptabilité | 🔄 | 🔄 | Basse |

Pour plus de détails, consultez le fichier `CLAUDE.md`.

## 🔄 Workflow de développement

1. Créer une branche `feature/xxx` à partir de `develop`
2. Développer et tester la fonctionnalité
3. Committer avec le format `type(scope): description` (ex: `feat(clients): ajouter formulaire création`)
4. Pousser la branche et créer une Pull Request vers `develop`
5. Après revue et validation, fusionner dans `develop`
6. Fusionner `develop` dans `main` uniquement pour les versions de production

## 🧩 Modules principaux

### Module d'authentification

- JWT avec refresh token
- Rôles utilisateur (ADMIN, COMPTABLE, GESTION, PRODUCTION, CLIENT_PRO, USER)
- Routes sécurisées via gardes de rôles

### Module de gestion des utilisateurs

- CRUD complet des utilisateurs
- Attribution de rôles et permissions
- Activation/désactivation de comptes

### Module de gestion des clients (à implémenter)

- Informations client
- Adresses multiples
- Lien vers les pros pour clients référés

### Module de workflow (à implémenter)

- Machine à états pour le suivi des dossiers
- Statuts et étapes configurables
- Notification des changements d'état

## 📝 Documentation complète

Pour une documentation plus détaillée :
- `README.md` - Vue d'ensemble du projet
- `DEVELOPMENT.md` - Guide de développement complet
- `CLAUDE.md` - Suivi du développement et tâches
- En ligne : [https://dtahc.github.io/dtahc-project](https://dtahc.github.io/dtahc-project)