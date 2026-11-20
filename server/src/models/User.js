import bcrypt from 'bcryptjs';
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

/** Coût bcrypt : 2^12 itérations (~250 ms) — lent exprès pour freiner les attaques par force brute. */
const BCRYPT_ROUNDS = 12;

/**
 * US01 — le mot de passe n'est jamais stocké en clair : hashé à chaque création / modification.
 * pre('save') s'exécute après la validation du schéma (le mot de passe en clair est validé en amont,
 * dans la route, car le schéma ne voit que le hash).
 */
userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
});

/** Compare un mot de passe saisi au hash (nécessite .select('+password') sur la requête). */
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', userSchema);
