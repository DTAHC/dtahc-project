# Prompts de développement stratégique DTAHC multi-terminaux

Ce document contient des prompts optimisés pour le développement avec plusieurs terminaux Claude Code simultanément. Nous recommandons l'utilisation de 5 terminaux spécialisés pour une efficacité maximale. Suivez l'ordre des phases pour un développement structuré.

## 🔧 Distribution recommandée des terminaux

### Terminal 1: Backend Core & Auth
Focus: Structure principale NestJS, authentification, architecture

### Terminal 2: Backend Features
Focus: Modules métier, APIs, workflow, intégrations externes

### Terminal 3: Frontend Core
Focus: Structure Next.js, composants UI, authentification

### Terminal 4: Frontend Features
Focus: Pages spécifiques, formulaires, visualisations

### Terminal 5: DevOps & Testing
Focus: Docker, CI/CD, tests, déploiement

## 📋 Prompts d'initialisation des terminaux

Exécutez ces prompts en premier dans chaque terminal pour définir le contexte:

### Terminal 1: Backend Core & Auth
```
Je suis David, gérant de DTAHC, et je développe l'application DTAHC avec toi. Ce terminal est dédié au Backend Core et à l'authentification.

Ce terminal se concentrera sur:
- Structure principale NestJS
- Module d'authentification
- Guards et middlewares
- Structure de base de données
- Schéma Prisma

Pour référence, voici les choix technologiques:
- TypeScript avec NestJS
- PostgreSQL avec Prisma ORM
- JWT pour l'authentification
- Structure modulaire

Commençons par la création de la structure principale du backend. Peux-tu me guider?
```

### Terminal 2: Backend Features
```
Je suis David, gérant de DTAHC, et je développe l'application DTAHC avec toi. Ce terminal est dédié aux fonctionnalités Backend.

Ce terminal se concentrera sur:
- API métier (clients, dossiers, documents)
- Système de workflow avec machine à états
- Intégrations API externes (cadastre, PLU)
- Socket.IO pour le temps réel
- Génération de PDF (CERFA, factures)

Pour référence, voici les choix technologiques:
- TypeScript avec NestJS
- PostgreSQL avec Prisma ORM
- MinIO pour le stockage des documents
- Architecture modulaire

Commençons par la création des modules métier. Peux-tu me guider?
```

### Terminal 3: Frontend Core
```
Je suis David, gérant de DTAHC, et je développe l'application DTAHC avec toi. Ce terminal est dédié au Frontend Core.

Ce terminal se concentrera sur:
- Structure principale Next.js (App Router)
- Composants UI réutilisables avec TailwindCSS
- Système d'authentification frontend
- Services API et hooks
- Layout principal et navigation

Pour référence, voici les choix technologiques:
- TypeScript avec Next.js 14+
- React avec hooks
- TailwindCSS pour les styles
- React Query pour les requêtes API
- Zustand pour la gestion d'état

Commençons par la création de la structure principale du frontend. Peux-tu me guider?
```

### Terminal 4: Frontend Features
```
Je suis David, gérant de DTAHC, et je développe l'application DTAHC avec toi. Ce terminal est dédié aux fonctionnalités Frontend.

Ce terminal se concentrera sur:
- Pages spécifiques (dashboard, clients, dossiers)
- Formulaires complexes avec validation
- Visualisation de documents
- Timeline de workflow
- Composants métier spécifiques

Pour référence, voici les choix technologiques:
- TypeScript avec Next.js 14+
- React Hook Form avec Zod
- React pour les composants
- TailwindCSS pour les styles
- Visualisations avec Recharts

Commençons par la création des pages principales. Peux-tu me guider?
```

### Terminal 5: DevOps & Testing
```
Je suis David, gérant de DTAHC, et je développe l'application DTAHC avec toi. Ce terminal est dédié au DevOps et aux Tests.

Ce terminal se concentrera sur:
- Configuration Docker et docker-compose
- Intégration continue (GitHub Actions)
- Tests (unitaires, intégration, e2e)
- Déploiement sur serveur (staging, production)
- Monitoring et performances

Pour référence, voici les choix technologiques:
- Docker et Docker Compose
- GitHub Actions pour CI/CD
- Jest pour les tests backend
- Vitest pour les tests frontend
- Playwright pour les tests e2e

Pour information, voici les accès:
- Serveur production: 82.165.42.244
- GitHub: git@github.com:DTAHC/dtahc-project.git

Commençons par la configuration Docker. Peux-tu me guider?
```

## 🛠️ Prompts de développement par phase

### Phase 1: Mise en place de l'infrastructure

#### Terminal 5: DevOps & Testing - Docker Setup
```
Maintenant que nous avons défini nos terminaux de travail, commençons par la configuration Docker pour notre environnement de développement.

J'ai besoin:
1. D'un Dockerfile pour le backend NestJS
2. D'un Dockerfile pour le frontend Next.js
3. D'un docker-compose.yml complet avec:
   - Backend (NestJS)
   - Frontend (Next.js)
   - PostgreSQL
   - Redis
   - MinIO
   - NGINX comme reverse proxy

Cette configuration doit permettre le hot reload pendant le développement.

Pour chaque fichier, explique-moi les choix techniques et comment ces services interagissent.
```

#### Terminal 1: Backend Core - Initialisation NestJS
```
Pendant que le Terminal 5 prépare notre environnement Docker, initialisons notre projet backend NestJS.

Je souhaite:
1. Créer la structure du projet NestJS avec TypeScript
2. Configurer un module App principal
3. Préparer la structure de dossiers pour une architecture modulaire
4. Mettre en place la connexion à PostgreSQL avec Prisma
5. Configurer le logging et la gestion des exceptions

Génère-moi l'arborescence de fichiers et le code pour ces éléments de base. Explique chaque partie pour que je comprenne bien la structure.
```

#### Terminal 3: Frontend Core - Initialisation Next.js
```
Parallèlement, initialisons notre projet frontend Next.js.

Je souhaite:
1. Créer la structure du projet Next.js 14+ avec App Router
2. Configurer TailwindCSS
3. Mettre en place une structure de dossiers optimale:
   - /app pour les routes
   - /components pour les composants réutilisables
   - /lib pour les services et utilitaires
   - /hooks pour les hooks personnalisés

Génère-moi l'arborescence de fichiers et le code pour ces éléments de base. Explique chaque composant pour que je comprenne bien la structure.
```

#### Terminal 5: DevOps & Testing - GitHub Workflow
```
Une fois la configuration Docker terminée, configurons la CI/CD avec GitHub Actions.

Je souhaite:
1. Un workflow qui se déclenche sur les push sur main et develop
2. Qui exécute les tests
3. Qui construit les images Docker
4. Qui déploie sur staging (depuis develop) ou production (depuis main)

Le serveur de production est 82.165.42.244 avec Docker installé.

Génère-moi le fichier de workflow et explique comment configurer les secrets GitHub nécessaires.
```

### Phase 2: Backend - Fondations

#### Terminal 1: Backend Core - Schéma Prisma
```
Maintenant, créons le schéma Prisma pour notre application.

Notre application a besoin des modèles suivants:
1. User (avec rôles admin, comptable, gestion, production, pro)
2. Client
3. Dossier (avec statut de workflow)
4. WorkflowStep (étapes du workflow)
5. Document (documents liés aux dossiers)
6. Task (tâches assignées aux utilisateurs)
7. Invoice (facturation)

Ces modèles doivent avoir les relations appropriées entre eux.

Génère-moi le schema.prisma complet avec les attributs, relations et énumérations nécessaires. Explique les choix de modélisation.
```

#### Terminal 1: Backend Core - Module Auth
```
Avec le schéma Prisma en place, développons le module d'authentification.

Je souhaite:
1. Un module NestJS pour l'authentification
2. Un système basé sur JWT avec refresh tokens
3. Des guards pour protéger les routes
4. La gestion des différents rôles (admin, comptable, gestion, production, pro)
5. Les endpoints API pour login, refresh, et gestion du profil

Génère-moi le code complet pour ce module avec controllers, services, et DTOs. Explique chaque partie pour que je comprenne bien le fonctionnement.
```

#### Terminal 2: Backend Features - Module Clients
```
Développons maintenant le module Clients pour notre API.

Je souhaite un module NestJS complet avec:
1. Controller REST pour les opérations CRUD sur les clients
2. Service avec logique métier
3. DTOs pour les requêtes et réponses
4. Validation des données
5. Tests unitaires pour le service

Le module doit permettre la recherche, filtrage et pagination des clients.

Génère-moi le code complet pour ce module avec controllers, services, et DTOs. Explique chaque partie.
```

#### Terminal 2: Backend Features - Module Workflow
```
Développons le module Workflow, qui est au cœur de notre application.

Je souhaite:
1. Un module NestJS pour gérer le workflow des dossiers
2. Une machine à états pour les transitions de statut (initial → validation → étude → finalisation → dépôt → instruction → décision)
3. Des hooks avant/après transition
4. Des événements émis lors des changements de statut
5. API REST pour gérer le workflow

Génère-moi le code complet pour ce module, en expliquant particulièrement la machine à états et les transitions possibles.
```

### Phase 3: Frontend - Fondations

#### Terminal 3: Frontend Core - Composants UI
```
Développons les composants UI de base pour notre application.

Je souhaite créer:
1. Un layout principal avec header, sidebar, et content
2. Des composants de navigation (menu, breadcrumbs)
3. Des composants de tableau de données avec pagination et filtres
4. Des composants de formulaire (inputs, selects, checkboxes)
5. Des composants de feedback (alerts, toasts)

Tous ces composants doivent utiliser TailwindCSS et être réutilisables.

Génère-moi le code pour ces composants avec des exemples d'utilisation.
```

#### Terminal 3: Frontend Core - Service d'authentification
```
Maintenant, développons le service d'authentification frontend.

Je souhaite:
1. Un service pour communiquer avec l'API d'authentification
2. Un hook React pour gérer l'état d'authentification (useAuth)
3. Un contexte React pour partager l'état d'authentification
4. Un middleware Next.js pour protéger les routes
5. Des composants de login et register

Génère-moi le code complet pour ces éléments et explique comment ils interagissent.
```

#### Terminal 4: Frontend Features - Dashboard
```
Développons la page Dashboard de notre application.

Je souhaite:
1. Une page dashboard avec résumé des dossiers
2. Des cartes de métriques (dossiers par statut)
3. Un graphique d'évolution des dossiers
4. Une liste des tâches récentes
5. Des filtres pour personnaliser la vue

Cette page doit être responsive et utiliser nos composants UI.

Génère-moi le code complet pour cette page, avec hooks pour récupérer les données et logique de présentation.
```

### Phase 4: Intégration et fonctionnalités avancées

#### Terminal 2: Backend Features - Intégration MinIO
```
Développons l'intégration avec MinIO pour le stockage des documents.

Je souhaite:
1. Un service NestJS pour interagir avec MinIO
2. Des endpoints pour upload/download de fichiers
3. La gestion des métadonnées
4. La gestion des versions de documents
5. Des permissions basées sur les rôles

Génère-moi le code complet pour cette intégration et explique comment tester que ça fonctionne correctement avec notre service MinIO dans Docker.
```

#### Terminal 4: Frontend Features - Gestion documents
```
Développons la partie frontend de gestion des documents.

Je souhaite:
1. Une page de liste des documents par dossier
2. Un composant d'upload avec drag and drop
3. Un visualiseur de documents (PDF, images)
4. Une interface pour gérer les versions
5. Une interface pour les métadonnées

Ces composants doivent communiquer avec nos API backend.

Génère-moi le code complet pour ces fonctionnalités, en expliquant comment elles interagissent avec le backend.
```

#### Terminal 5: DevOps & Testing - Tests E2E
```
Développons des tests end-to-end pour nos principales fonctionnalités.

Je souhaite des tests Playwright pour:
1. Le processus d'authentification
2. La création et modification d'un client
3. La création et suivi d'un dossier dans le workflow
4. L'upload et la visualisation d'un document
5. La génération d'une facture

Génère-moi le code complet pour ces tests, avec des explications sur comment les exécuter et interpréter les résultats.
```

### Phase 5: Déploiement et finalisation

#### Terminal 5: DevOps & Testing - Script de déploiement
```
Préparons le déploiement sur notre serveur de production.

Je souhaite:
1. Un script bash pour déployer notre application sur le serveur (82.165.42.244)
2. Les étapes pour configurer le serveur (nginx, certificats SSL)
3. Un processus pour la migration de base de données
4. Une stratégie de backup
5. Monitoring et alertes

Génère-moi les scripts et configurations nécessaires, avec des explications détaillées sur chaque étape.
```

#### Terminal 1 & 2: Backend - Documentation API
```
Finalisons la documentation de notre API backend.

Je souhaite:
1. Une configuration Swagger complète pour l'API
2. Des descriptions pour chaque endpoint
3. Des exemples de requêtes et réponses
4. Une documentation des modèles de données
5. Des instructions d'utilisation

Génère-moi le code pour configurer Swagger dans NestJS et comment documenter correctement chaque endpoint.
```

#### Terminal 3 & 4: Frontend - Optimisation
```
Optimisons les performances de notre frontend avant le déploiement.

Je souhaite:
1. Une analyse des performances actuelles
2. Des optimisations pour le bundle size
3. L'implémentation de code splitting et lazy loading
4. Des stratégies de caching pour les requêtes API
5. Des optimisations SEO

Génère-moi le code pour ces optimisations et explique comment mesurer leur impact.
```

## 📋 Vérifications et tests

### Terminal 5: DevOps & Testing - Vérification locale
```
Avant de déployer, vérifions que notre environnement local fonctionne correctement.

Peux-tu me fournir:
1. Une série de commandes pour vérifier chaque service (backend, frontend, db, etc.)
2. Des tests de santé pour les APIs
3. Une vérification des performances
4. Une liste de points à vérifier manuellement
5. Des solutions aux problèmes courants

Cela nous aidera à nous assurer que tout est prêt pour le déploiement.
```

### Terminal 5: DevOps & Testing - Vérification serveur
```
Après déploiement, vérifions que notre application fonctionne correctement sur le serveur.

Peux-tu me fournir:
1. Des commandes pour vérifier l'état des services
2. Des tests de santé pour les APIs en production
3. Une vérification des performances
4. Comment accéder et analyser les logs
5. Un processus de rollback en cas de problème

Cela nous aidera à confirmer que le déploiement s'est bien passé.
```

## 🔄 Prompts de synchronisation entre terminaux

Utilisez ces prompts pour synchroniser le travail entre terminaux:

### Synchronisation Backend-Frontend
```
Nous avons développé [fonctionnalité X] dans le backend (Terminal 1/2) et nous devons maintenant l'intégrer côté frontend (Terminal 3/4).

Voici le code du controller et des DTOs backend:
[Coller le code pertinent]

Maintenant, générons:
1. Le service API frontend pour cette fonctionnalité
2. Les types TypeScript correspondants
3. Les hooks React pour utiliser cette API
4. Des exemples d'utilisation dans les composants

Assure-toi que l'intégration est cohérente entre backend et frontend.
```

### Synchronisation DevOps-Développement
```
Nous avons mis à jour la configuration Docker dans le Terminal 5 (DevOps).

Voici les changements:
[Coller les changements]

Comment dois-je mettre à jour mon environnement de développement local pour tenir compte de ces changements? Y a-t-il des variables d'environnement à ajouter ou des commandes supplémentaires à exécuter?
```

## 🔍 Prompts de résolution de problèmes

### En cas d'erreur
```
Je rencontre cette erreur dans [Backend/Frontend]:

[Copier le message d'erreur]

Contexte:
- Je travaillais sur [fonctionnalité]
- J'ai récemment modifié [fichiers modifiés]
- Environnement: [local/staging/production]

Peux-tu m'aider à comprendre la cause de cette erreur et comment la résoudre?
```

### En cas de conflit Git
```
J'ai un conflit Git sur les fichiers suivants:

[Liste des fichiers en conflit]

Voici le contenu des fichiers en conflit:
[Copier les sections en conflit]

Comment dois-je résoudre ces conflits en préservant les fonctionnalités des deux branches?
```

## ⚙️ Prompts pour les moments clés du développement

### Vérification avant commit
```
Je suis sur le point de committer ces changements:

[Liste des fichiers modifiés]

[Extraits de code pertinents]

Peux-tu vérifier s'il y a:
1. Des problèmes potentiels
2. Des optimisations possibles
3. Des tests manquants
4. Des problèmes de sécurité
5. Des inconsistances avec le reste du code

Avant que je ne pousse ces changements.
```

### Préparation pour Pull Request
```
Je suis prêt à créer une Pull Request pour la fonctionnalité [nom de la fonctionnalité].

Voici un résumé des changements:
[Résumé des changements]

Peux-tu m'aider à:
1. Préparer une description détaillée pour la PR
2. Lister les tests effectués
3. Identifier les risques potentiels
4. Préciser les dépendances avec d'autres PR
5. Mentionner les points d'attention pour les reviewers
```

### Planification du prochain sprint
```
Nous venons de terminer le développement de [fonctionnalité actuelle] et nous voulons planifier le prochain sprint.

Nos priorités sont:
1. [Priorité 1]
2. [Priorité 2]
3. [Priorité 3]

Peux-tu m'aider à:
1. Décomposer ces priorités en tâches concrètes
2. Identifier les dépendances entre ces tâches
3. Estimer la complexité relative
4. Suggérer un ordre de développement
5. Identifier les risques potentiels
```