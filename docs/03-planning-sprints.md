# Planning — 1 sprint = 1 jour

> Hypothèse : 5 jours de projet. Adapter si la durée réelle diffère (fusionner S4/S5 ou étaler S3).

## Équipe

| Membre       | Rôle projet                                                           | Développement              |
| ------------ | --------------------------------------------------------------------- | -------------------------- |
| **Valentin** | Chef de projet (animation des rituels, Kanban, livrables, rapport IA) | Full-stack, par user story |
| **Edoardo**  | Développeur                                                           | Full-stack, par user story |

**Répartition par user story (à partir du Sprint 2).** Chaque US est prise en charge **de bout en bout** par un seul membre : modèle, route API, règles métier, écran React et test. Au Sprint 1, la répartition se faisait par couche (back / front) ; nous l'avons abandonnée car elle créait des dépendances d'attente entre nous et cantonnait chacun à une moitié de l'application.

Bénéfices :

- **chacun touche à tout** (Mongoose, Express, Socket.io, React) et peut expliquer n'importe quelle partie en soutenance ;
- une US est **livrable et testable seule** (une PR = une fonctionnalité complète) ;
- moins d'attente : celui qui écrit la route écrit aussi l'écran qui l'appelle.

**Contrats partagés** (fixés avant de coder, pour que les US avancent en parallèle) : format des erreurs `{ error: { code, message } }`, JWT transmis en `Authorization: Bearer <token>` avec la charge `{ sub: <userId>, role }`, routes et réponses du [dossier technique](02-dossier-technique.md#4-api-rest).

**Revue croisée :** chaque PR est relue et approuvée par l'autre membre avant le merge.

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
- Pour limiter les conflits (on touche tous les deux `server/` et `client/`) : PR **petites et fréquentes** (une par US), `git pull` de `develop` avant de commencer et avant d'ouvrir la PR ; les points d'assemblage partagés (montage des routes dans `routes/index.js`, déclaration des pages dans le routeur React) ne reçoivent qu'**une ligne par US**

---

## Types d'éléments du backlog

Le temps du projet ne sert pas qu'aux fonctionnalités : cadrage, conception, environnement et documentation en consomment une part importante. Ils sont donc suivis dans le Kanban au même titre que les user stories.

| Type                                                                  | Préfixe | Label                       | Exemple                                     |
| --------------------------------------------------------------------- | ------- | --------------------------- | ------------------------------------------- |
| **User story** (valeur pour un utilisateur)                           | `US`    | `must` / `should` / `could` | US02 — Déclarer un incident                 |
| **Tâche technique** (gestion de projet, conception, socle, outillage) | `TECH`  | `tech`                      | TECH-10 — Initialisation du serveur Express |

Les deux types sont estimés en story points et comptent dans la vélocité.

## Sprint 1 — Cadrage & conception (17/11) — ✅ terminé

**Objectif :** savoir exactement quoi construire et comment.

| ID      | Tâche                                                                                             | Qui      | Pts | État |
| ------- | ------------------------------------------------------------------------------------------------- | -------- | --- | ---- |
| TECH-01 | Cadrage fonctionnel : besoin, parties prenantes, personas, backlog MoSCoW, règles de gestion      | Valentin | 5   | ✅   |
| TECH-02 | Conception technique : architecture, contrat d'API, événements Socket.io, points d'entrée serveur | Valentin | 5   | ✅   |
| TECH-03 | Dépôt Git et workflow (`main` / `develop`, `.gitignore`, README, conventions)                     | Valentin | 1   | ✅   |
| TECH-04 | Kanban GitHub Projects : 20 US, labels, accès partagé avec Edoardo                                | Valentin | 2   | ✅   |
| TECH-05 | Maquettes basse fidélité (5 écrans) — [docs/maquettes](maquettes/maquettes.png)                   | Edoardo  | 3   | ✅   |
| TECH-06 | Environnement de dev : Node ≥ 20, cluster Atlas M0 partagé, `.env`                                | Les deux | 2   | ✅   |
| TECH-07 | Rapport IA — Sprint 1                                                                             | Valentin | 1   | ✅   |
| —       | Relecture croisée du cadrage et du dossier technique                                              | Les deux | —   | ✅   |

**Vélocité Sprint 1 :** 19 pts terminés.
**Livrables :** dossier de cadrage v1, dossier technique v0, maquettes.

## Sprint 2 — Données, socle API + squelette front (19–20/11, prolongé d'une journée)

**Objectif :** modèle de données conçu et implémenté, API d'authentification et de tickets fonctionnelle, front initialisé avec l'authentification.

### Tâches techniques

| ID      | Tâche                                                                                                                                                                                                                                              | Qui                 | Pts | État      |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | --- | --------- |
| TECH-08 | **Modélisation de la base de données** : MCD, MLD normalisé de référence, justification de la dénormalisation NoSQL, décisions table par table, schéma dénormalisé, index ([§3 du dossier technique](02-dossier-technique.md#3-modèle-de-données)) | Valentin            | 3   | ✅        |
| TECH-09 | Initialisation du monorepo (`package.json` racine, npm workspaces, `npm run dev`) — PR #37                                                                                                                                                         | Valentin            | 1   | ✅        |
| TECH-16 | **Dockerisation** de l'environnement (compose : mongo, server, client) — PR #37                                                                                                                                                                    | Valentin            | 3   | ✅        |
| TECH-10 | Finalisation du serveur Express (erreurs centralisées, 404, arrêt propre, `routes/index.js`)                                                                                                                                                       | Valentin            | 3   | ✅ PR #39 |
| TECH-11 | Implémentation des schémas Mongoose (5 modèles, validations, `priorityRank`, index)                                                                                                                                                                | Valentin            | 3   | ✅ PR #40 |
| TECH-12 | Initialisation du client React (React Router, axios + JWT, layout des maquettes)                                                                                                                                                                   | Edoardo             | 2   | ✅ PR #44 |
| TECH-13 | Script de seed (comptes et tickets de démo)                                                                                                                                                                                                        | Valentin _(repris)_ | 2   | ✅ PR #47 |
| TECH-14 | Collection Postman / tests de l'API                                                                                                                                                                                                                | Valentin            | 1   | ✅ PR #43 |
| TECH-15 | Rapport IA — Sprint 2                                                                                                                                                                                                                              | Valentin            | 1   | ⬜        |

Les tâches techniques restent réparties selon leur nature : **TECH-10 / TECH-11** posent le socle serveur dont dépendent toutes les US, **TECH-12** le socle client. Elles sont faites **en premier, en parallèle**, puis chacun enchaîne sur ses US.

### User stories — répartition par US (full-stack)

| US                                  | Responsable  | Contenu de bout en bout                                                                                                                                | Pts |
| ----------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| **US01** — Inscription et connexion | **Valentin** | Hash du mot de passe (hook `User`), routes `register` / `login` / `me`, génération du JWT · pages Login / Register, `AuthContext` (token, déconnexion) | 5   |
| **US09** — Protection par rôle      | **Edoardo**  | Middlewares `auth` (vérif. JWT, compte actif) et `requireRole` · composant de route protégée côté React, redirections selon le rôle                    | 3   |
| **US02** — Déclarer un incident     | **Edoardo**  | `POST /api/tickets` (validation, numéro `HD-XXXX`, `priorityRank`, historique « created ») · formulaire Nouveau ticket                                 | 3   |
| **US05** — Statut et assignation    | **Valentin** | `PATCH /status` et `/assign` (transitions RG3, auto-assignation RG4, historique RG5, dates de suivi) · boutons d'action minimaux sur le détail ticket  | 3   |
| **US06** — Commentaires             | **Edoardo**  | `GET` / `POST /api/tickets/:id/comments` (droits, RG7) · fil de commentaires minimal sur le détail ticket                                              | 3   |

**Charge restante :** Valentin 3 (TECH-10) + 3 (TECH-11) + 5 (US01) + 3 (US05) + 1 (TECH-14) + 1 (TECH-15) = **16 pts** · Edoardo 2 (TECH-12) + 3 (US09) + 3 (US02) + 3 (US06) + 2 (TECH-13) = **13 pts**.

**Ordre et dépendances**

| Étape | Valentin                                         | Edoardo                                                                                |
| ----- | ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| 1     | TECH-10 puis TECH-11 (modèles)                   | TECH-12 (client)                                                                       |
| 2     | US01 (dès que `User` existe)                     | US09 : le middleware s'écrit contre le contrat JWT `{ sub, role }`, sans attendre US01 |
| 3     | US05 (dès que `Ticket` existe)                   | US02, puis US06                                                                        |
| 4     | TECH-14 (Postman sur toutes les routes), TECH-15 | TECH-13 (seed : utilise les modèles et le hash de US01)                                |

Si le sprint déborde : US06 puis TECH-13 glissent au Sprint 3 ; authentification, droits et création de ticket restent prioritaires.

**Point d'intégration en fin de journée :** se connecter depuis le front et créer un ticket réel en base.

**Prolongation (20/11).** La dockerisation de l'environnement (TECH-16), imposée en cours de sprint, et le dépannage de Docker Desktop sous Windows ont consommé environ une demi-journée. Le sprint est prolongé d'un jour plutôt que de sacrifier un Must : les US d'authentification, de droits et de création de ticket restent prioritaires.

**Réajustement de la répartition (20/11).** Edoardo concentre son temps sur US09 (première US full-stack de son côté, avec middleware serveur, gardes de routes et navigation filtrée). Pour tenir l'objectif du sprint, Valentin reprend US02, US06 et TECH-13. Pour que chacun puisse expliquer toute l'application en soutenance, chaque PR reste relue par l'autre membre.

### Bilan du Sprint 2 (20/11) — ✅ clos

| Élément                                                               | Responsable                  | Pts   | État           |
| --------------------------------------------------------------------- | ---------------------------- | ----- | -------------- |
| TECH-08 — modélisation de la base de données                          | Valentin                     | 3     | ✅             |
| TECH-09 / TECH-16 — monorepo + Docker                                 | Valentin                     | 1 + 3 | ✅ PR #37      |
| TECH-10 — socle serveur Express                                       | Valentin                     | 3     | ✅ PR #39      |
| TECH-11 — schémas Mongoose                                            | Valentin                     | 3     | ✅ PR #40      |
| TECH-12 — client React                                                | Edoardo                      | 2     | ✅ PR #44      |
| TECH-13 — seed                                                        | Valentin                     | 2     | ✅ PR #47      |
| TECH-14 — collection Postman                                          | Valentin                     | 1     | ✅ PR #43      |
| US01 — inscription et connexion                                       | Valentin                     | 5     | ✅ PR #41      |
| US21 — identité Opale et design system _(ajoutée en cours de sprint)_ | Valentin                     | 5     | ✅ PR #46      |
| US02 — déclarer un incident                                           | Valentin                     | 3     | ✅ PR #48      |
| US05 — statut et assignation (back + page détail)                     | Valentin                     | 3     | ✅ PR #42, #49 |
| US06 — commentaires                                                   | Valentin                     | 3     | ✅ PR #50      |
| Audit de fin de sprint (correctifs)                                   | Valentin                     | —     | ✅ PR #52      |
| US09 — protection des routes par rôle                                 | Edoardo (relue par Valentin) | 3     | ✅ PR #53      |
| TECH-15 — rapport IA du sprint                                        | Valentin                     | 1     | ✅ PR TECH-15  |

**Vélocité Sprint 2 :** 41 pts livrés sur 41 prévus (dont US21, 5 pts, ajoutée en cours de sprint). Sprint 2 clos le 20/11.

**Audit de fin de sprint** (relecture du code fusionné, tests automatiques, parcours par rôle) :

- tests : lint, Prettier (code), build, `npm audit` (0 vulnérabilité) ✅ · seed + 9 contrôles transverses (RG1, RG6 sur les 19 tickets, RG7, RG8) ✅ · **collection Postman complète : 39 requêtes, 120 assertions, 0 échec** · parcours demandeur / technicien sur la page détail (notes internes masquées / visibles) ✅
- **corrigé** : `isInternal: "false"` (chaîne) créait une **note interne** (validation trop permissive) ; doublons possibles dans « messages précédents » après un envoi ; erreur de validation affichée deux fois dans le fil
- **intégration d’US09** : seuls les fichiers de la US repris, deux défauts corrigés à la relecture (carte utilisateur / déconnexion, page 404) ; routes et menu vérifiés pour les trois rôles

**Rétrospective**

- ➕ répartition par US full-stack, design system commun dès le Sprint 2, tests systématiques (API, Postman, navigateur) qui ont attrapé plusieurs vrais bugs avant la démo
- ➖ Docker imposé en cours de sprint (≈ ½ journée) ; deux PR ouvertes vers `main` au lieu de `develop` ; travail non poussé découvert tardivement
- 🔁 à changer : base `develop` vérifiée à chaque PR ; `git push` + PR ouverte **avant** d'annoncer une tâche finie ; point de synchronisation de mi-journée maintenu

> À partir du Sprint 3, les colonnes « back / front » ci-dessous sont indicatives : la répartition se fait par US au sprint planning du jour.

## Sprint 3 — Parcours complets

**Objectif :** chaque rôle a son parcours complet dans le navigateur — le collaborateur suit **ses** tickets, le support travaille depuis **une file triée par urgence**, l'administrateur **assigne** et **gère les comptes** — et chaque PR est vérifiée automatiquement.

### Backlog du sprint (colonne Ready du Kanban)

| Élément                              | Responsable | Pts | Contenu                                                                                                                                                                                                       |
| ------------------------------------ | ----------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **US04** — File du support           | Valentin    | 5   | `GET /api/tickets` (vue support) : filtres statut / priorité / catégorie / assigné, tri par urgence puis ancienneté, pagination ; page « File du support » (compteurs, « Prendre en charge » depuis la liste) |
| **US03** — Mes tickets               | Valentin    | 3   | Même route `GET /api/tickets`, vue collaborateur (RG1) ; page « Mes tickets » avec onglets de statut                                                                                                          |
| **US11** — Assignation par l'admin   | Valentin    | 2   | `GET /api/staff` (membres actifs du support) + sélecteur d'assignation dans le panneau Gestion ; notification `ticket_assigned` enregistrée                                                                   |
| **US12** — Historique (finalisation) | Valentin    | 2   | `PATCH /api/tickets/:id/priority` (support) + sélecteur de priorité dans le panneau Gestion ; entrée `priority_changed` lisible dans la frise _(frise, statut et assignation déjà livrés au Sprint 2)_        |
| **US14** — Gestion des utilisateurs  | **Edoardo** | 3   | `GET` / `PATCH /api/users` (admin, `requireRole`), garde-fous (pas d'auto-désactivation), page « Utilisateurs »                                                                                               |
| **TECH-17** — Intégration continue   | **Edoardo** | 2   | GitHub Actions sur chaque PR : formatage, lint, build, seed + collection Postman                                                                                                                              |
| **TECH-18** — Rapport IA du Sprint 3 | Valentin    | 1   | Prompts clés et analyse critique                                                                                                                                                                              |
| ~~US13~~ — Notes internes            | —           | —   | ✅ déjà livrée avec US06 (PR #50, #52) : fermée                                                                                                                                                               |

**Charge :** Valentin 13 pts · Edoardo 5 pts — total 18 pts (vélocité du Sprint 2 : 41 pts sur deux jours, dont une partie du socle).

### Pourquoi cette répartition

Valentin prend le **chemin critique** : US03 et US04 partagent la même route `GET /api/tickets`, et US11 / US12 modifient tous deux le panneau « Gestion » de la page détail. Les confier à une même personne évite les conflits et les attentes.

Edoardo prend deux éléments **non bloquants**, sur lesquels personne n'attend et qui ne touchent pas les fichiers de Valentin :

| Élément d'Edoardo | Fichiers propres                                                                                                                                                | Points de contact (une ligne chacun)                                                                                                          | Dépendances                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| US14              | `server/src/routes/userRoutes.js`, `services/userService.js`, `controllers/userController.js`, `client/src/pages/AdminUsersPage.jsx`, `client/src/api/users.js` | `routes/index.js` (ligne US14 déjà prévue), `App.jsx` (une route sous la garde admin), `constants/navigation.js` (un lien `roles: ['admin']`) | aucune : réutilise `requireRole` (son US09) et le design system |
| TECH-17           | `.github/workflows/ci.yml`                                                                                                                                      | README (badge)                                                                                                                                | aucune                                                          |

**Contrat pour éviter tout chevauchement :** US11 n'utilise **pas** la route d'US14. La liste des assignables vient de `GET /api/staff` (route propre à US11, accessible au support), tandis que `GET /api/users` (US14) reste réservée à l'administrateur pour la gestion des comptes. Les deux US avancent donc en parallèle sans s'attendre.

### Ordre de réalisation

| Étape | Valentin                                                  | Edoardo                                         |
| ----- | --------------------------------------------------------- | ----------------------------------------------- |
| 1     | US04 + US03 (route de liste commune, puis les deux pages) | US14 — API (`GET` / `PATCH /api/users`) + tests |
| 2     | US11 (`GET /api/staff`, sélecteur d'assignation)          | US14 — page « Utilisateurs »                    |
| 3     | US12 (changement de priorité)                             | TECH-17 — CI GitHub Actions                     |
| 4     | TECH-18 — rapport IA, audit de fin de sprint              | Relecture des PR de Valentin                    |

**Rappels (rétrospective du Sprint 2)** : une PR par élément, **vers `develop`**, poussée avant d'annoncer la tâche terminée ; `npm run format` (configuration du projet) avant chaque commit ; mise à jour de la collection Postman avec chaque route ; vérification dans le navigateur pour chaque rôle concerné. Fin de sprint : audit puis version `develop` → `main` (merge commit).

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
