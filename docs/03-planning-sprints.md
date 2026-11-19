# Planning — 1 sprint = 1 jour

> Hypothèse : 5 jours de projet. Adapter si la durée réelle diffère (fusionner S4/S5 ou étaler S3).

## Équipe

| Membre       | Rôle projet                                                           | Domaine technique principal                               |
| ------------ | --------------------------------------------------------------------- | --------------------------------------------------------- |
| **Valentin** | Chef de projet (animation des rituels, Kanban, livrables, rapport IA) | Backend : API Express, modèle Mongoose, serveur Socket.io |
| **Edoardo**  | Développeur                                                           | Frontend : React, client Socket.io, dashboard statistique |

Les deux pistes avancent **en parallèle** chaque jour : le front se développe contre le contrat d'API défini dans le [dossier technique](02-dossier-technique.md#4-api-rest) (données simulées tant que la route n'est pas prête), puis s'intègre à l'API réelle dès qu'elle est mergée.

**Revue croisée :** chaque PR est relue par l'autre membre → Valentin relit le front, Edoardo relit le back. C'est aussi ce qui permet à chacun d'expliquer toute l'application en soutenance.

## Rituels (format journée)

| Moment           | Rituel                                                                                                      | Durée  | Animé par |
| ---------------- | ----------------------------------------------------------------------------------------------------------- | ------ | --------- |
| Début de journée | Sprint planning : choix des US du jour, assignation dans le Kanban                                          | 15 min | Valentin  |
| Midi             | Point d'avancement, déblocage, synchro des contrats API                                                     | 10 min | Valentin  |
| Fin de journée   | Démo croisée (chacun montre sa piste) + rétro (+ / − / à changer) + mise à jour du backlog et du rapport IA | 20 min | Valentin  |

Outil : GitHub Projects « Kanban User Stories » — colonnes `Backlog · To do · In progress · Review · Done`.

## Definition of Done

- Code poussé sur une branche, PR relue et approuvée par l'autre membre, mergée dans `develop`
- PR liée à son issue (`Closes #N`)
- Fonctionnalité testée manuellement (et route API testée via Postman/Thunder Client)
- Aucun secret dans le dépôt (`.env` ignoré, `.env.example` à jour)
- Documentation API mise à jour si une route change

## Workflow Git

- `main` : version stable / livrée — `develop` : intégration
- Branches `feat/<id>-<nom>` (ex : `feat/US02-create-ticket`), `fix/...`, `docs/...`
- Commits conventionnels : `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`
- Pour limiter les conflits : Valentin travaille dans `server/`, Edoardo dans `client/` ; les fichiers communs (README, docs) passent par des PR courtes

---

## Types d'éléments du backlog

Le temps du projet ne sert pas qu'aux fonctionnalités : cadrage, conception, environnement et documentation en consomment une part importante. Ils sont donc suivis dans le Kanban au même titre que les user stories.

| Type | Préfixe | Label | Exemple |
|------|---------|-------|---------|
| **User story** (valeur pour un utilisateur) | `US` | `must` / `should` / `could` | US02 — Déclarer un incident |
| **Tâche technique** (gestion de projet, conception, socle, outillage) | `TECH` | `tech` | TECH-10 — Initialisation du serveur Express |

Les deux types sont estimés en story points et comptent dans la vélocité.

## Sprint 1 — Cadrage & conception (17/11) — ✅ terminé

**Objectif :** savoir exactement quoi construire et comment.

| ID | Tâche | Qui | Pts | État |
|----|-------|-----|-----|------|
| TECH-01 | Cadrage fonctionnel : besoin, parties prenantes, personas, backlog MoSCoW, règles de gestion | Valentin | 5 | ✅ |
| TECH-02 | Conception technique : architecture, contrat d'API, événements Socket.io, points d'entrée serveur | Valentin | 5 | ✅ |
| TECH-03 | Dépôt Git et workflow (`main` / `develop`, `.gitignore`, README, conventions) | Valentin | 1 | ✅ |
| TECH-04 | Kanban GitHub Projects : 20 US, labels, accès partagé avec Edoardo | Valentin | 2 | ✅ |
| TECH-05 | Maquettes basse fidélité (5 écrans) — PR #21 à corriger puis merger | Edoardo | 3 | 🔍 en revue |
| TECH-06 | Environnement de dev : Node ≥ 20, cluster Atlas M0 partagé, `.env` | Les deux | 2 | ✅ |
| TECH-07 | Rapport IA — Sprint 1 | Valentin | 1 | ✅ |
| — | Relecture croisée du cadrage et du dossier technique | Les deux | — | ✅ |

**Vélocité Sprint 1 :** 16 pts terminés (+ 3 pts en revue).
**Livrables :** dossier de cadrage v1, dossier technique v0, maquettes.

## Sprint 2 — Données, socle API + squelette front

**Objectif :** modèle de données conçu et implémenté, API d'authentification et de tickets fonctionnelle, front initialisé avec l'authentification.

### Tâches techniques

| ID | Tâche | Qui | Pts | État |
|----|-------|-----|-----|------|
| TECH-08 | **Modélisation de la base de données** : MCD, MLD normalisé de référence, justification de la dénormalisation NoSQL, décisions table par table, schéma dénormalisé, index ([§3 du dossier technique](02-dossier-technique.md#3-modèle-de-données)) | Valentin | 3 | ✅ |
| TECH-09 | Initialisation du monorepo (`package.json` racine, npm workspaces, `npm run dev`) | Valentin | 1 | ⬜ |
| TECH-10 | Initialisation du serveur Express (ES Modules, `app.js` / `server.js`, Mongoose, erreurs, `/api/health`) | Valentin | 3 | ⬜ |
| TECH-11 | Implémentation des schémas Mongoose (5 modèles, validations, `priorityRank`, index) | Valentin | 3 | ⬜ |
| TECH-12 | Initialisation du client React (Vite, React Router, axios, proxy, layout) | Edoardo | 2 | ⬜ |
| TECH-13 | Script de seed (comptes et tickets de démo) | Valentin | 2 | ⬜ |
| TECH-14 | Collection Postman / tests de l'API | Valentin | 1 | ⬜ |
| TECH-15 | Rapport IA — Sprint 2 | Valentin | 1 | ⬜ |

### User stories

| US | Valentin — `server/` | Edoardo — `client/` | Pts |
|----|----------------------|---------------------|-----|
| US01 | Routes register / login / me, bcrypt, JWT | Pages Login / Register, `AuthContext` | 5 |
| US09 | Middlewares `auth` / `requireRole` | Routes protégées par rôle | 3 |
| US02 | `POST /tickets`, numéro `HD-XXXX`, `priorityRank` | Formulaire Nouveau ticket | 3 |
| US05 | Statut / assignation (RG2–RG5), historique imbriqué | — (UI au Sprint 3) | 3 |
| US06 | Routes commentaires (collection `comments`) | — (UI au Sprint 3) | 3 |

**Charge prévue :** 16 pts de tâches techniques (dont 3 déjà faits) + 17 pts d'US. Sprint chargé côté backend : si besoin, TECH-14 (Postman) glisse au Sprint 3 ; les US Must restent prioritaires.

**Ordre de réalisation backend :** TECH-09 → TECH-10 → TECH-11 → US01 → US09 → US02 → US05 → US06 → TECH-13 → TECH-14.

**Point d'intégration en fin de journée :** se connecter depuis le front et créer un ticket réel en base.

## Sprint 3 — Parcours complets

**Objectif :** parcours utilisateur, technicien et admin complets dans le navigateur.

| Valentin — `server/`                                       | Edoardo — `client/`                                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| US04 filtres / tri / pagination sur `GET /tickets`         | US03 Mes tickets, US04 file technicien avec filtres                                   |
| US11 assignation admin, US13 notes internes (filtrage RG6) | Page Détail ticket : fil de commentaires (US06), US13 notes internes, US12 historique |
| US14 routes `GET/PATCH /users`                             | US11 sélecteur d'assignation, US14 page gestion des utilisateurs                      |
| Mise à jour de la doc API                                  | Actions de statut dans le détail (US05)                                               |

## Sprint 4 — Temps réel & statistiques

**Objectif :** la valeur ajoutée « différenciante ».

| Valentin — `server/`                                                                  | Edoardo — `client/`                                                    |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Serveur Socket.io, auth JWT au handshake, rooms (`user:<id>`, `ticket:<id>`, `staff`) | `SocketContext` (connexion avec le token), join/leave des rooms ticket |
| Émission `ticket:created`, `ticket:updated`, `comment:created`, `notification:new`    | US07 mise à jour live du détail ticket, US08 toast + file live         |
| US15 modèle + routes notifications                                                    | US15 centre de notifications (badge non lues)                          |
| US10 endpoints `/stats/*` (Aggregation Pipeline)                                      | US10 dashboard (Recharts)                                              |
| COULD si avance : US18 SLA                                                            | COULD si avance : US16 « en train d'écrire »                           |

## Sprint 5 — Qualité, docs & soutenance

**Objectif :** livrer et savoir défendre.

| Valentin                                                          | Edoardo                                          |
| ----------------------------------------------------------------- | ------------------------------------------------ |
| Finaliser dossier technique (doc API, réflexion montée en charge) | Correctifs UI, responsive, états vides / erreurs |
| Rapport IA (analyse critique), README d'installation              | Test de bout en bout du scénario de démo         |
| Pilotage de la répétition de soutenance                           | Données de démo réalistes (seed) avec Valentin   |

**Ensemble :** répétition de la démo de 10 min + session de questions croisées. Valentin interroge Edoardo sur le back, Edoardo interroge Valentin sur le front.

### Scénario de démo (brouillon)

1. Sophie (user) se connecte, crée un ticket « Imprimante 2e étage HS » — priorité haute
2. Karim (tech), connecté dans un 2e navigateur, reçoit la notification **en direct**
3. Karim s'assigne le ticket, passe « En cours », pose une question → Sophie voit le message arriver **sans recharger**
4. Karim ajoute une note interne (invisible pour Sophie), puis résout
5. Nathalie (admin) ouvre le dashboard : volumes, délai moyen, charge par technicien

Proposition de répartition à l'oral : Valentin présente le contexte, l'architecture et les données (Mongo, agrégations, montée en charge) ; Edoardo pilote la démo et présente le front et le temps réel côté client.
