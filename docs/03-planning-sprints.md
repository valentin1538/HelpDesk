# Planning — 1 sprint = 1 jour

> Hypothèse : 5 jours de projet. Adapter si la durée réelle diffère (fusionner S4/S5 ou étaler S3).

## Rituels (format journée)

| Moment | Rituel | Durée |
|--------|--------|-------|
| Début de journée | Sprint planning : choix des US du jour, répartition | 15 min |
| Midi | Daily / point d'avancement, déblocage | 10 min |
| Fin de journée | Démo interne + rétro rapide (+ / − / à changer) + mise à jour du backlog | 20 min |

Outils : tableau Kanban (GitHub Projects / Trello) — colonnes `Backlog · To do · In progress · Review · Done`.

## Definition of Done

- Code poussé sur une branche, revu par un autre membre, mergé dans `develop`
- Fonctionnalité testée manuellement (et route API testée via Postman/Thunder Client)
- Aucun secret dans le dépôt (`.env` ignoré, `.env.example` à jour)
- Documentation API mise à jour si une route change

## Workflow Git

- `main` : version stable / livrée — `develop` : intégration
- Branches `feat/<id>-<nom>` (ex : `feat/US02-create-ticket`), `fix/...`, `docs/...`
- Commits conventionnels : `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`

---

## Sprint 1 — Cadrage & conception (aujourd'hui)

**Objectif :** savoir exactement quoi construire et comment.

- [x] Analyse du besoin, parties prenantes, personas
- [x] Fonctionnalités + backlog MoSCoW en user stories
- [x] Règles de gestion
- [x] Architecture, modèle de données, contrat d'API, événements Socket.io
- [ ] Créer le dépôt Git (monorepo `server/` + `client/`), `.gitignore`, README
- [ ] Créer le tableau Kanban avec les US
- [ ] Maquettes basse fidélité (Figma/Excalidraw) : login, mes tickets, détail ticket, file technicien, dashboard
- [ ] Démarrer le rapport d'utilisation de l'IA

**Livrable :** dossier de cadrage v1, dossier technique v0.

## Sprint 2 — Socle backend (API)

**Objectif :** API REST fonctionnelle et sécurisée, testable sans front.

- Init Express, connexion Mongoose, structure en couches, gestion d'erreurs centralisée
- Modèles `User`, `Ticket`, `Comment`, `Notification`, `Counter`
- US01 auth (register/login/me, bcrypt, JWT) + US09 middlewares `auth` / `requireRole`
- US02 création ticket, US05 changement statut/assignation (+ règles RG2–RG5), US06 commentaires
- Script de seed (comptes de démo + tickets)
- Collection Postman exportée

## Sprint 3 — Front React

**Objectif :** parcours complets utilisateur et technicien dans le navigateur.

- Init Vite + React Router + client API (axios avec intercepteur JWT) + AuthContext
- Pages : Login/Register, Mes tickets, Nouveau ticket, Détail ticket (fil de commentaires), File technicien avec filtres
- US11 assignation admin, US12 historique, US13 notes internes, US14 gestion utilisateurs
- Garde de routes par rôle

## Sprint 4 — Temps réel & statistiques

**Objectif :** la valeur ajoutée « différenciante ».

- Serveur Socket.io avec auth JWT au handshake, rooms (`user:<id>`, `ticket:<id>`, `staff`)
- US07 commentaires + statut en direct, US08 notification nouveau ticket, US15 centre de notifications
- US10 endpoints stats (Aggregation Pipeline) + dashboard (graphiques Recharts)
- COULD si avance : US16 « en train d'écrire », US18 SLA

## Sprint 5 — Qualité, docs & soutenance

**Objectif :** livrer et savoir défendre.

- Correctifs, tests de bout en bout du scénario de démo
- Finaliser dossier technique (doc API, réflexion montée en charge)
- README d'installation, rapport IA (analyse critique)
- Scénario de démo 10 min + répétition, chaque membre sait expliquer chaque partie

### Scénario de démo (brouillon)

1. Sophie (user) se connecte, crée un ticket « Imprimante 2e étage HS » — priorité haute
2. Karim (tech), connecté dans un 2e navigateur, reçoit la notification **en direct**
3. Karim s'assigne le ticket, passe « En cours », pose une question → Sophie voit le message arriver **sans recharger**
4. Karim ajoute une note interne (invisible pour Sophie), puis résout
5. Nathalie (admin) ouvre le dashboard : volumes, délai moyen, charge par technicien

---

## Répartition proposée (à adapter à l'équipe)

| Domaine | Responsable principal | Binôme de revue |
|---------|----------------------|-----------------|
| Backend API & modèle | Membre A | Membre B |
| Front React | Membre B | Membre C |
| Temps réel & stats | Membre C | Membre A |
| Docs / gestion de projet | Tournant | — |

> Chaque membre doit pouvoir expliquer toute l'application en soutenance : faire tourner les revues de code entre domaines.
