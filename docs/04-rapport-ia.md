# Rapport d'utilisation de l'IA

> Tenu à jour à chaque sprint.

## Outils utilisés

| Outil                             | Modèle          | Usage                                                                                                                                                                 |
| --------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code (application desktop) | Claude Opus 5.5 | Gestion de projet, rédaction des spécifications, conception, automatisation GitHub, mise en place de l'environnement, développement full-stack, tests, revues de code |
| Codebuff                          | —               | Développement d'US06 (commentaires), tri du backlog, intégration de branches                                                                                          |

**Mode d'utilisation :** l'IA est utilisée comme assistant ayant accès au dossier du projet et au terminal. L'équipe garde le pilotage : elle formule les besoins, relit et valide chaque production, et réalise elle-même les actions sur les comptes (GitHub, MongoDB Atlas).

---

## Sprint 1 — Cadrage & conception (17/11/2026)

### Prompts clés

**1. Cadrage du projet à partir du sujet**

> _Sujet PDF fourni +_ « Projet sous forme de sprint par jour, aujourd'hui premier sprint de gestion de projet, rédaction spec… »

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

---

## Sprint 2 — Données, socle API, interface et identité (19–20/11/2026)

### Prompts clés

**1. Modélisation de la base de données**

> « Modifie le dossier technique avec : schémas de base (MCD), schéma dénormalisé et pourquoi un schéma dénormalisé en NoSQL, justifications de supprimer telle ou telle table, garder telle ou telle table… »

Résultat : démarche complète MCD (Merise) → MLD relationnel normalisé (10 tables, référence) → modèle document dénormalisé (5 collections), avec une décision argumentée **table par table** (supprimée en énumération, imbriquée, conservée, ajoutée), les compromis assumés et leurs parades, et les index justifiés par les requêtes.
→ **Retenu.** Section 3 du dossier technique ; base de l'argumentaire « modélisation » de la soutenance.

**2. Backlog complet, y compris le travail non fonctionnel**

> « Il faut modifier les US et ajouter des tâches non reliées aux utilisateurs comme le setup environnement, ce qui a été fait au Sprint 1, car ça fait partie du temps alloué au projet… »

Résultat : 16 tâches techniques (`TECH-01` → `TECH-16`) créées dans le Kanban et rattachées à leur sprint, critères des US enrichis par les décisions de conception (rang de priorité, historique imbriqué, désactivation plutôt que suppression).
→ **Retenu.** La vélocité mesure désormais tout le temps passé, pas seulement les fonctionnalités.

**3. Environnement identique pour toute l'équipe**

> « Docker est obligatoire pour que le projet soit sur les mêmes bases de chaque côté : fais passer le squelette par Docker et dis-moi comment mon coéquipier l'utilise. »

Résultat : `compose.yaml` à trois services (MongoDB 8, API, client Vite), code monté avec rechargement à chaud, dépendances figées par le lockfile, procédure d'installation et de dépannage dans le README.
→ **Retenu.** Les deux postes lancent l'application avec une seule commande.

**4. Socle serveur et modèles**

> « Exécute la TECH-10 » puis « Oui, TECH-11 »

Résultat : configuration validée au démarrage, gestion d'erreurs centralisée au format unique `{ error: { code, message, details } }`, arrêt propre ; schémas Mongoose (historique imbriqué, compteur atomique `HD-XXXX`, rang de priorité calculé, index) vérifiés par des tests sur base jetable (dont 20 créations simultanées sans doublon de numéro).
→ **Retenu.** Toutes les US s'appuient sur ce socle.

**5. Organisation par user story**

> « Fais une répartition par US et pas par front-end / back-end, comme ça tout le monde touche à tout. »

Résultat : chaque US prise en charge de bout en bout par un membre (modèle, API, écran, tests), contrats partagés fixés en amont (format d'erreur, JWT), règles Git pour éviter les conflits.
→ **Retenu.** Chacun peut expliquer toute l'application en soutenance.

**6. Identité visuelle et design system**

> « US intermédiaire de charte graphique : base-toi sur les maquettes, inspire-toi de Jira et de la charte Apple, quelque chose de doux, luxueux et premium, avec les tendances UX actuelles ; trouve une identité (nom, logo) et intègre-la au cadrage. »

Résultat : identité **Opale** (nom, signature, logo), design tokens clair / sombre, composants réutilisables, coque inspirée de Jira, guide de style vivant (`/styleguide`), charte graphique documentée et section identité du dossier de cadrage.
→ **Retenu.** Toutes les pages suivantes réutilisent le design system.

**7. Fonctionnalités de bout en bout**

> « Oui, US01 » · « Oui, US02 » · « Oui, US05 front »

Résultat : inscription / connexion (hash bcrypt, JWT, limitation des tentatives, réponses identiques pour un email inconnu ou un mauvais mot de passe), déclaration d'incident (champs protégés contre l'assignation de masse, formulaire guidé par l'impact), page détail façon Jira (actions selon le rôle et le statut, historique en frise, gestion des modifications concurrentes).
→ **Retenu.** Chaque US livrée avec ses tests API, Postman et navigateur.

**8. Données de démonstration**

> « Si rien ne dépend de la US09 en cours, attaque la TECH-13. »

Résultat : seed des personas du cadrage (3 rôles + un compte désactivé) et de 19 tickets réalistes sur 30 jours, dont le cycle de vie rejoue les vraies règles métier ; garde-fous (base non vide, production).
→ **Retenu.** Sert aux tests, à la démo et aux futures statistiques.

**9. Transmission au coéquipier**

> « Fais comme sur la TECH-12 pour la US09 et fais-moi un message Teams pour lui dire exactement quoi faire, avec un plan précis. »

Résultat : plan pas à pas (fichiers, code, vérifications par rôle, livraison), testé au préalable sur une copie temporaire du projet.
→ **Retenu.** US09 livrée en suivant ce plan.

**10. Audit de fin de sprint**

> « Analyse tout ce qui a été fait pour le Sprint 2 et résous tout problème ou code mal fait. »

Résultat : relecture du code fusionné, contrôles automatiques (lint, formatage, build, dépendances), contrôles transverses des règles métier sur les données du seed, collection Postman complète (**39 requêtes, 120 assertions**), parcours par rôle ; corrections appliquées avant la clôture (validation stricte d'un booléen sur les commentaires, doublons de pagination, intégration propre d'US09).
→ **Retenu.** Sprint clos avec une base vérifiée.

### Analyse critique

**Apports**

- **Vitesse avec qualité :** chaque fonctionnalité est livrée avec son API, son interface, sa documentation et ses tests. Les tests sur base jetable, la collection Postman et les parcours dans le navigateur ont permis de détecter et corriger des défauts **avant** leur intégration.
- **Sécurité intégrée dès la conception :** protection contre l'assignation de masse, notes internes jamais renvoyées à un demandeur (filtre appliqué dans la requête), mêmes réponses pour un email inconnu ou un mauvais mot de passe, verrou optimiste contre les modifications concurrentes.
- **Cohérence :** un design system unique et des contrats d'API partagés ont permis de développer en parallèle sans divergence visuelle ni technique.
- **Traçabilité :** chaque décision (modélisation, outillage, répartition) est documentée avec sa justification, ce qui prépare directement la soutenance.

**Limites et points de vigilance**

- L'IA **ne voit pas l'état des postes** de l'équipe (réglages d'éditeur, travail resté en local) : nous vérifions systématiquement ce qui est réellement sur GitHub avant de considérer une tâche comme terminée.
- Le code produit **doit être validé par des tests**, pas seulement relu : plusieurs défauts n'apparaissaient qu'à l'exécution (comportement d'un validateur, pagination après un envoi) et ont été corrigés grâce aux tests.
- Travailler sur des branches empilées (une US qui dépend d'une autre non encore fusionnée) accélère le développement mais impose des rebases : nous fusionnons désormais au plus tôt.

### Bonnes pratiques retenues pour la suite

1. Pour chaque US : tests API sur base jetable, mise à jour de la collection Postman, parcours dans le navigateur pour chaque rôle concerné.
2. Une PR par US, vers `develop`, ouverte et poussée avant d'annoncer la tâche terminée.
3. Formatage par la configuration Prettier du projet (`npm run format`) avant chaque commit.
4. Audit de fin de sprint systématique avant la clôture.
