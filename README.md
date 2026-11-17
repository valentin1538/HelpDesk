# HelpDesk IT — Application de gestion d'incidents (MERN)

Application web de ticketing : déclaration et suivi d'incidents, échanges utilisateur ↔ support en temps réel, tableau de bord statistique.

**Stack :** MongoDB · Mongoose · Express · React (Vite) · Node.js · Socket.io

## Documentation

- [Dossier de cadrage](docs/01-dossier-cadrage.md) — besoin, parties prenantes, fonctionnalités, backlog
- [Dossier technique](docs/02-dossier-technique.md) — architecture, modèle de données, API, temps réel, montée en charge
- [Planning des sprints](docs/03-planning-sprints.md)
- [Rapport d'utilisation de l'IA](docs/04-rapport-ia.md)

## Installation

> À compléter au Sprint 2/3.

Prérequis : Node.js ≥ 20, MongoDB ≥ 6 (local ou Atlas).

```bash
# Backend
cd server
cp .env.example .env   # renseigner MONGO_URI, JWT_SECRET, CLIENT_URL
npm install
npm run seed           # comptes de démo
npm run dev

# Frontend
cd client
npm install
npm run dev
```

## Comptes de démo

_À compléter après le seed._
