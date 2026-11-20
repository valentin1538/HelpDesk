# Tests de l'API — collection Postman

| Fichier                                   | Contenu                                                        |
| ----------------------------------------- | -------------------------------------------------------------- |
| `HelpDesk.postman_collection.json`        | Requêtes + tests automatiques, rangés par US                   |
| `HelpDesk-local.postman_environment.json` | URL de l'API locale et identifiants des comptes de démo (seed) |

## Utilisation dans Postman

1. **Import** → glisser les deux fichiers.
2. En haut à droite, sélectionner l'environnement **« HelpDesk — local »**.
3. Lancer un dossier entier avec **Run folder** (Runner) : les requêtes s'enchaînent et se transmettent les tokens / identifiants (variables de collection `userToken`, `techToken`, `adminToken`, `ticketId`…).

## Utilisation en ligne de commande (Newman)

Stack démarrée (`docker compose up`) et comptes de démo présents, puis à la racine :

```bash
npm run test:api
```

## Contenu

| Dossier                          | Requêtes | Ce qui est vérifié                                                                                                                                                                                                                                          |
| -------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 00 — Santé                       | 2        | `/health` (API + base), 404 au format standard                                                                                                                                                                                                              |
| 01 — Authentification (US01)     | 11       | inscription (rôle forcé à `user`, mot de passe jamais renvoyé), doublon 409, validation 400 avec détail par champ, connexion, même 401 pour mauvais mot de passe et email inconnu, `/me` sans token / token falsifié, connexion technicien et admin         |
| 02 — Déclarer un incident (US02) | 4        | sans token 401, validation 400 avec détail par champ, champs protégés ignorés (statut, assigné, numéro, rang), création 201 + `Location` + référence HD-XXXX + `priorityRank` + historique « created »                                                      |
| 03 — Cycle de vie (US05)         | 11       | détail du ticket (401, 400, demandeur 200 + `people`, technicien 200), RG2 403, RG3 409 + transitions autorisées, assignation invalide 400, RG4 auto-assignation + RG5 historique + `firstResponseAt`, résolution, fermeture par l'auteur, ticket fermé 409 |
| 04 — Commentaires (US06)         | 10       | 401 sans token, message vide 400, ticket inexistant 404, commentaire 201, note interne du technicien, note interne masquée au demandeur (RG6), `isInternal` ignoré pour un `user`, fil chronologique + pagination, ticket fermé 409 (RG7)                   |

Un test commun à toute la collection vérifie que **chaque réponse d'erreur** respecte le format `{ error: { code, message } }`.

**Dernière exécution** : 38 requêtes, 116 assertions, 0 échec (base de test, branche US06 avec US01 + US02 + US05 + US06).

## Ajouter les routes d'une nouvelle US

Chaque US ajoute son dossier (`03 — …`) avec au moins : le cas nominal, un 401 (sans token), un 403 ou 404 (droits) et ses erreurs métier. La collection est générée par `generate-collection.mjs` (`node docs/postman/generate-collection.mjs`) : ajouter les requêtes dans ce script puis régénérer. Modifier directement dans Postman puis **Export → Collection v2.1** dans ce dossier convient aussi.

## Prérequis de données

| Variable d'environnement | Valeur                   | Créé par       |
| ------------------------ | ------------------------ | -------------- |
| `techEmail`              | `karim@helpdesk.test`    | seed (TECH-13) |
| `adminEmail`             | `nathalie@helpdesk.test` | seed (TECH-13) |
| `demoPassword`           | `Demo1234`               | seed (TECH-13) |

Le compte utilisateur est créé par la collection elle-même (email unique à chaque exécution).
