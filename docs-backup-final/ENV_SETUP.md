# Guide de configuration de l'environnement DTAHC

Ce document fournit un protocole rigoureux pour lancer et gérer les différents environnements du projet DTAHC.

## Présentation des environnements

Le projet DTAHC dispose de deux environnements distincts qui peuvent fonctionner en parallèle:

1. **Environnement Docker**
   - Exposé sur: http://localhost:3000
   - Utilisé pour: Production et tests
   - Basé sur: Next.js, App Router, TailwindCSS (version compilée)

2. **Environnement de développement local**
   - Exposé sur: http://localhost:3000 (ou port supérieur si 3000 est occupé)
   - Utilisé pour: Développement et améliorations
   - Basé sur: Next.js, App Router, TailwindCSS

## Vérification de l'environnement

Avant de lancer tout environnement, vérifiez toujours quels ports sont déjà utilisés:

```bash
# Vérifier quels processus utilisent les ports 3000, 3001 et 3002
lsof -i :3000 -i :3001 -i :3002

# Vérifier si des conteneurs Docker sont en exécution
docker ps
```

## Protocole de lancement d'environnement

### 1. Lancement de l'environnement Docker

```bash
# Se placer à la racine du projet
cd /Users/d972/dtahc-project

# Vérifier qu'aucun autre serveur ne tourne sur le port 3000
lsof -i :3000

# Démarrer l'environnement Docker
cd /Users/d972/dtahc-project/docker && docker-compose up -d
```

Pour arrêter l'environnement Docker:

```bash
# Arrêter les conteneurs sans supprimer les données
cd /Users/d972/dtahc-project/docker && docker-compose stop

# Ou arrêter et supprimer les conteneurs et les réseaux
cd /Users/d972/dtahc-project/docker && docker-compose down
```

### 2. Lancement de l'environnement de développement local

```bash
# Se placer à la racine du projet
cd /Users/d972/dtahc-project

# S'assurer que l'environnement Docker n'utilise pas le port 3000
cd /Users/d972/dtahc-project/docker && docker-compose stop

# Lancer le serveur de développement
npm run dev
```

### Règles importantes

1. **Ne jamais lancer simultanément l'environnement Docker et l'environnement de développement local sur le même port**.
2. **Toujours vérifier les ports** avant de lancer un environnement.
3. **Toujours documenter si les modifications concernent l'environnement Docker, l'environnement local ou les deux**.

## Résolution des problèmes courants

### Conflit de ports

Si vous obtenez un message indiquant que le port est déjà utilisé:

```
Port 3000 is in use, trying 3001 instead.
```

Vérifiez ce qui utilise le port:

```bash
lsof -i :3000
```

Puis arrêtez le processus concerné ou utilisez le port alternatif proposé.

### Pages 404 dans l'environnement local

Si vous obtenez des erreurs 404 sur certaines pages:

1. Vérifiez que vous accédez au bon environnement (Docker ou local)
2. Vérifiez que la page existe dans le dossier correspondant: `/packages/frontend/app/[page_name]/page.tsx`
3. Redémarrez le serveur si nécessaire

## Bonne pratique pour les nouveaux développements

1. Créer les composants et pages dans l'environnement de développement local
2. Tester et valider les fonctionnalités
3. Construire et déployer la version Docker pour les tests finaux
4. Documenter les modifications

## Journal des environnements

Pour suivre l'évolution des environnements, documentez chaque session de développement:

```
Date: JJ/MM/AAAA
Environnement utilisé: [Docker/Local]
Modules modifiés: [Liste des modules]
Pages créées/modifiées: [Liste des pages]
Problèmes rencontrés: [Description des problèmes]
Solutions appliquées: [Solutions mises en œuvre]
```

Ce protocole aidera à maintenir la cohérence entre les environnements et à anticiper les problèmes potentiels.