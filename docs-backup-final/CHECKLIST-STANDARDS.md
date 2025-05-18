# Checklist des standards de développement

Utilisez cette checklist avant chaque commit pour vous assurer que vous respectez les standards du projet.

## ✅ Structure du code

- [ ] Le code frontend utilise uniquement Next.js
- [ ] Le code backend utilise uniquement NestJS
- [ ] Les composants suivent les conventions de nommage et d'organisation
- [ ] Les importations sont correctement organisées
- [ ] L'interface utilisateur respecte les styles TailwindCSS du projet

## ✅ Environnement de développement

- [ ] Aucune double implémentation n'a été créée
- [ ] Aucun fichier temporaire n'a été laissé dans le dépôt
- [ ] Les configurations Docker sont cohérentes
- [ ] Les variables d'environnement sont correctement définies
- [ ] Les scripts npm fonctionnent comme prévu

## ✅ Qualité du code

- [ ] Le code est typé avec TypeScript
- [ ] Le linter ne signale aucune erreur (`npm run lint`)
- [ ] Le format du code est cohérent (`npm run format`)
- [ ] Les fonctions et composants sont documentés
- [ ] Les erreurs potentielles sont gérées

## ✅ Documentation

- [ ] Mise à jour de la documentation si nécessaire
- [ ] Ajout d'une session dans SESSIONS.md si pertinent
- [ ] Les changements majeurs sont documentés dans DEVELOPMENT.md
- [ ] Les nouvelles configurations sont documentées dans CONFIGURATION.md

## ✅ Tests

- [ ] Les nouveaux composants ont des tests
- [ ] Les tests existants passent
- [ ] Les cas limites sont testés
- [ ] Les interactions utilisateur sont testées

## ✅ Git

- [ ] Le message de commit suit le format standard (`type(scope): description`)
- [ ] Les changements sont atomiques (une seule fonctionnalité par commit)
- [ ] Aucun fichier sensible n'est inclus dans le commit
- [ ] Aucun conflit n'est présent dans le code

---

Après avoir vérifié tous les points, vous pouvez valider vos changements et les soumettre. Si certains points ne sont pas respectés, corrigez-les avant de procéder au commit.