import {
  Archive,
  CircleCheckBig,
  Hourglass,
  Play,
  RotateCcw,
  ThumbsUp,
  UserPlus,
} from 'lucide-react';

/**
 * Cycle de vie côté client — miroir des règles du serveur (server/src/models/constants.js,
 * services/ticketWorkflowService.js). Le serveur reste la référence : ces règles servent
 * uniquement à n'afficher que les actions possibles.
 */
export const STATUS_TRANSITIONS = Object.freeze({
  open: ['in_progress'],
  in_progress: ['waiting_user', 'resolved'],
  waiting_user: ['in_progress'],
  resolved: ['closed', 'in_progress'],
  closed: [],
});

export const isStaff = (user) => ['technician', 'admin'].includes(user?.role);

// Libellé de chaque transition, du point de vue du support
const STAFF_LABELS = {
  'open>in_progress': { label: 'Prendre en charge', icon: Play },
  'in_progress>waiting_user': { label: 'Mettre en attente', icon: Hourglass },
  'in_progress>resolved': { label: 'Marquer résolu', icon: CircleCheckBig },
  'waiting_user>in_progress': { label: 'Reprendre', icon: Play },
  'resolved>closed': { label: 'Fermer le ticket', icon: Archive },
  'resolved>in_progress': { label: 'Rouvrir', icon: RotateCcw },
};

// Action principale mise en avant selon le statut
const PRIMARY = {
  open: 'in_progress',
  in_progress: 'resolved',
  waiting_user: 'in_progress',
  resolved: 'closed',
};

/**
 * Actions disponibles pour `user` sur `ticket`.
 * Renvoie [{ key, label, icon, primary, run: { type: 'status' | 'assign', value } }]
 */
export function availableActions(ticket, user) {
  if (!ticket || !user) return [];
  const from = ticket.status;

  // RG2 — le demandeur ne peut que confirmer ou contester la résolution de SON ticket
  if (!isStaff(user)) {
    if (from !== 'resolved' || ticket.createdBy?._id !== user._id) return [];
    return [
      {
        key: 'confirm',
        label: 'Confirmer la résolution',
        icon: ThumbsUp,
        primary: true,
        run: { type: 'status', value: 'closed' },
      },
      {
        key: 'reopen',
        label: 'Le problème persiste',
        icon: RotateCcw,
        run: { type: 'status', value: 'in_progress' },
      },
    ];
  }

  const actions = STATUS_TRANSITIONS[from].map((to) => ({
    key: `status-${to}`,
    ...STAFF_LABELS[`${from}>${to}`],
    primary: PRIMARY[from] === to,
    run: { type: 'status', value: to },
  }));

  // « M'assigner » : ticket non fermé, libre (technicien) ou assigné à un autre (admin)
  const assignedToMe = ticket.assignedTo?._id === user._id;
  const canSelfAssign =
    from !== 'closed' &&
    !assignedToMe &&
    (user.role === 'admin' || !ticket.assignedTo) &&
    // passer « en cours » assigne déjà automatiquement (RG4) : inutile de doubler l'action
    !(from === 'open' && !ticket.assignedTo);
  if (canSelfAssign) {
    actions.push({
      key: 'assign-me',
      label: 'M’assigner',
      icon: UserPlus,
      run: { type: 'assign', value: 'me' },
    });
  }

  return actions.sort((a, b) => Number(Boolean(b.primary)) - Number(Boolean(a.primary)));
}
