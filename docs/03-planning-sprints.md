# Planning — 1 sprint = 1 jour

> Hypothèse : 5 jours de projet. Adapter si la durée réelle diffère (fusionner S4/S5 ou étaler S3).

## Équipe

| Membre | Rôle projet | Domaine technique principal |
|--------|-------------|-----------------------------|
| **Valentin** | Chef de projet (animation des rituels, Kanban, livrables, rapport IA) | Backend : API Express, modèle Mongoose, serveur Socket.io |
| **Edoardo** | Développeur | Frontend : React, client Socket.io, dashboard statistique |

Les deux pistes avancent **en parallèle** chaque jour : le front se développe contre le contrat d'API défini dans le [dossier technique](02-dossier-technique.md#4-api-rest) (données simulées tant que la route n'est pas prête), puis s'intègre à l'API réelle dès qu'elle est mergée.

**Revue croisée :** chaque PR est relue par l'autre membre → Valentin relit le front, Edoardo relit le back. C'est aussi ce qui permet à chacun d'expliquer toute l'application en soutenance.

## Rituels (format journée)

| Moment | Rituel | Durée | Animé par |
|--------|--------|-------|-----------|
| Début de journée | Sprint planning : choix des US du jour, assignation dans le Kanban | 15 min | Valentin |
| Midi | Point d'avancement, déblocage, synchro des contrats API | 10 min | Valentin |
| Fin de journée | Démo croisée (chacun montre sa piste) + rétro (+ / − / à changer) + mise à jour du backlog et du rapport IA | 20 min | Valentin |

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

## Sprint 1 — Cadrage & conception (aujourd'hui)

**Objectif :** savoir exactement quoi construire et comment.

| Tâche | Qui | État |
|-------|-----|------|
| Analyse du besoin, parties prenantes, personas | Valentin | ✅ |
| Fonctionnalités + backlog MoSCoW en user stories, règles de gestion | Valentin | ✅ |
| Architecture, modèle de données, contrat d'API, événements Socket.io | Valentin | ✅ |
| Dépôt Git (`main` + `develop`), `.gitignore`, README | Valentin | ✅ |
| Kanban GitHub Projects avec les 20 US (#1 → #20) | Valentin | ✅ |
| Démarrer le rapport d'utilisation de l'IA | Valentin | ✅ |
| Donner l'accès au Kanban à Edoardo | Valentin | ⬜ |
| Maquettes basse fidélité (Excalidraw/Figma) : login, mes tickets, nouveau ticket, détail ticket, file technicien, dashboard → `docs/maquettes/` | Edoardo | ⬜ |
| Relecture croisée du cadrage et du dossier technique | Les deux | ⬜ |
| Préparer l'environnement : Node ≥ 20, MongoDB (local ou Atlas partagé) | Les deux | ⬜ |

**Livrable :** dossier de cadrage v1, dossier technique v0, maquettes.

## Sprint 2 — Socle API + squelette front

**Objectif :** API d'authentification et de tickets fonctionnelle ; front initialisé avec authentification.

| Valentin — `server/` | Edoardo — `client/` |
|----------------------|---------------------|
| Init Express, connexion Mongoose, structure en couches, gestion d'erreurs centralisée | Init Vite + React Router, layout, navigation |
| Modèles `User`, `Ticket`, `Comment`, `Notification`, `Counter` | Client axios (intercepteur JWT) + `AuthContext` |
| US01 auth (register/login/me) + US09 middlewares `auth` / `requireRole` | US01 pages Login / Register, US09 routes protégées par rôle |
| US02 création ticket, US05 statut/assignation (RG2–RG5), US06 commentaires | US02 formulaire Nouveau ticket |
| Script de seed (comptes de démo + tickets), collection Postman | |

**Point d'intégration en fin de journée :** se connecter depuis le front et créer un ticket réel.

## Sprint 3 — Parcours complets

**Objectif :** parcours utilisateur, technicien et admin complets dans le navigateur.

| Valentin — `server/` | Edoardo — `client/` |
|----------------------|---------------------|
| US04 filtres / tri / pagination sur `GET /tickets` | US03 Mes tickets, US04 file technicien avec filtres |
| US11 assignation admin, US13 notes internes (filtrage RG6) | Page Détail ticket : fil de commentaires (US06), US13 notes internes, US12 historique |
| US14 routes `GET/PATCH /users` | US11 sélecteur d'assignation, US14 page gestion des utilisateurs |
| Mise à jour de la doc API | Actions de statut dans le détail (US05) |

## Sprint 4 — Temps réel & statistiques

**Objectif :** la valeur ajoutée « différenciante ».

| Valentin — `server/` | Edoardo — `client/` |
|----------------------|---------------------|
| Serveur Socket.io, auth JWT au handshake, rooms (`user:<id>`, `ticket:<id>`, `staff`) | `SocketContext` (connexion avec le token), join/leave des rooms ticket |
| Émission `ticket:created`, `ticket:updated`, `comment:created`, `notification:new` | US07 mise à jour live du détail ticket, US08 toast + file live |
| US15 modèle + routes notifications | US15 centre de notifications (badge non lues) |
| US10 endpoints `/stats/*` (Aggregation Pipeline) | US10 dashboard (Recharts) |
| COULD si avance : US18 SLA | COULD si avance : US16 « en train d'écrire » |

## Sprint 5 — Qualité, docs & soutenance

**Objectif :** livrer et savoir défendre.

| Valentin | Edoardo |
|----------|---------|
| Finaliser dossier technique (doc API, réflexion montée en charge) | Correctifs UI, responsive, états vides / erreurs |
| Rapport IA (analyse critique), README d'installation | Test de bout en bout du scénario de démo |
| Pilotage de la répétition de soutenance | Données de démo réalistes (seed) avec Valentin |

**Ensemble :** répétition de la démo de 10 min + session de questions croisées. Valentin interroge Edoardo sur le back, Edoardo interroge Valentin sur le front.

### Scénario de démo (brouillon)

1. Sophie (user) se connecte, crée un ticket « Imprimante 2e étage HS » — priorité haute
2. Karim (tech), connecté dans un 2e navigateur, reçoit la notification **en direct**
3. Karim s'assigne le ticket, passe « En cours », pose une question → Sophie voit le message arriver **sans recharger**
4. Karim ajoute une note interne (invisible pour Sophie), puis résout
5. Nathalie (admin) ouvre le dashboard : volumes, délai moyen, charge par technicien

Proposition de répartition à l'oral : Valentin présente le contexte, l'architecture et les données (Mongo, agrégations, montée en charge) ; Edoardo pilote la démo et présente le front et le temps réel côté client.
