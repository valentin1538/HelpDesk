# Dossier de cadrage — HelpDesk IT (MERN)

> Mini-Projet 3 — Application de gestion d'incidents IT
> Version 1.0 — Sprint 1 (17/11/2026)

---

## 1. Analyse du besoin

### 1.1 Situation actuelle (AS-IS)

Les incidents informatiques sont remontés de façon informelle : e-mails, appels téléphoniques, échanges de couloir. Conséquences constatées :

| # | Problème | Impact métier |
|---|----------|---------------|
| P1 | Aucune trace centralisée des demandes | Demandes oubliées / perdues, doublons |
| P2 | Pas de statut visible pour l'utilisateur | Relances répétées du support, frustration |
| P3 | Pas de priorisation formalisée | Un incident bloquant peut attendre derrière une demande mineure |
| P4 | Répartition du travail opaque | Surcharge de certains techniciens, absence de responsable identifié |
| P5 | Communication dispersée | Informations perdues entre canaux, pas d'historique des échanges |
| P6 | Aucune donnée chiffrée | Impossible de mesurer les délais, d'identifier les problèmes récurrents ou de dimensionner l'équipe |

### 1.2 Situation cible (TO-BE)

Une application web unique où :
- **toute demande devient un ticket** tracé, numéroté, horodaté ;
- chaque ticket a **un statut, une priorité, un responsable** ;
- les échanges utilisateur ↔ support se font **dans le ticket**, avec historique complet ;
- les acteurs sont **notifiés en temps réel** des changements qui les concernent ;
- le management dispose d'un **tableau de bord statistique**.

### 1.3 Objectifs mesurables

| Objectif | Indicateur |
|----------|-----------|
| 100 % des demandes tracées | Nb de tickets créés vs demandes hors outil |
| Réduire les relances | Nb de commentaires « où en est ma demande ? » |
| Maîtriser les délais | Délai moyen de prise en charge / de résolution par priorité |
| Équilibrer la charge | Nb de tickets ouverts par technicien |

---

## 2. Parties prenantes

| Partie prenante | Rôle dans l'app | Besoins principaux | Influence / Intérêt |
|-----------------|-----------------|--------------------|---------------------|
| **Collaborateur** (employé utilisateur du SI) | `user` | Déclarer un incident simplement, suivre son avancement, échanger avec le support, être prévenu de la résolution | Intérêt fort / influence faible |
| **Technicien support** | `technician` | Voir la file des tickets, s'en attribuer, changer statut/priorité, répondre, ajouter des notes internes, être alerté des nouveaux tickets urgents | Intérêt fort / influence moyenne |
| **Responsable support / Admin** | `admin` | Assigner les tickets, gérer les comptes et rôles, suivre les indicateurs (volume, délais, charge), piloter l'équipe | Intérêt fort / influence forte |
| **Direction / DSI** | (lecteur des stats via admin) | Visibilité sur la qualité de service, aide au dimensionnement | Intérêt moyen / influence forte |
| **Équipe projet** (nous) | — | Livrer une solution cohérente dans les délais, respecter les contraintes techniques | — |
| **Jury / formateurs** | — | Évaluer la pertinence fonctionnelle, l'architecture, la soutenance | Influence forte |

### Personas

- **Sophie, comptable** — peu à l'aise avec l'informatique. Veut un formulaire court, savoir « si quelqu'un s'en occupe ».
- **Karim, technicien N1/N2** — traite 15-20 tickets/jour. Veut une liste filtrable, triée par urgence, et ne pas rater un ticket critique.
- **Nathalie, responsable support** — doit répartir la charge et rendre des comptes à la DSI chaque mois.

---

## 3. Fonctionnalités retenues

Chaque fonctionnalité est rattachée au(x) problème(s) qu'elle résout (cf. §1.1).

| ID | Fonctionnalité | Acteur(s) | Besoin justifiant |
|----|----------------|-----------|-------------------|
| F01 | Authentification (inscription, connexion JWT, déconnexion) | Tous | Identifier le demandeur et sécuriser l'accès (P1, P4) |
| F02 | Gestion des rôles (user / technician / admin) | Admin | Chaque acteur n'a pas les mêmes droits ni les mêmes vues |
| F03 | Création de ticket (titre, description, catégorie, priorité ressentie) | User | Centraliser toutes les demandes (P1) |
| F04 | Liste « Mes tickets » + détail avec statut | User | Visibilité de l'avancement (P2) |
| F05 | File des tickets avec filtres (statut, priorité, catégorie, assigné) et tri | Tech, Admin | Prioriser le traitement (P3) |
| F06 | Cycle de vie du ticket (Ouvert → En cours → En attente utilisateur → Résolu → Fermé) | Tech, User | Statut clair et partagé (P2) |
| F07 | Assignation (auto-assignation par un tech, assignation par l'admin) | Tech, Admin | Responsable identifié, répartition (P4) |
| F08 | Fil de commentaires sur le ticket | Tous | Centraliser les échanges (P5) |
| F09 | **Temps réel** : nouveaux commentaires et changements de statut poussés instantanément sur le ticket ouvert | Tous | Communication fluide sans recharger (P2, P5) |
| F10 | **Temps réel** : notifications (nouveau ticket pour les techs, ticket assigné, réponse reçue, ticket résolu) | Tous | Réactivité, ne rien rater (P2, P3) |
| F11 | Historique des actions sur le ticket (qui a changé quoi, quand) | Tous | Traçabilité (P1, P5) |
| F12 | Tableau de bord statistique (Aggregation Pipeline) | Admin | Piloter l'activité (P6) |
| F13 | Notes internes (commentaires visibles uniquement par le support) | Tech, Admin | Échanger entre techniciens sans polluer le fil utilisateur |
| F14 | Gestion des utilisateurs (liste, changement de rôle, désactivation) | Admin | Administrer la plateforme |
| F15 | Indicateur « en train d'écrire… » | Tous | Confort de conversation |
| F16 | Pièces jointes (captures d'écran) | User, Tech | Faciliter le diagnostic |
| F17 | Délais cibles par priorité (SLA) et alerte de dépassement | Admin, Tech | Garantir un niveau de service (P3) |
| F18 | Évaluation de satisfaction à la clôture | User | Mesurer la qualité perçue (P6) |

### Hors périmètre (assumé)

- Intégration e-mail entrante (création de ticket par mail), SSO/LDAP d'entreprise, base de connaissances, gestion de parc matériel, application mobile native.

---

## 4. Priorisation — Backlog produit (MoSCoW)

Estimation en points (1 = très simple, 8 = complexe).

### MUST — indispensable au MVP

| ID | User story | Pts | Sprint |
|----|-----------|-----|--------|
| US01 | En tant qu'utilisateur, je veux créer un compte et me connecter afin d'accéder à mes tickets. | 5 | S2 |
| US02 | En tant qu'utilisateur, je veux déclarer un incident (titre, description, catégorie, priorité) afin qu'il soit pris en charge. | 3 | S2 |
| US03 | En tant qu'utilisateur, je veux voir la liste et le statut de mes tickets afin de suivre leur avancement. | 3 | S3 |
| US04 | En tant que technicien, je veux voir tous les tickets filtrés et triés par priorité afin de traiter les urgences d'abord. | 5 | S3 |
| US05 | En tant que technicien, je veux m'assigner un ticket et changer son statut afin d'indiquer que je le traite. | 3 | S2/S3 |
| US06 | En tant qu'utilisateur ou technicien, je veux échanger des commentaires dans le ticket afin de centraliser la communication. | 3 | S2/S3 |
| US07 | En tant qu'utilisateur, je veux voir en temps réel les nouveaux messages et changements de statut sur mon ticket. | 5 | S4 |
| US08 | En tant que technicien, je veux être notifié en temps réel d'un nouveau ticket afin de réagir vite. | 3 | S4 |
| US09 | En tant qu'admin, je veux que les routes soient protégées par rôle afin que chacun n'accède qu'à ce qui le concerne. | 3 | S2 |

### SHOULD — forte valeur, prévu

| ID | User story | Pts | Sprint |
|----|-----------|-----|--------|
| US10 | En tant qu'admin, je veux un tableau de bord (tickets par statut, par catégorie, délai moyen de résolution, charge par technicien). | 5 | S4 |
| US11 | En tant qu'admin, je veux assigner un ticket à un technicien donné. | 2 | S3 |
| US12 | En tant que participant, je veux consulter l'historique des actions du ticket. | 2 | S3 |
| US13 | En tant que technicien, je veux ajouter des notes internes invisibles pour l'utilisateur. | 2 | S3 |
| US14 | En tant qu'admin, je veux gérer les comptes (rôle, activation). | 3 | S3 |
| US15 | En tant qu'utilisateur, je veux un centre de notifications (non lues / lues). | 3 | S4 |

### COULD — si le temps le permet

| ID | User story | Pts |
|----|-----------|-----|
| US16 | Indicateur « en train d'écrire… » | 1 |
| US17 | Pièces jointes (images) | 5 |
| US18 | SLA par priorité + mise en évidence des tickets en retard | 3 |
| US19 | Note de satisfaction à la clôture | 2 |
| US20 | Recherche plein texte sur les tickets | 2 |

### WON'T — pas dans cette version

Création de ticket par e-mail, SSO entreprise, base de connaissances, app mobile.

---

## 5. Règles de gestion

- **RG1** — Un utilisateur ne voit que ses propres tickets ; techniciens et admins voient tous les tickets.
- **RG2** — Seuls techniciens/admins peuvent changer le statut (sauf : l'utilisateur peut **rouvrir** un ticket résolu, ou le **fermer**).
- **RG3** — Transitions de statut autorisées :
  `open → in_progress → waiting_user ⇄ in_progress → resolved → closed` ; `resolved → in_progress` (réouverture).
- **RG4** — Passer un ticket « En cours » sans assigné l'assigne automatiquement au technicien qui agit.
- **RG5** — Toute modification (statut, priorité, assignation) est enregistrée dans l'historique.
- **RG6** — Une note interne n'est jamais envoyée (ni via l'API ni via Socket.io) à un `user`.
- **RG7** — Un ticket fermé n'accepte plus de commentaire.
- **RG8** — Un compte désactivé ne peut plus se connecter.
