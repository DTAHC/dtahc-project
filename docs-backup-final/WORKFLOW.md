# Guide de workflow pour le développement DTAHC

Ce document clarifie le processus de développement pour éviter les problèmes entre les différents environnements.

## Comprendre l'architecture

Le projet DTAHC utilise une architecture avec deux environnements qui partagent le même code:

1. **Environnement de développement local** 
   - Utilisé pour le développement et les tests
   - Exécute Next.js directement sur votre machine
   - Accès via `http://localhost:3002` (port peut varier)

2. **Environnement Docker** 
   - Utilisé pour la production et les tests d'intégration
   - Exécute Next.js dans des conteneurs Docker
   - Accès via `http://localhost:3000` ou `http://localhost` (NGINX)

## Workflow recommandé

### 1. Développement de nouvelles fonctionnalités

Pour développer une nouvelle fonctionnalité ou page:

```bash
# Démarrer l'environnement de développement local
cd /Users/d972/dtahc-project
npm run dev --workspace=frontend
```

Créez et modifiez vos composants et pages dans:
- `/packages/frontend/app/[page_name]/page.tsx`
- `/packages/frontend/components/...`

### 2. Test local

Testez vos modifications en accédant à:
- `http://localhost:3002` (ou le port indiqué dans la console)
- `http://localhost:3002/[page_name]`

### 3. Déploiement vers Docker

Une fois que votre fonctionnalité est prête et testée localement:

```bash
# Exécuter le script de déploiement vers Docker
/Users/d972/dtahc-project/scripts/update-docker-frontend.sh
```

Ce script va:
1. Arrêter le conteneur frontend
2. Reconstruire l'image Docker avec vos modifications
3. Redémarrer le conteneur frontend

### 4. Test dans l'environnement Docker

Testez vos modifications dans l'environnement Docker:
- `http://localhost:3000`
- `http://localhost:3000/[page_name]`
- `http://localhost` (via NGINX)

## Résolution des problèmes

### Pages 404 dans Docker mais pas en local

Si vous obtenez des erreurs 404 pour certaines pages dans Docker mais pas en local, c'est généralement parce que:

1. L'image Docker n'a pas été reconstruite avec les nouvelles pages
2. Le conteneur frontend n'a pas été redémarré

Solution: exécutez le script `/Users/d972/dtahc-project/scripts/update-docker-frontend.sh`

### Conflits de port

Si vous obtenez des messages indiquant que les ports sont déjà utilisés:

```
Port 3000 is in use, trying 3001 instead...
```

C'est normal, car Docker utilise les ports 3000-3001. Votre serveur local utilisera le premier port disponible (généralement 3002).

## Bonnes pratiques

1. **Toujours développer en local d'abord**, puis déployer vers Docker
2. **Testez dans les deux environnements** avant de considérer une fonctionnalité comme terminée
3. **Utilisez des chemins d'accès absolus** dans les imports pour éviter les problèmes de résolution
4. **Maintenez la cohérence entre les versions** pour éviter les divergences