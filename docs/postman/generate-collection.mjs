// Génère la collection Postman v2.1 et l'environnement local.
// Usage (racine du projet) : node docs/postman/generate-collection.mjs
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = import.meta.dirname;

const json = (obj) => ({
  mode: 'raw',
  raw: JSON.stringify(obj, null, 2),
  options: { raw: { language: 'json' } },
});
const url = (path) => ({
  raw: `{{baseUrl}}${path}`,
  host: ['{{baseUrl}}'],
  path: path.split('/').filter(Boolean),
});
const script = (lines) => ({ type: 'text/javascript', exec: lines.split('\n') });
const bearer = (tokenVar) => ({
  type: 'bearer',
  bearer: [{ key: 'token', value: `{{${tokenVar}}}`, type: 'string' }],
});

function req(name, { method = 'GET', path, body, auth, tests, pre, description }) {
  const item = {
    name,
    request: {
      method,
      header: body ? [{ key: 'Content-Type', value: 'application/json' }] : [],
      url: url(path),
      auth: auth ? bearer(auth) : { type: 'noauth' },
      ...(body && { body: json(body) }),
      ...(description && { description }),
    },
    event: [],
  };
  if (pre) item.event.push({ listen: 'prerequest', script: script(pre) });
  if (tests) item.event.push({ listen: 'test', script: script(tests) });
  return item;
}

const expectError = (status, code) => `pm.test('${status} ${code}', () => {
  pm.response.to.have.status(${status});
  pm.expect(pm.response.json().error.code).to.eql('${code}');
});`;

const saveLogin = (tokenVar, idVar) => `pm.test('200 + token', () => {
  pm.response.to.have.status(200);
  pm.expect(pm.response.json().token).to.be.a('string');
});
pm.collectionVariables.set('${tokenVar}', pm.response.json().token);
pm.collectionVariables.set('${idVar}', pm.response.json().user._id);`;

const collection = {
  info: {
    name: 'HelpDesk IT — API',
    description:
      "Collection de tests de l'API HelpDesk (TECH-14).\n\n" +
      '**Prérequis** : stack démarrée (`docker compose up`), environnement « HelpDesk — local » sélectionné, ' +
      'comptes de démo technicien et admin présents (seed TECH-13).\n\n' +
      'Lancer le dossier entier avec le **Runner** (ou Newman) : chaque requête enregistre les tokens et identifiants ' +
      'utiles aux suivantes. Toutes les erreurs suivent le format `{ error: { code, message, details? } }`.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  variable: [
    { key: 'userEmail', value: '' },
    { key: 'userToken', value: '' },
    { key: 'userId', value: '' },
    { key: 'techToken', value: '' },
    { key: 'techId', value: '' },
    { key: 'adminToken', value: '' },
    { key: 'adminId', value: '' },
    { key: 'ticketId', value: '' },
  ],
  event: [
    {
      listen: 'test',
      script: script(`pm.test('Réponse JSON', () => pm.response.to.be.json);
if (pm.response.code >= 400) {
  pm.test("Format d'erreur { error: { code, message } }", () => {
    const { error } = pm.response.json();
    pm.expect(error.code).to.be.a('string');
    pm.expect(error.message).to.be.a('string');
  });
}`),
    },
  ],
  item: [
    {
      name: '00 — Santé',
      item: [
        req('API et base disponibles', {
          path: '/health',
          tests: `pm.test('200, api et db ok', () => {
  pm.response.to.have.status(200);
  pm.expect(pm.response.json()).to.include({ api: 'ok', db: 'ok' });
});`,
        }),
        req('Route inconnue → 404', {
          path: '/route-inexistante',
          tests: expectError(404, 'NOT_FOUND'),
        }),
      ],
    },
    {
      name: '01 — Authentification (US01)',
      item: [
        req('Inscription', {
          method: 'POST',
          path: '/auth/register',
          pre: "// Email unique à chaque exécution : la collection peut être relancée\npm.collectionVariables.set('userEmail', `sophie.${Date.now()}@helpdesk.test`);",
          body: {
            firstName: 'Sophie',
            lastName: 'Martin',
            email: '{{userEmail}}',
            password: 'Secret123',
            department: 'Comptabilité',
            role: 'admin',
          },
          description:
            'Le champ `role: admin` est volontairement envoyé : il doit être ignoré (rôle toujours `user`).',
          tests: `const body = pm.response.json();
pm.test('201 + token + user', () => {
  pm.response.to.have.status(201);
  pm.expect(body.token).to.be.a('string');
});
pm.test('Rôle forcé à user (role: admin ignoré)', () => pm.expect(body.user.role).to.eql('user'));
pm.test('Mot de passe jamais renvoyé', () => pm.expect(body.user).to.not.have.property('password'));
pm.collectionVariables.set('userToken', body.token);
pm.collectionVariables.set('userId', body.user._id);`,
        }),
        req('Inscription — email déjà utilisé → 409', {
          method: 'POST',
          path: '/auth/register',
          body: {
            firstName: 'Sophie',
            lastName: 'Martin',
            email: '{{userEmail}}',
            password: 'Secret123',
          },
          tests: expectError(409, 'DUPLICATE'),
        }),
        req('Inscription — données invalides → 400', {
          method: 'POST',
          path: '/auth/register',
          body: { firstName: '', email: 'pas-un-email', password: 'court' },
          tests: `${expectError(400, 'VALIDATION_ERROR')}
pm.test('Détail par champ', () => {
  pm.expect(pm.response.json().error.details).to.have.all.keys('firstName', 'lastName', 'email', 'password');
});`,
        }),
        req('Connexion utilisateur', {
          method: 'POST',
          path: '/auth/login',
          body: { email: '{{userEmail}}', password: 'Secret123' },
          tests: saveLogin('userToken', 'userId'),
        }),
        req('Connexion — mauvais mot de passe → 401', {
          method: 'POST',
          path: '/auth/login',
          body: { email: '{{userEmail}}', password: 'Mauvais123' },
          tests: expectError(401, 'INVALID_CREDENTIALS'),
        }),
        req('Connexion — email inconnu → même 401', {
          method: 'POST',
          path: '/auth/login',
          body: { email: 'inconnu@helpdesk.test', password: 'Secret123' },
          description:
            "Même code et même message qu'un mauvais mot de passe : on ne révèle pas quels emails existent.",
          tests: expectError(401, 'INVALID_CREDENTIALS'),
        }),
        req('Profil connecté (me)', {
          path: '/auth/me',
          auth: 'userToken',
          tests: `pm.test('200 + utilisateur courant', () => {
  pm.response.to.have.status(200);
  pm.expect(pm.response.json().user.email).to.eql(pm.collectionVariables.get('userEmail'));
});`,
        }),
        req('Profil sans token → 401', {
          path: '/auth/me',
          tests: expectError(401, 'UNAUTHORIZED'),
        }),
        req('Profil avec token falsifié → 401', {
          path: '/auth/me',
          pre: "pm.collectionVariables.set('fakeToken', pm.collectionVariables.get('userToken').slice(0, -3) + 'abc');",
          auth: 'fakeToken',
          tests: expectError(401, 'INVALID_TOKEN'),
        }),
        req('Connexion technicien (compte de démo)', {
          method: 'POST',
          path: '/auth/login',
          body: { email: '{{techEmail}}', password: '{{demoPassword}}' },
          description: 'Compte créé par le seed (TECH-13). Identifiants dans l’environnement.',
          tests: `${saveLogin('techToken', 'techId')}
pm.test('Rôle technician', () => pm.expect(pm.response.json().user.role).to.eql('technician'));`,
        }),
        req('Connexion admin (compte de démo)', {
          method: 'POST',
          path: '/auth/login',
          body: { email: '{{adminEmail}}', password: '{{demoPassword}}' },
          tests: `${saveLogin('adminToken', 'adminId')}
pm.test('Rôle admin', () => pm.expect(pm.response.json().user.role).to.eql('admin'));`,
        }),
      ],
    },
    {
      name: '02 — Cycle de vie du ticket (US05)',
      description: 'Nécessite la création de ticket (US02). Exécuter après le dossier 01.',
      item: [
        req('Créer un ticket (US02)', {
          method: 'POST',
          path: '/tickets',
          auth: 'userToken',
          body: {
            title: 'Imprimante 2e étage HS',
            description: 'Bourrage papier permanent',
            category: 'hardware',
            priority: 'high',
          },
          tests: `pm.test('201 + ticket', () => pm.response.to.have.status(201));
const { ticket } = pm.response.json();
pm.collectionVariables.set('ticketId', ticket._id);`,
        }),
        req("L'auteur ne peut pas passer son ticket en cours → 403 (RG2)", {
          method: 'PATCH',
          path: '/tickets/{{ticketId}}/status',
          auth: 'userToken',
          body: { status: 'in_progress' },
          tests: expectError(403, 'FORBIDDEN'),
        }),
        req('Transition interdite open → resolved → 409 (RG3)', {
          method: 'PATCH',
          path: '/tickets/{{ticketId}}/status',
          auth: 'techToken',
          body: { status: 'resolved' },
          tests: `${expectError(409, 'INVALID_TRANSITION')}
pm.test('Transitions autorisées indiquées', () => pm.expect(pm.response.json().error.details.allowed).to.eql(['in_progress']));`,
        }),
        req('Admin → assigner à un simple utilisateur → 400', {
          method: 'PATCH',
          path: '/tickets/{{ticketId}}/assign',
          auth: 'adminToken',
          body: { assignedTo: '{{userId}}' },
          tests: expectError(400, 'INVALID_ASSIGNEE'),
        }),
        req('Technicien → passer en cours (auto-assignation RG4)', {
          method: 'PATCH',
          path: '/tickets/{{ticketId}}/status',
          auth: 'techToken',
          body: { status: 'in_progress' },
          tests: `const { ticket } = pm.response.json();
pm.test('200, statut in_progress', () => {
  pm.response.to.have.status(200);
  pm.expect(ticket.status).to.eql('in_progress');
});
pm.test('Assigné au technicien qui agit (RG4)', () => pm.expect(ticket.assignedTo._id).to.eql(pm.collectionVariables.get('techId')));
pm.test('Historisé (RG5)', () => pm.expect(ticket.history.map((h) => h.action)).to.include.members(['status_changed', 'assigned']));
pm.test('firstResponseAt renseigné', () => pm.expect(ticket.firstResponseAt).to.be.a('string'));`,
        }),
        req('Technicien → résoudre', {
          method: 'PATCH',
          path: '/tickets/{{ticketId}}/status',
          auth: 'techToken',
          body: { status: 'resolved' },
          tests: `pm.test('200, resolvedAt renseigné', () => {
  pm.response.to.have.status(200);
  pm.expect(pm.response.json().ticket.resolvedAt).to.be.a('string');
});`,
        }),
        req("L'auteur ferme son ticket résolu", {
          method: 'PATCH',
          path: '/tickets/{{ticketId}}/status',
          auth: 'userToken',
          body: { status: 'closed' },
          tests: `pm.test('200, statut closed', () => {
  pm.response.to.have.status(200);
  pm.expect(pm.response.json().ticket.status).to.eql('closed');
  pm.expect(pm.response.json().ticket.closedAt).to.be.a('string');
});`,
        }),
        req('Ticket fermé → réassignation refusée → 409', {
          method: 'PATCH',
          path: '/tickets/{{ticketId}}/assign',
          auth: 'adminToken',
          body: { assignedTo: '{{techId}}' },
          tests: expectError(409, 'TICKET_CLOSED'),
        }),
      ],
    },
  ],
};

const environment = {
  name: 'HelpDesk — local',
  values: [
    { key: 'baseUrl', value: 'http://localhost:5000/api', type: 'default', enabled: true },
    { key: 'techEmail', value: 'karim@helpdesk.test', type: 'default', enabled: true },
    { key: 'adminEmail', value: 'nathalie@helpdesk.test', type: 'default', enabled: true },
    { key: 'demoPassword', value: 'Demo1234', type: 'default', enabled: true },
  ],
  _postman_variable_scope: 'environment',
};

writeFileSync(
  join(out, 'HelpDesk.postman_collection.json'),
  JSON.stringify(collection, null, 2) + '\n',
);
writeFileSync(
  join(out, 'HelpDesk-local.postman_environment.json'),
  JSON.stringify(environment, null, 2) + '\n',
);
console.log('Collection et environnement générés');
