/**
 * Libellés français des valeurs renvoyées par l'API (enums du serveur, server/src/models/constants.js).
 * Toujours afficher ces libellés, jamais la valeur technique.
 */

export const ROLE_LABELS = Object.freeze({
  user: 'Collaborateur',
  technician: 'Technicien',
  admin: 'Administrateur',
});

export const STATUS_LABELS = Object.freeze({
  open: 'Ouvert',
  in_progress: 'En cours',
  waiting_user: 'En attente',
  resolved: 'Résolu',
  closed: 'Fermé',
});

export const PRIORITY_LABELS = Object.freeze({
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  critical: 'Critique',
});

export const CATEGORY_LABELS = Object.freeze({
  hardware: 'Matériel',
  software: 'Logiciel',
  network: 'Réseau',
  access: 'Accès',
  other: 'Autre',
});
