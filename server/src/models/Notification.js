import mongoose from 'mongoose';
import { NOTIFICATION_TYPES } from './constants.js';

const { ObjectId } = mongoose.Schema.Types;

/**
 * Notifications — collection séparée : cycle de vie propre,
 * interrogées par destinataire et marquées lues une à une (US15).
 */
const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      required: true,
      enum: { values: NOTIFICATION_TYPES, message: 'Type de notification invalide : {VALUE}' },
    },
    ticket: { type: ObjectId, ref: 'Ticket', required: true },
    message: { type: String, required: true, trim: true, maxlength: 300 },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 }); // centre de notifications

export const Notification = mongoose.model('Notification', notificationSchema);
