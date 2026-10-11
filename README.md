# Swiss Curriculum Vitae

Un CV en une page A4, écrit en Vue et Tailwind CSS. Le contenu vient d'un fichier JavaScript et l'export PDF se fait depuis le navigateur.

## Interface

La barre du haut permet de choisir la candidature à afficher, d'afficher la grille de 12 colonnes et d'exporter en PDF.

![Interface](docs/screenshot.png)

## Résultat

Le PDF exporté garde le texte sélectionnable, sauf la numérotation des sections.

[Voir le PDF](docs/default.pdf)

![CV exporté](docs/default.png)

## Utilisation

```sh
cd src
pnpm install
pnpm dev
```

Chaque fichier de `src/src/candidatures/` est une candidature. `default.js` sert de modèle, et la forme attendue est décrite dans `src/src/types.ts`. La candidature affichée se choisit dans la barre du haut ou avec `?cv=nom-du-fichier` dans l'adresse.
