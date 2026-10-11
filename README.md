# Swiss Curriculum Vitae

Un CV en une page A4, écrit en Vue et Tailwind CSS. Le contenu vient d'un fichier JSON, modifiable directement dans le navigateur, et l'export PDF se fait depuis le navigateur.

## Interface

La barre du haut permet de choisir la candidature à afficher, d'ouvrir l'éditeur, d'afficher la grille de 12 colonnes et d'exporter en PDF.

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

Chaque fichier de `src/src/candidatures/` est une candidature au format JSON. `default.json` sert de modèle, et la forme attendue est décrite dans `src/src/types.ts`. La candidature affichée se choisit dans la barre du haut ou avec `?cv=nom-du-fichier` dans l'adresse.

## Édition en ligne

Le bouton **Éditer** ouvre un panneau avec le JSON du CV. L'aperçu se met à jour à chaque frappe, et une erreur s'affiche si le JSON est invalide ou ne respecte pas la structure attendue.

- Les modifications sont enregistrées dans le navigateur (`localStorage`), par candidature. Elles ne quittent pas votre appareil.
- **Exporter** télécharge le JSON, **Importer** en charge un. C'est la sauvegarde à garder, car vider les données du navigateur efface les modifications.
- **Réinitialiser** revient à la version du fichier du projet.
- **Photo** ajoute une image depuis votre ordinateur. Elle est réduite à 800 px, gardée dans le navigateur (IndexedDB) et référencée dans le JSON par `"photo": "local:nom.jpg"`. Elle n'est pas incluse dans l'export JSON : sur un autre navigateur, il faut la rajouter.

## Déploiement

Le site est statique. Le `Dockerfile` construit le site avec Node, puis le sert avec [static-web-server](https://static-web-server.net) (environ 17 Mo en tout, sans shell dans l'image finale).

Une GitHub Action (`.github/workflows/docker.yml`) construit l'image à chaque push sur `main` et la publie sur `ghcr.io/untypequicode/swiss-curriculum-vitae` (tags `latest` et le hash du commit). Le `docker-compose.yaml` utilise cette image, sans rien construire sur le serveur :

```sh
docker compose pull && docker compose up -d
```

### En local

Pour construire l'image au lieu de la télécharger et ouvrir le port :

```sh
cp docker-compose.override.yml.example docker-compose.override.yml
docker compose up --build
```

Le site est alors sur `http://localhost:8080`. Le fichier `docker-compose.override.yml` est ignoré par git.

### Configuration du serveur

La configuration du serveur est dans `docker/sws.toml` :

- cache d'un an pour `assets/`, dont les noms contiennent une empreinte, et d'une semaine pour les polices et les photos
- `index.html` toujours revalidé, compression gzip, route `/health` pour la supervision
- en-têtes de sécurité, dont une politique `Content-Security-Policy` stricte (pas de script externe)
- conteneur en lecture seule, sans privilèges et sans capacités Linux

Tous les fichiers de `src/src/candidatures/` et de `src/public/` sont publiés. Retirez ceux qui contiennent des données personnelles dont vous ne voulez pas, ou ajoutez-les à `.dockerignore`.
