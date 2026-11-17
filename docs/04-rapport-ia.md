# Rapport d'utilisation de l'IA

> Tenu à jour à chaque sprint.

## Outils utilisés

| Outil | Modèle | Usage |
|-------|--------|-------|
| Claude Code (application desktop) | Claude Opus 5.5 | Gestion de projet, rédaction des spécifications, conception, automatisation GitHub, mise en place de l'environnement |

**Mode d'utilisation :** l'IA est utilisée comme assistant ayant accès au dossier du projet et au terminal. L'équipe garde le pilotage : elle formule les besoins, relit et valide chaque production, et réalise elle-même les actions sur les comptes (GitHub, MongoDB Atlas).

---

## Sprint 1 — Cadrage & conception (17/11/2026)

### Prompts clés

**1. Cadrage du projet à partir du sujet**
> *Sujet PDF fourni +* « Projet sous forme de sprint par jour, aujourd'hui premier sprint de gestion de projet, rédaction spec… »

Résultat : dossier de cadrage (analyse du besoin, parties prenantes, personas, 18 fonctionnalités chacune reliée à un problème métier, backlog MoSCoW en user stories, règles de gestion), dossier technique v0 (architecture, modèle de données, contrat d'API, événements Socket.io, pistes Aggregation Pipeline et montée en charge), planning des sprints.
→ **Retenu après relecture croisée.** Sert de base à tout le projet.

**2. Backlog outillé dans GitHub**
> « Crée les issues dans le Kanban + comment donner l'accès au projet à mon collaborateur »

Résultat : script GitHub CLI créant 20 issues (une par user story, avec critères d'acceptation cochables et renvoi aux règles de gestion) et 9 labels (priorité MoSCoW, sprint, domaine) ; procédure de partage du GitHub Project.
→ **Retenu.** Le Kanban est opérationnel et partagé.

**3. Organisation de l'équipe**
> « Adapte le planning pour 2 personnes (Valentin, chef de projet, et Edoardo) »

Résultat : planning réorganisé en **deux pistes parallèles** (backend / frontend) développées contre le contrat d'API, avec un point d'intégration à chaque fin de sprint et des revues de code croisées.
→ **Retenu.** Chaque membre a une piste par sprint, et la revue croisée permet à chacun de maîtriser toute l'application pour la soutenance.

**4. Choix de l'environnement de base de données**
> « Atlas, c'est un Docker partagé ? Docker est-il utile dans ce projet ? Quelle est la meilleure approche ? »

Résultat : comparaison Atlas (base hébergée, données partagées, replica set réel) / Docker (environnement reproductible, données locales), au regard de nos contraintes (équipe de 2, 5 jours, critères d'évaluation).
→ **Décision de l'équipe :** MongoDB Atlas (cluster gratuit M0) pour le développement ; Docker Compose envisagé en bonus au Sprint 5.

**5. Mise en place et validation de l'environnement**
> « Fichier .env en place »

Résultat : structuration de la configuration (`server/.env` local, `server/.env.example` versionné), renforcement du `.gitignore` sur les fichiers de secrets, test de connexion réel à Atlas (base `helpdesk`, replica set de 3 nœuds), diagnostic et contournement d'un problème de résolution DNS propre au poste, documenté dans le README.
→ **Retenu.** Environnement validé dès le Sprint 1.

### Analyse critique

**Apports**
- **Accélération de la phase de cadrage :** la structure des livrables suit le sujet et la grille d'évaluation, ce qui nous a permis de concentrer notre temps sur la relecture et les décisions.
- **Justification systématique :** chaque fonctionnalité est reliée à un besoin métier et chaque choix de modélisation (embarquer / référencer) est argumenté, conformément aux exigences du sujet.
- **Aide à la décision :** sur le choix Atlas / Docker, l'IA a présenté les compromis plutôt qu'une réponse toute faite, ce qui nous a permis de trancher en connaissance de cause.
- **Rigueur sur la sécurité :** séparation systématique des secrets (`.env` non versionné, `.env.example` comme modèle).

**Limites et points de vigilance**
- L'IA formule des **hypothèses par défaut** (durée du projet, taille et composition de l'équipe) qu'il faut vérifier et corriger : le planning a dû être adapté à notre équipe de deux.
- L'IA **ne connaît pas l'état réel de nos comptes** (offres disponibles sur Atlas, automatisations déjà actives sur le GitHub Project) : ses propositions doivent être confrontées à ce qu'on observe.
- Les productions restent un **point de départ** : relecture, arbitrage et appropriation sont indispensables, d'autant que chaque membre doit pouvoir expliquer chaque élément en soutenance.

### Bonnes pratiques retenues pour la suite
1. Relire tout fichier généré avant de le commiter, en particulier ce qui touche aux secrets et aux droits.
2. Ne jamais transmettre de secret (mot de passe, URI complète) à l'IA.
3. Chaque morceau de code produit avec l'IA doit pouvoir être expliqué par les deux membres.
4. Consigner ici, à chaque sprint, les prompts clés et les décisions prises.
