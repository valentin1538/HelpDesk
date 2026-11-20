/**
 * Valeurs de référence du domaine.
 * Elles remplacent les tables ROLE, CATEGORIE, PRIORITE et STATUT du MLD
 * (cf. dossier technique §3.5) : listes fixes, validées par les enums Mongoose.
 */

export const ROLES = Object.freeze(['user', 'technician', 'admin']);
export const STAFF_ROLES = Object.freeze(['technician', 'admin']);

export const CATEGORIES = Object.freeze(['hardware', 'software', 'network', 'access', 'other']);

export const PRIORITIES = Object.freeze(['low', 'medium', 'high', 'critical']);
/** Rang dénormalisé dans le ticket pour trier par urgence (tri alphabétique faux). */
export const PRIORITY_RANK = Object.freeze({ low: 1, medium: 2, high: 3, critical: 4 });

export const STATUSES = Object.freeze([
  'open',
  'in_progress',
  'waiting_user',
  'resolved',
  'closed',
]);

/** RG3 — transitions de statut autorisées. */
export const STATUS_TRANSITIONS = Object.freeze({
  open: ['in_progress'],
  in_progress: ['waiting_user', 'resolved'],
  waiting_user: ['in_progress'],
  resolved: ['closed', 'in_progress'],
  closed: [],
});

export const HISTORY_ACTIONS = Object.freeze([
  'created',
  'status_changed',
  'priority_changed',
  'assigned',
]);

export const NOTIFICATION_TYPES = Object.freeze([
  'ticket_created',
  'ticket_assigned',
  'status_changed',
  'new_comment',
]);
