import mongoose from 'mongoose';
import { ROLES } from './constants.js';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Le prénom est requis'],
      trim: true,
      maxlength: [50, 'Le prénom ne doit pas dépasser 50 caractères'],
    },
    lastName: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      maxlength: [50, 'Le nom ne doit pas dépasser 50 caractères'],
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true, // index unique (login, RG : un compte par email)
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide'],
    },
    // Hash bcrypt (calculé à l'inscription, US01). Jamais renvoyé par défaut.
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      select: false,
    },
    // Ex-table ROLE : valeur fixe, droits codés dans l'application (requireRole)
    role: {
      type: String,
      enum: { values: ROLES, message: 'Rôle invalide : {VALUE}' },
      default: 'user',
    },
    // Ex-table SERVICE : simple libellé
    department: { type: String, trim: true, maxlength: 80 },
    // RG8 — on désactive plutôt que supprimer (préserve les références des tickets)
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        delete ret.id;
        return ret;
      },
    },
  },
);

userSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName} ${this.lastName}`;
});

export const User = mongoose.model('User', userSchema);
