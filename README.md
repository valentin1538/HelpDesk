# Opale — Service desk IT (MERN)

<img src="docs/identite/opale-symbole.svg" width="64" alt="Logo Opale" />

*Le support IT, tout en clarté.*

Application web de ticketing : déclaration et suivi d'incidents, échanges utilisateur ↔ support en temps réel, tableau de bord statistique.

**Stack :** MongoDB · Mongoose · Express · React (Vite) · Node.js · Socket.io · Docker

## Documentation

- [Dossier de cadrage](docs/01-dossier-cadrage.md) — besoin, parties prenantes, fonctionnalités, backlog
- [Dossier technique](docs/02-dossier-technique.md) — architecture, modèle de données, API, temps réel, montée en charge
- [Planning des sprints](docs/03-planning-sprints.md)
- [Rapport d'utilisation de l'IA](docs/04-rapport-ia.md)
- [Charte graphique](docs/05-charte-graphique.md) — identité Opale, design system (guide vivant : `/styleguide`)

## Installation (Docker — méthode de référence)

Docker garantit le même environnement pour toute l'équipe : même version de Node (20), mêmes dépendances (`package-lock.json`), même MongoDB (8).

**Prérequis :** [Docker Desktop](https://www.docker.com/products/docker-desktop/) démarré (« Engine running »), Git.

```bash
git clone -b develop https://github.com/valentin1538/HelpDesk.git
cd HelpDesk
cp server/.env.example server/.env    # PowerShell : Copy-Item server/.env.example server/.env
```

Renseigner `JWT_SECRET` dans `server/.env` (n'importe quelle longue chaîne), puis :

```bash
docker compose up --build             # ou : npm run docker:up
```

Dans un second terminal, remplir la base avec les données de démo (voir [Comptes de démo](#comptes-de-démo)) :

```bash
docker compose exec server npm run seed
```

| Service | URL | Rôle |
|---------|-----|------|
| `client` | http://localhost:5173 | React (Vite), proxy `/api` et `/socket.io` vers l'API |
| `server` | http://localhost:5000/api/health | API Express + Socket.io |
| `mongo` | `mongodb://localhost:27017` (MongoDB Compass) | Base MongoDB 8 |

Le code est **monté dans les conteneurs** : toute modification sur l'hôte redémarre l'API (nodemon) ou met à jour la page (Vite) automatiquement.

### Commandes utiles

| Commande | Effet |
|----------|-------|
| `docker compose up --build` | Construit l'image si besoin et démarre tout (logs dans le terminal, `Ctrl+C` pour arrêter) |
| `docker compose up -d` | Démarre en arrière-plan |
| `docker compose logs -f server` | Suit les logs de l'API |
| `docker compose down` | Arrête et supprime les conteneurs (les données Mongo sont conservées) |
| `docker compose down -v` | Idem + **efface la base locale** |
| `docker compose exec server sh` | Ouvre un terminal dans le conteneur de l'API |

**Après un `git pull` qui modifie un `package.json` / `package-lock.json`** : relancer avec `docker compose up --build` pour réinstaller les dépendances dans l'image.

**Ajouter une dépendance** : `npm install <paquet> -w server` (ou `-w client`) sur l'hôte, commiter `package.json` + `package-lock.json`, puis `docker compose up --build`.

### Base de données

`MONGO_URI` dans `server/.env` choisit la base :

| Valeur | Usage |
|--------|-------|
| `mongodb://mongo:27017/helpdesk` (défaut) | Conteneur MongoDB local, données propres à chaque poste (remplies par le seed) |
| `mongodb+srv://…/helpdesk?…` | Cluster **MongoDB Atlas** partagé par l'équipe (accès + mot de passe à demander en privé, IP à autoriser dans *Network Access*) |

**Dépannage Atlas — `querySrv ECONNREFUSED`** : ajouter `DNS_SERVERS=1.1.1.1,8.8.8.8` dans `server/.env`.

### Dépannage Docker Desktop (Windows)

- **Port déjà utilisé (5000 / 5173)** : un `npm run dev` lancé hors Docker tourne encore → l'arrêter.
- **Docker Desktop ne démarre pas** (`remove …\engine.sock` / `dockerInference` : *Le système ne peut pas accéder au fichier*) : quitter Docker Desktop, exécuter `wsl --shutdown`, renommer les dossiers `%LOCALAPPDATA%\Docker\run` et `%LOCALAPPDATA%\docker-secrets-engine`, relancer Docker Desktop. Désactiver *Settings → AI → Docker Model Runner*.

## Installation sans Docker (alternative)

Prérequis : Node.js ≥ 20. Dans `server/.env`, utiliser une base joignable depuis l'hôte (Atlas, ou `mongodb://localhost:27017/helpdesk` avec `docker compose up mongo`).

```bash
npm install
npm run dev          # API (5000) + client (5173)
```

## Comptes de démo

Créés par le seed (`server/seed/`), mot de passe commun : **`Demo1234`**.

| Email | Rôle | Persona |
|-------|------|---------|
| `nathalie@helpdesk.test` | admin | Nathalie Roux — responsable support / DSI |
| `karim@helpdesk.test` | technician | Karim Benali — technicien |
| `thomas@helpdesk.test` | technician | Thomas Leroy — technicien |
| `sophie@helpdesk.test` | user | Sophie Martin — Comptabilité |
| `pierre@helpdesk.test` | user | Pierre Durand — Commercial |
| `julie@helpdesk.test` | user | Julie Bernard — Ressources humaines |
| `marc@helpdesk.test` | technician | Marc Petit — **compte désactivé** (connexion refusée, RG8) |

Le seed crée aussi **19 tickets** répartis sur les 30 derniers jours (4 ouverts, 4 en cours, 2 en attente, 3 résolus, 6 fermés), avec un historique qui rejoue les vraies règles (transitions RG3, prise en charge automatique RG4), des dates de prise en charge / résolution réalistes, **22 commentaires** (dont 4 notes internes) et **31 notifications**.

| Commande | Effet |
|----------|-------|
| `docker compose exec server npm run seed` | Remplit une base **vide** (refuse si des utilisateurs existent) |
| `docker compose exec server npm run seed -- --reset` | **Efface** utilisateurs, tickets, commentaires, notifications et compteurs, puis recrée les données de démo |

Le seed refuse de s'exécuter en production (`NODE_ENV=production`) et affiche la base ciblée avant toute écriture. Attention : avec un `MONGO_URI` Atlas partagé, `--reset` efface les données de toute l'équipe.
