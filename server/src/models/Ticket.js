import mongoose from 'mongoose';
import { Counter } from './Counter.js';
import { CATEGORIES, HISTORY_ACTIONS, PRIORITIES, PRIORITY_RANK, STATUSES } from './constants.js';

const { ObjectId } = mongoose.Schema.Types;

/**
 * Entrée d'historique — ex-table ACTION_HISTORIQUE, IMBRIQUÉE dans le ticket :
 * relation bornée, toujours lue avec le ticket, mise à jour dans la même écriture que le statut (RG5).
 */
const historySchema = new mongoose.Schema(
  {
    action: { type: String, enum: HISTORY_ACTIONS, required: true },
    from: { type: String, default: null },
    to: { type: String, default: null },
    by: { type: ObjectId, ref: 'User', required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ticketSchema = new mongoose.Schema(
  {
    // Numéro lisible, attribué automatiquement via Counter (voir hook pre('validate'))
    number: { type: Number, unique: true },
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      minlength: [5, 'Le titre doit contenir au moins 5 caractères'],
      maxlength: [120, 'Le titre ne doit pas dépasser 120 caractères'],
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      trim: true,
      maxlength: [5000, 'La description ne doit pas dépasser 5000 caractères'],
    },
    // Ex-tables CATEGORIE / PRIORITE / STATUT : valeurs énumérées
    category: {
      type: String,
      required: [true, 'La catégorie est requise'],
      enum: { values: CATEGORIES, message: 'Catégorie invalide : {VALUE}' },
    },
    priority: {
      type: String,
      enum: { values: PRIORITIES, message: 'Priorité invalide : {VALUE}' },
      default: 'medium',
    },
    // Dénormalisé : calculé côté serveur à partir de priority, sert au tri par urgence
    priorityRank: { type: Number, min: 1, max: 4 },
    status: {
      type: String,
      enum: { values: STATUSES, message: 'Statut invalide : {VALUE}' },
      default: 'open',
    },
    createdBy: { type: ObjectId, ref: 'User', required: true },
    assignedTo: { type: ObjectId, ref: 'User', default: null },
    history: { type: [historySchema], default: [] },
    // Dates dérivées, stockées pour simplifier les statistiques (délais de prise en charge / résolution)
    firstResponseAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    // Verrou optimiste : si deux personnes modifient le même ticket en même temps,
    // la seconde sauvegarde échoue (VersionError → 409) au lieu d'écraser la première.
    optimisticConcurrency: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
        delete ret.id;
        return ret;
      },
    },
  },
);

/** Référence affichée à l'utilisateur : HD-0042 */
ticketSchema.virtual('reference').get(function reference() {
  return this.number ? `HD-${String(this.number).padStart(4, '0')}` : undefined;
});

/** Avant validation : priorityRank toujours synchronisé avec priority (jamais fourni par le client). */
ticketSchema.pre('validate', function syncRank() {
  if (this.isModified('priority') || this.priorityRank == null) {
    this.priorityRank = PRIORITY_RANK[this.priority];
  }
});

/**
 * À la création, APRÈS validation (pre('save') s'exécute une fois les données validées) :
 * numéro attribué et entrée « created » ajoutée à l'historique.
 * Placé ici et non dans pre('validate') pour qu'un ticket invalide ne consomme pas de numéro
 * (pas de trous dans la numérotation HD-XXXX).
 */
ticketSchema.pre('save', async function assignNumber() {
  if (!this.isNew) return;
  if (this.number == null) this.number = await Counter.next('ticket');
  if (this.history.length === 0) {
    this.history.push({ action: 'created', to: this.status, by: this.createdBy });
  }
});

/**
 * Filet de sécurité si la priorité est modifiée par findOneAndUpdate / updateOne
 * (les services privilégient doc.save(), qui passe par le hook ci-dessus).
 */
ticketSchema.pre(['findOneAndUpdate', 'updateOne'], function syncPriorityRank() {
  const update = this.getUpdate() || {};
  const priority = update.priority ?? update.$set?.priority;
  if (priority && PRIORITY_RANK[priority]) {
    this.setUpdate({ ...update, $set: { ...update.$set, priorityRank: PRIORITY_RANK[priority] } });
  }
});

// Index : un par requête fréquente (dossier technique §3.8)
ticketSchema.index({ createdBy: 1, createdAt: -1 }); // « Mes tickets »
ticketSchema.index({ status: 1, priorityRank: -1, createdAt: 1 }); // file technicien
ticketSchema.index({ assignedTo: 1, status: 1 }); // tickets assignés, charge par technicien

export const Ticket = mongoose.model('Ticket', ticketSchema);
