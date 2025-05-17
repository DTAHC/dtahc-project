# Documentation DTAHC

Ce répertoire contient la documentation du projet DTAHC, qui est automatiquement publiée sur GitHub Pages à l'adresse [https://dtahc.github.io/dtahc-project/](https://dtahc.github.io/dtahc-project/).

## Structure de la documentation

- `index.md` - Page d'accueil de la documentation
- `getting-started.md` - Guide de démarrage rapide
- (d'autres fichiers seront ajoutés au fur et à mesure du développement)

## Comment contribuer à la documentation

1. Clonez le dépôt
2. Modifiez ou ajoutez des fichiers Markdown dans le dossier `docs/`
3. Créez une Pull Request vers la branche `main`
4. Après fusion, GitHub Actions déploiera automatiquement les changements sur GitHub Pages

## Format

La documentation utilise le format Markdown avec le thème Jekyll Cayman. Les pages sont automatiquement générées à partir des fichiers Markdown.

## Génération locale

Pour prévisualiser la documentation localement avant de la soumettre :

1. Installez Jekyll et ses dépendances selon [les instructions officielles](https://jekyllrb.com/docs/installation/)
2. Dans le dossier `docs/`, exécutez :

```bash
bundle install
bundle exec jekyll serve
```

3. Ouvrez votre navigateur à l'adresse [http://127.0.0.1:4000/dtahc-project/](http://127.0.0.1:4000/dtahc-project/)