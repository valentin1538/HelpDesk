/**
 * Données de démonstration (TECH-13) — personas du dossier de cadrage.
 * Mot de passe commun : DEMO_PASSWORD (identique à l'environnement Postman).
 */

export const DEMO_PASSWORD = 'Demo1234';

export const USERS = {
  nathalie: {
    firstName: 'Nathalie',
    lastName: 'Roux',
    email: 'nathalie@helpdesk.test',
    role: 'admin',
    department: 'Direction des systèmes d’information',
  },
  karim: {
    firstName: 'Karim',
    lastName: 'Benali',
    email: 'karim@helpdesk.test',
    role: 'technician',
    department: 'Support informatique',
  },
  thomas: {
    firstName: 'Thomas',
    lastName: 'Leroy',
    email: 'thomas@helpdesk.test',
    role: 'technician',
    department: 'Support informatique',
  },
  sophie: {
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie@helpdesk.test',
    role: 'user',
    department: 'Comptabilité',
  },
  pierre: {
    firstName: 'Pierre',
    lastName: 'Durand',
    email: 'pierre@helpdesk.test',
    role: 'user',
    department: 'Commercial',
  },
  julie: {
    firstName: 'Julie',
    lastName: 'Bernard',
    email: 'julie@helpdesk.test',
    role: 'user',
    department: 'Ressources humaines',
  },
  // RG8 : compte désactivé — la connexion doit être refusée
  marc: {
    firstName: 'Marc',
    lastName: 'Petit',
    email: 'marc@helpdesk.test',
    role: 'technician',
    department: 'Support informatique',
    isActive: false,
  },
};

/**
 * Tickets : `ago` = ancienneté en jours (création), `steps` = événements successifs
 * (`after` en heures depuis l'événement précédent) :
 *   { status, by }            changement de statut (RG3 vérifiée, RG4 appliquée)
 *   { assign, by }            assignation
 * `comments` : `after` en heures depuis la création ; `internal` = note du support (RG6).
 */
export const TICKETS = [
  {
    by: 'pierre',
    ago: 29,
    category: 'access',
    priority: 'high',
    title: 'Compte bloqué après changement de mot de passe',
    description:
      'Depuis ce matin je ne peux plus ouvrir de session Windows, message « compte verrouillé ».',
    steps: [
      { after: 0.3, status: 'in_progress', by: 'karim' },
      { after: 0.4, status: 'resolved', by: 'karim' },
      { after: 3, status: 'closed', by: 'pierre' },
    ],
    comments: [
      { after: 0.5, by: 'karim', content: 'Compte déverrouillé, vous pouvez réessayer.' },
      { after: 0.8, by: 'pierre', content: 'Ça fonctionne, merci !' },
    ],
  },
  {
    by: 'julie',
    ago: 27,
    category: 'software',
    priority: 'medium',
    title: 'Logiciel de paie : export PDF vide',
    description: 'L’export des bulletins en PDF génère des fichiers vides depuis la mise à jour.',
    steps: [
      { after: 2, status: 'in_progress', by: 'thomas' },
      { after: 5, status: 'waiting_user', by: 'thomas' },
      { after: 20, status: 'in_progress', by: 'thomas' },
      { after: 4, status: 'resolved', by: 'thomas' },
      { after: 24, status: 'closed', by: 'julie' },
    ],
    comments: [
      {
        after: 7,
        by: 'thomas',
        content: 'Pouvez-vous m’envoyer un exemple de bulletin concerné ?',
      },
      { after: 26, by: 'julie', content: 'Voici le bulletin de mars, matricule 1042.' },
      {
        after: 29,
        by: 'thomas',
        content: 'Correctif de l’éditeur appliqué (v4.2.1).',
        internal: true,
      },
    ],
  },
  {
    by: 'sophie',
    ago: 25,
    category: 'hardware',
    priority: 'low',
    title: 'Souris sans fil qui décroche',
    description: 'La souris perd la connexion plusieurs fois par jour.',
    steps: [
      { after: 6, assign: 'karim', by: 'nathalie' },
      { after: 18, status: 'in_progress', by: 'karim' },
      { after: 2, status: 'resolved', by: 'karim' },
      { after: 48, status: 'closed', by: 'karim' },
    ],
    comments: [{ after: 25, by: 'karim', content: 'Récepteur USB remplacé.' }],
  },
  {
    by: 'pierre',
    ago: 22,
    category: 'network',
    priority: 'critical',
    title: 'VPN inaccessible depuis l’extérieur',
    description:
      'Impossible de me connecter au VPN en déplacement client, erreur de délai dépassé.',
    steps: [
      { after: 0.2, status: 'in_progress', by: 'karim' },
      { after: 1.5, status: 'resolved', by: 'karim' },
      { after: 12, status: 'closed', by: 'pierre' },
    ],
    comments: [
      {
        after: 0.4,
        by: 'karim',
        content: 'Certificat du serveur VPN expiré, renouvellement en cours.',
        internal: true,
      },
      { after: 1.6, by: 'karim', content: 'Le VPN est rétabli pour tout le monde.' },
    ],
  },
  {
    by: 'julie',
    ago: 19,
    category: 'access',
    priority: 'medium',
    title: 'Accès au dossier partagé RH',
    description: 'Je n’ai plus accès au dossier \\\\serveur\\RH\\Recrutement.',
    steps: [
      { after: 3, status: 'in_progress', by: 'thomas' },
      { after: 1, status: 'resolved', by: 'thomas' },
    ],
    comments: [
      { after: 4, by: 'thomas', content: 'Droits rétablis sur le groupe RH-Recrutement.' },
    ],
  },
  {
    by: 'sophie',
    ago: 16,
    category: 'software',
    priority: 'high',
    title: 'Excel se ferme à l’ouverture des macros',
    description:
      'Le fichier de rapprochement bancaire fait planter Excel dès que j’active les macros.',
    steps: [
      { after: 1, status: 'in_progress', by: 'karim' },
      { after: 3, status: 'waiting_user', by: 'karim' },
      { after: 30, status: 'in_progress', by: 'karim' },
      { after: 2, status: 'resolved', by: 'karim' },
    ],
    comments: [
      {
        after: 4,
        by: 'karim',
        content: 'Pouvez-vous me dire la version d’Office affichée dans Fichier > Compte ?',
      },
      { after: 33, by: 'sophie', content: 'Microsoft 365, version 2409.' },
      {
        after: 35,
        by: 'karim',
        content: 'Complément obsolète désactivé, les macros fonctionnent.',
      },
    ],
  },
  {
    by: 'pierre',
    ago: 13,
    category: 'hardware',
    priority: 'medium',
    title: 'Écran secondaire non détecté',
    description: 'Le deuxième écran reste noir sur la station d’accueil.',
    steps: [
      { after: 5, status: 'in_progress', by: 'thomas' },
      { after: 20, status: 'resolved', by: 'thomas' },
      { after: 2, status: 'in_progress', by: 'pierre' },
      { after: 6, status: 'resolved', by: 'thomas' },
      { after: 10, status: 'closed', by: 'pierre' },
    ],
    comments: [
      { after: 26, by: 'pierre', content: 'Le problème est revenu ce matin.' },
      { after: 32, by: 'thomas', content: 'Câble USB-C remplacé par un modèle certifié.' },
    ],
  },
  {
    by: 'julie',
    ago: 10,
    category: 'network',
    priority: 'high',
    title: 'Wi-Fi très lent en salle de réunion B',
    description: 'Les visioconférences coupent en salle B depuis lundi.',
    steps: [
      { after: 2, status: 'in_progress', by: 'karim' },
      { after: 26, status: 'resolved', by: 'karim' },
    ],
    comments: [
      {
        after: 3,
        by: 'karim',
        content: 'Borne Wi-Fi saturée, ajout d’une borne prévu.',
        internal: true,
      },
      { after: 28, by: 'karim', content: 'Nouvelle borne installée.' },
    ],
  },
  {
    by: 'sophie',
    ago: 8,
    category: 'other',
    priority: 'low',
    title: 'Demande d’un second écran',
    description: 'Serait-il possible d’obtenir un second écran pour la clôture comptable ?',
    steps: [
      { after: 20, assign: 'thomas', by: 'nathalie' },
      { after: 4, status: 'in_progress', by: 'thomas' },
      { after: 2, status: 'waiting_user', by: 'thomas' },
    ],
    comments: [
      {
        after: 26,
        by: 'thomas',
        content: 'Validation de votre responsable nécessaire, pouvez-vous la transmettre ?',
      },
    ],
  },
  {
    by: 'pierre',
    ago: 6,
    category: 'software',
    priority: 'medium',
    title: 'CRM : synchronisation des contacts en échec',
    description: 'Les contacts ajoutés sur mobile n’apparaissent pas dans le CRM.',
    steps: [{ after: 3, status: 'in_progress', by: 'thomas' }],
    comments: [{ after: 4, by: 'thomas', content: 'Je regarde les journaux de synchronisation.' }],
  },
  {
    by: 'julie',
    ago: 5,
    category: 'hardware',
    priority: 'critical',
    title: 'Ordinateur portable qui ne démarre plus',
    description:
      'Écran noir, voyant d’alimentation orange clignotant. Entretiens prévus cet après-midi.',
    steps: [
      { after: 0.3, status: 'in_progress', by: 'karim' },
      { after: 2, status: 'resolved', by: 'karim' },
      { after: 20, status: 'closed', by: 'julie' },
    ],
    comments: [
      { after: 0.5, by: 'karim', content: 'Je vous apporte un portable de prêt dans 10 minutes.' },
    ],
  },
  {
    by: 'sophie',
    ago: 4,
    category: 'access',
    priority: 'medium',
    title: 'Mot de passe de la banque en ligne expiré',
    description: 'L’accès au portail bancaire entreprise demande un nouveau certificat.',
    steps: [
      { after: 1, status: 'in_progress', by: 'karim' },
      { after: 2, status: 'waiting_user', by: 'karim' },
    ],
    comments: [
      {
        after: 3,
        by: 'karim',
        content: 'Merci de confirmer la réception du code envoyé par la banque.',
      },
    ],
  },
  {
    by: 'pierre',
    ago: 3,
    category: 'network',
    priority: 'medium',
    title: 'Partage d’imprimante impossible depuis le Mac',
    description: 'Le MacBook ne trouve pas l’imprimante du 1er étage.',
    steps: [{ after: 4, status: 'in_progress', by: 'thomas' }],
    comments: [],
  },
  {
    by: 'julie',
    ago: 2,
    category: 'software',
    priority: 'high',
    title: 'Outlook ne reçoit plus les e-mails externes',
    description: 'Les candidats me disent que leurs e-mails reviennent en erreur.',
    steps: [{ after: 0.5, status: 'in_progress', by: 'karim' }],
    comments: [
      {
        after: 0.7,
        by: 'karim',
        content: 'Règle anti-spam trop stricte identifiée, correction en test.',
        internal: true,
      },
    ],
  },
  {
    by: 'sophie',
    ago: 1,
    category: 'hardware',
    priority: 'high',
    title: 'Imprimante 2e étage HS',
    description:
      'Bourrage papier permanent, message « erreur 13.20 ». Impressions de fin de mois bloquées.',
    steps: [{ after: 1, status: 'in_progress', by: 'karim' }],
    comments: [
      { after: 1.2, by: 'karim', content: 'Je passe dans la matinée avec un kit de maintenance.' },
    ],
  },
  {
    by: 'pierre',
    ago: 1,
    category: 'other',
    priority: 'low',
    title: 'Installer un logiciel de capture d’écran',
    description: 'Besoin d’un outil pour annoter des captures dans mes propositions commerciales.',
    steps: [],
    comments: [],
  },
  {
    by: 'julie',
    ago: 0.4,
    category: 'access',
    priority: 'medium',
    title: 'Badge d’accès au parking refusé',
    description: 'Mon badge ne fonctionne plus à la barrière du parking.',
    steps: [{ after: 1, assign: 'thomas', by: 'nathalie' }],
    comments: [],
  },
  {
    by: 'sophie',
    ago: 0.2,
    category: 'network',
    priority: 'critical',
    title: 'Plus d’accès Internet sur tout le service comptabilité',
    description: 'Aucun poste du service ne peut accéder à Internet depuis 10 minutes.',
    steps: [],
    comments: [],
  },
  {
    by: 'pierre',
    ago: 0.1,
    category: 'software',
    priority: 'medium',
    title: 'Teams : notifications absentes',
    description: 'Je ne reçois plus aucune notification Teams sur mon poste.',
    steps: [],
    comments: [],
  },
];
