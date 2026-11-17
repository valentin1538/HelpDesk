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

### Base de données — MongoDB Atlas

Le projet utilise un cluster Atlas **M0 (gratuit)** partagé par l'équipe.

1. Demander l'accès au projet Atlas « HelpDesk » (Access Manager) et le mot de passe de l'utilisateur `helpdesk_app` (en privé, jamais via Git).
2. Ajouter son adresse IP dans *Network Access*.
3. Copier `server/.env.example` en `server/.env` et renseigner `MONGO_URI` (avec `/helpdesk` avant le `?`).

**Dépannage — `querySrv ECONNREFUSED`** : le DNS local (VPN, antivirus, DNS du navigateur…) ne résout pas les enregistrements SRV utilisés par `mongodb+srv://`. Ajouter `DNS_SERVERS=1.1.1.1,8.8.8.8` dans `server/.env`.

## Comptes de démo

_À compléter après le seed._
