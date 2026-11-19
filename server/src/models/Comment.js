import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

/**
 * Commentaires — collection SÉPARÉE (et non imbriquée dans le ticket) :
 * nombre non borné (limite de 16 Mo par document), pagination,
 * filtrage des notes internes pour un utilisateur (RG6).
 */
const commentSchema = new mongoose.Schema(
  {
    ticket: { type: ObjectId, ref: 'Ticket', required: true },
    author: { type: ObjectId, ref: 'User', required: true },
    content: {
      type: String,
      required: [true, 'Le commentaire ne peut pas être vide'],
      trim: true,
      maxlength: [5000, 'Le commentaire ne doit pas dépasser 5000 caractères'],
    },
    // Note interne : visible uniquement par le support (RG6)
    isInternal: { type: Boolean, default: false },
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

commentSchema.index({ ticket: 1, createdAt: 1 }); // fil d'un ticket, ordre chronologique

export const Comment = mongoose.model('Comment', commentSchema);
