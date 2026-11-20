import { useState } from 'react';
import { ArrowRight, ChevronRight, CircleAlert, CircleCheckBig, Plus, Send } from 'lucide-react';
import { Link } from 'react-router';
import { createTicket } from '../api/tickets.js';
import FormField from '../components/FormField.jsx';
import PriorityBadge from '../components/tickets/PriorityBadge.jsx';
import StatusBadge from '../components/tickets/StatusBadge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import ChoiceGroup from '../components/ui/ChoiceGroup.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { CATEGORY_LABELS } from '../constants/labels.js';
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '../constants/ticketOptions.js';

const EMPTY = { title: '', description: '', category: '', priority: 'medium' };

/** Contrôles côté navigateur (retour immédiat) ; le serveur reste la référence. */
function validateLocally(form) {
  const details = {};
  if (form.title.trim().length < 5) details.title = 'Le titre doit contenir au moins 5 caractères';
  if (!form.description.trim()) details.description = 'Décrivez le problème rencontré';
  if (!form.category) details.category = 'Choisissez une catégorie';
  return Object.keys(details).length ? { code: 'VALIDATION_ERROR', details } : null;
}

// US02 — Déclarer un incident
export default function NewTicketPage() {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const set = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    // l'erreur d'un champ disparaît dès qu'on le corrige
    if (error?.details?.[name]) {
      const { [name]: _removed, ...rest } = error.details;
      setError(Object.keys(rest).length ? { ...error, details: rest } : null);
    }
  };
  const update = (e) => set(e.target.name, e.target.value);

  async function handleSubmit(e) {
    e.preventDefault();
    const localError = validateLocally(form);
    if (localError) return setError(localError);

    setError(null);
    setSubmitting(true);
    try {
      setCreated(await createTicket(form));
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  function restart() {
    setForm(EMPTY);
    setCreated(null);
  }

  const breadcrumb = (
    <>
      <Link to="/tickets">Mes tickets</Link>
      <ChevronRight size={14} aria-hidden="true" />
      Nouveau ticket
    </>
  );

  if (created) {
    return (
      <>
        <PageHeader eyebrow={breadcrumb} title="Incident déclaré" />
        <Card className="ticket-created" bodyClassName="ticket-created-body">
          <div className="ticket-created-icon" aria-hidden="true">
            <CircleCheckBig size={30} strokeWidth={1.8} />
          </div>
          <p className="ticket-created-key ticket-key">{created.reference}</p>
          <h2 className="ticket-created-title">{created.title}</h2>
          <div className="ticket-created-meta">
            <StatusBadge status={created.status} />
            <PriorityBadge priority={created.priority} />
            <span className="text-secondary">{CATEGORY_LABELS[created.category]}</span>
          </div>
          <p className="ticket-created-text" role="status">
            Votre demande est enregistrée et visible par le support. Vous serez notifié de chaque
            étape de sa prise en charge.
          </p>
          <div className="ticket-created-actions">
            <Button as={Link} to={`/tickets/${created._id}`} icon={ArrowRight}>
              Voir le ticket
            </Button>
            <Button variant="secondary" icon={Plus} onClick={restart}>
              Déclarer un autre incident
            </Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={breadcrumb}
        title="Déclarer un incident"
        description="Décrivez le problème : le support le prend en charge selon sa priorité."
      />

      <Card>
        <form className="ticket-form" onSubmit={handleSubmit} noValidate>
          {error && !error.details && (
            <p className="alert" role="alert">
              <CircleAlert size={16} aria-hidden="true" />
              {error.message}
            </p>
          )}

          <FormField
            label="Titre"
            name="title"
            placeholder="Ex. : Imprimante du 2e étage en panne"
            value={form.title}
            onChange={update}
            error={error?.details?.title}
            maxLength={120}
            counter
            required
            autoFocus
          />

          <ChoiceGroup
            legend="Catégorie"
            name="category"
            options={CATEGORY_OPTIONS}
            value={form.category}
            onChange={(value) => set('category', value)}
            error={error?.details?.category}
          />

          <FormField
            as="textarea"
            label="Description"
            name="description"
            rows={6}
            placeholder="Que se passe-t-il ? Depuis quand ? Un message d’erreur s’affiche-t-il ?"
            value={form.description}
            onChange={update}
            error={error?.details?.description}
            maxLength={5000}
            counter
            required
          />

          <ChoiceGroup
            legend="Priorité"
            name="priority"
            variant="segmented"
            options={PRIORITY_OPTIONS}
            value={form.priority}
            onChange={(value) => set('priority', value)}
            error={error?.details?.priority}
            hint="Choisissez selon l’impact sur votre travail. Le support peut l’ajuster."
          />

          <div className="form-actions">
            <Button as={Link} to="/tickets" variant="ghost">
              Annuler
            </Button>
            <Button type="submit" icon={Send} loading={submitting}>
              {submitting ? 'Envoi…' : 'Envoyer la demande'}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
