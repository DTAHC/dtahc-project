# Liste des tâches à compléter

## 1. Finalisation de la configuration Docker

- [x] Correction du fichier docker-compose.yml pour utiliser le Dockerfile.frontend au lieu d'une image pré-construite
- [x] Mise à jour du script update-docker-frontend.sh pour utiliser docker-compose build
- [x] Correction des chemins de backup dans les scripts de déploiement

## 2. Tests des environnements

- [ ] Vérifier le fonctionnement de l'environnement de développement local
  ```bash
  cd /Users/d972/dtahc-project
  npm run dev
  ```

- [ ] Vérifier le fonctionnement de l'environnement Docker
  ```bash
  cd /Users/d972/dtahc-project
  npm run docker:up
  ```

## 3. Documentation

- [ ] Mettre à jour la documentation pour refléter la nouvelle structure
- [ ] S'assurer que tous les guides de développement sont cohérents

## 4. Nettoyage final 

- [ ] Vérifier s'il reste des références à l'ancienne architecture dans:
  - Fichiers de configuration CI/CD
  - Scripts de déploiement
  - Commentaires dans le code

## 5. Validation finale

- [ ] Valider les changements avec un commit Git
  ```bash
  git add .
  git commit -m "refactor: standardisation sur Next.js et nettoyage du projet"
  git push origin develop
  ```