import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { signToken } from '../utils/jwt.js';

/** Hash de référence (même coût que les vrais) pour égaliser la durée d'un login sur email inconnu. */
const DUMMY_HASH = bcrypt.hashSync('timing-equalizer', 12);

/**
 * Inscription : le rôle est TOUJOURS « user » (un champ role envoyé par le client est ignoré :
 * les rôles technician / admin sont attribués par un administrateur, US14).
 */
export async function register({ firstName, lastName, email, password, department }) {
  const user = await User.create({ firstName, lastName, email, password, department });
  return { token: signToken(user), user };
}

/**
 * Connexion. Le même message est renvoyé si l'email est inconnu ou le mot de passe faux :
 * on ne révèle pas quels emails ont un compte.
 */
export async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  // Email inconnu : on compare quand même à un hash factice pour que le temps de réponse
  // soit le même (sinon la différence de durée révélerait quels emails existent).
  const valid = user
    ? await user.comparePassword(password)
    : (await bcrypt.compare(password, DUMMY_HASH), false);
  if (!valid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email ou mot de passe incorrect');
  }
  if (!user.isActive) {
    throw new AppError(403, 'ACCOUNT_DISABLED', 'Ce compte a été désactivé');
  }

  return { token: signToken(user), user };
}
