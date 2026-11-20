/**
 * Script de seed (TECH-13) : comptes de démo et tickets réalistes.
 *
 *   npm run seed                 base vide uniquement
 *   npm run seed -- --reset      efface users / tickets / comments / notifications / counters puis recrée
 *
 * Dans Docker : docker compose exec server npm run seed -- --reset
 * Refuse de s'exécuter en production.
 */
import mongoose from 'mongoose';
import { isProduction } from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import {
  Comment,
  Counter,
  Notification,
  STAFF_ROLES,
  STATUS_TRANSITIONS,
  Ticket,
  User,
} from '../src/models/index.js';
import { DEMO_PASSWORD, TICKETS, USERS } from './data.js';

const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;
const reset = process.argv.includes('--reset');

async function main() {
  if (isProduction) throw new Error('Seed interdit en production');

  await connectDB();
  const db = mongoose.connection;
  console.log(`Base cible : ${db.name} sur ${db.host}`);

  const existing = await User.countDocuments();
  if (existing > 0 && !reset) {
    console.error(
      `La base contient déjà ${existing} utilisateur(s). Relancer avec --reset pour tout effacer et recréer les données de démo.`,
    );
    process.exitCode = 1;
    return;
  }
  if (reset) {
    await Promise.all([User, Ticket, Comment, Notification, Counter].map((m) => m.deleteMany({})));
    console.log('Collections vidées (users, tickets, comments, notifications, counters)');
  }
  await Promise.all([User, Ticket, Comment, Notification].map((m) => m.syncIndexes()));

  // --- Utilisateurs (le mot de passe est hashé par le hook pre('save') du modèle) ---
  const users = {};
  for (const [key, data] of Object.entries(USERS)) {
    users[key] = await User.create({ ...data, password: DEMO_PASSWORD });
  }

  // --- Tickets, dans l'ordre chronologique pour que les numéros HD-XXXX suivent le temps ---
  const now = Date.now();
  const scenarios = [...TICKETS].sort((a, b) => b.ago - a.ago);
  let commentCount = 0;
  let notificationCount = 0;

  for (const scenario of scenarios) {
    const author = users[scenario.by];
    const createdAt = new Date(now - scenario.ago * DAY);
    const ticket = new Ticket({
      title: scenario.title,
      description: scenario.description,
      category: scenario.category,
      priority: scenario.priority,
      createdBy: author._id,
      history: [{ action: 'created', to: 'open', by: author._id, at: createdAt }],
      createdAt,
    });

    // Rejoue le cycle de vie avec les vraies règles (RG3 transitions, RG4 auto-assignation)
    let t = createdAt.getTime();
    const notifications = [];
    for (const step of scenario.steps) {
      t += step.after * HOUR;
      const at = new Date(Math.min(t, now - 60 * 1000));
      const actor = users[step.by];

      if (step.assign) {
        const assignee = users[step.assign];
        ticket.history.push({
          action: 'assigned',
          from: ticket.assignedTo ? String(ticket.assignedTo) : null,
          to: String(assignee._id),
          by: actor._id,
          at,
        });
        ticket.assignedTo = assignee._id;
        ticket.firstResponseAt ??= at;
        notifications.push({
          recipient: assignee._id,
          type: 'ticket_assigned',
          message: `${actor.firstName} vous a assigné « ${scenario.title} »`,
          at,
        });
        continue;
      }

      const from = ticket.status;
      if (!STATUS_TRANSITIONS[from].includes(step.status)) {
        throw new Error(`Seed incohérent (« ${scenario.title} ») : ${from} → ${step.status}`);
      }
      ticket.status = step.status;
      ticket.history.push({ action: 'status_changed', from, to: step.status, by: actor._id, at });
      if (step.status === 'in_progress' && !ticket.assignedTo && STAFF_ROLES.includes(actor.role)) {
        ticket.assignedTo = actor._id;
        ticket.history.push({
          action: 'assigned',
          from: null,
          to: String(actor._id),
          by: actor._id,
          at,
        });
      }
      if (step.status === 'in_progress') ticket.firstResponseAt ??= at;
      if (step.status === 'resolved') ticket.resolvedAt = at;
      if (from === 'resolved' && step.status === 'in_progress') ticket.resolvedAt = null;
      if (step.status === 'closed') ticket.closedAt = at;
      if (step.by !== scenario.by && ['resolved', 'waiting_user'].includes(step.status)) {
        notifications.push({
          recipient: author._id,
          type: 'status_changed',
          message:
            step.status === 'resolved'
              ? `Votre ticket « ${scenario.title} » est résolu`
              : `Le support attend votre retour sur « ${scenario.title} »`,
          at,
        });
      }
    }
    ticket.updatedAt = new Date(Math.min(t, now - 60 * 1000));
    await ticket.save({ timestamps: false }); // conserve les dates du scénario

    // Commentaires (notes internes comprises) et notifications associées
    for (const c of scenario.comments) {
      const at = new Date(Math.min(createdAt.getTime() + c.after * HOUR, now - 60 * 1000));
      const commentAuthor = users[c.by];
      await new Comment({
        ticket: ticket._id,
        author: commentAuthor._id,
        content: c.content,
        isInternal: Boolean(c.internal),
        createdAt: at,
      }).save({ timestamps: false });
      commentCount += 1;
      if (!c.internal && c.by !== scenario.by) {
        notifications.push({
          recipient: author._id,
          type: 'new_comment',
          message: `${commentAuthor.firstName} a répondu sur « ${scenario.title} »`,
          at,
        });
      }
    }

    for (const n of notifications) {
      await new Notification({
        recipient: n.recipient,
        type: n.type,
        ticket: ticket._id,
        message: n.message,
        read: now - n.at.getTime() > DAY, // les plus anciennes sont lues
        createdAt: n.at,
      }).save({ timestamps: false });
      notificationCount += 1;
    }
  }

  // --- Récapitulatif ---
  const byStatus = await Ticket.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]);
  console.log(
    `\n✔ ${Object.keys(users).length} utilisateurs · ${scenarios.length} tickets · ${commentCount} commentaires · ${notificationCount} notifications`,
  );
  console.log(`  Statuts : ${byStatus.map((s) => `${s._id} ${s.n}`).join(' · ')}`);
  console.log(`\nComptes de démo (mot de passe : ${DEMO_PASSWORD})`);
  console.table(
    Object.values(users).map((u) => ({
      email: u.email,
      rôle: u.role,
      nom: `${u.firstName} ${u.lastName}`,
      actif: u.isActive ? 'oui' : 'non',
    })),
  );
}

main()
  .catch((err) => {
    console.error('Échec du seed :', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
