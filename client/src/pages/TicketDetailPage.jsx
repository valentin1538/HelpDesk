import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, CircleAlert, FileSearch, RefreshCw } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { assignTicket, changeStatus, getTicket } from '../api/tickets.js';
import CommentThread from '../components/tickets/CommentThread.jsx';
import PriorityBadge from '../components/tickets/PriorityBadge.jsx';
import StatusBadge from '../components/tickets/StatusBadge.jsx';
import TicketHistory from '../components/tickets/TicketHistory.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { CATEGORY_LABELS, ROLE_LABELS, STATUS_LABELS } from '../constants/labels.js';
import { availableActions, isStaff } from '../constants/workflow.js';
import { useAuth } from '../hooks/useAuth.js';
import { formatDateTime, formatRelative, fullName } from '../utils/format.js';

/** Message d'erreur d'action en langage utilisateur (jamais de valeur technique comme « waiting_user »). */
function actionMessage(error) {
  if (error.code === 'INVALID_TRANSITION' && error.details?.from) {
    return `Le ticket a changé entre-temps : il est maintenant « ${STATUS_LABELS[error.details.from]} ».`;
  }
  return error.message;
}

// Erreurs après lesquelles il faut recharger le ticket (il a changé entre-temps)
const STALE_ERRORS = [
  'CONCURRENT_UPDATE',
  'INVALID_TRANSITION',
  'ALREADY_ASSIGNED',
  'TICKET_CLOSED',
];

function Person({ person, fallback = 'Non assigné' }) {
  if (!person) return <span className="text-secondary">{fallback}</span>;
  return (
    <span className="person">
      <Avatar firstName={person.firstName} lastName={person.lastName} size={24} />
      <span>
        {fullName(person)}
        {person.role && person.role !== 'user' && (
          <span className="person-role">{ROLE_LABELS[person.role]}</span>
        )}
      </span>
    </span>
  );
}

function DetailSkeleton() {
  return (
    <div className="ticket-layout" aria-busy="true" aria-label="Chargement du ticket">
      <div className="ticket-main">
        <div className="skeleton" style={{ height: 34, width: '60%', marginBottom: 32 }} />
        <div className="skeleton" style={{ height: 180, borderRadius: 16 }} />
      </div>
      <div className="skeleton" style={{ height: 360, borderRadius: 16 }} />
    </div>
  );
}

// US05 — Détail d'un ticket et actions du cycle de vie
export default function TicketDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null); // { ticket, people }
  const [loadError, setLoadError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [pending, setPending] = useState(null); // clé de l'action en cours

  const load = useCallback(async () => {
    setActionError(null);
    try {
      setData(await getTicket(id));
      setLoadError(null);
    } catch (err) {
      setLoadError(err);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    getTicket(id)
      .then((result) => !cancelled && setData(result))
      .catch((err) => !cancelled && setLoadError(err));
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function runAction(action) {
    setPending(action.key);
    setActionError(null);
    try {
      const ticket =
        action.run.type === 'status'
          ? await changeStatus(id, action.run.value)
          : await assignTicket(id, action.run.value);
      // la réponse contient le ticket à jour ; on complète l'annuaire avec le nouvel assigné
      setData((current) => ({
        ticket,
        people: ticket.assignedTo
          ? { ...current.people, [ticket.assignedTo._id]: ticket.assignedTo }
          : current.people,
      }));
    } catch (err) {
      setActionError(err);
    } finally {
      setPending(null);
    }
  }

  const backLink = isStaff(user)
    ? { to: '/queue', label: 'File du support' }
    : { to: '/tickets', label: 'Mes tickets' };

  if (loadError) {
    const notFound = ['NOT_FOUND', 'VALIDATION_ERROR', 'INVALID_ID'].includes(loadError.code);
    return (
      <Card>
        <EmptyState
          icon={notFound ? FileSearch : CircleAlert}
          title={notFound ? 'Ticket introuvable' : 'Impossible de charger le ticket'}
          description={
            notFound ? 'Ce ticket n’existe pas ou vous n’y avez pas accès.' : loadError.message
          }
          action={
            <Button as={Link} to={backLink.to} variant="secondary" icon={ArrowLeft}>
              {backLink.label}
            </Button>
          }
        />
      </Card>
    );
  }
  if (!data) return <DetailSkeleton />;

  const { ticket, people } = data;
  const allPeople = {
    ...people,
    [ticket.createdBy._id]: ticket.createdBy,
    ...(ticket.assignedTo && { [ticket.assignedTo._id]: ticket.assignedTo }),
  };
  const actions = availableActions(ticket, user);
  const stale = actionError && STALE_ERRORS.includes(actionError.code);

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <Link to={backLink.to}>{backLink.label}</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="ticket-key">{ticket.reference}</span>
          </>
        }
        title={ticket.title}
        description={
          <span className="ticket-header-meta">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <Badge>{CATEGORY_LABELS[ticket.category]}</Badge>
            <span className="text-secondary">
              Déclaré {formatRelative(ticket.createdAt)} par {fullName(ticket.createdBy)}
            </span>
          </span>
        }
      />

      <div className="ticket-layout">
        <div className="ticket-main">
          <Card title="Description">
            <p className="ticket-description">{ticket.description}</p>
          </Card>

          <Card title="Discussion">
            <CommentThread key={ticket._id} ticket={ticket} />
          </Card>

          <Card title="Historique">
            <TicketHistory history={ticket.history} people={allPeople} />
          </Card>
        </div>

        <aside className="ticket-aside" aria-label="Gestion du ticket">
          <Card title="Gestion">
            {actionError && (
              <div className="alert" role="alert">
                <CircleAlert size={16} aria-hidden="true" />
                <div>
                  {actionMessage(actionError)}
                  {stale && (
                    <Button variant="ghost" size="sm" icon={RefreshCw} onClick={load}>
                      Recharger le ticket
                    </Button>
                  )}
                </div>
              </div>
            )}

            {actions.length > 0 ? (
              <div className="ticket-actions">
                {actions.map((action) => (
                  <Button
                    key={action.key}
                    variant={action.primary ? 'primary' : 'secondary'}
                    icon={action.icon}
                    block
                    loading={pending === action.key}
                    disabled={pending !== null}
                    onClick={() => runAction(action)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="ticket-actions-empty">
                {ticket.status === 'closed'
                  ? 'Ce ticket est fermé.'
                  : 'Le support traite votre demande : vous serez notifié de chaque étape.'}
              </p>
            )}

            <dl className="properties">
              <dt>Statut</dt>
              <dd>
                <StatusBadge status={ticket.status} />
              </dd>
              <dt>Priorité</dt>
              <dd>
                <PriorityBadge priority={ticket.priority} />
              </dd>
              <dt>Assigné à</dt>
              <dd>
                <Person person={ticket.assignedTo} />
              </dd>
              <dt>Demandeur</dt>
              <dd>
                <Person person={ticket.createdBy} />
              </dd>
              <dt>Catégorie</dt>
              <dd>{CATEGORY_LABELS[ticket.category]}</dd>
              <dt>Créé</dt>
              <dd title={formatDateTime(ticket.createdAt)}>{formatDateTime(ticket.createdAt)}</dd>
              <dt>Mis à jour</dt>
              <dd title={formatDateTime(ticket.updatedAt)}>{formatRelative(ticket.updatedAt)}</dd>
              {ticket.firstResponseAt && (
                <>
                  <dt>Prise en charge</dt>
                  <dd>{formatDateTime(ticket.firstResponseAt)}</dd>
                </>
              )}
              {ticket.resolvedAt && (
                <>
                  <dt>Résolu</dt>
                  <dd>{formatDateTime(ticket.resolvedAt)}</dd>
                </>
              )}
              {ticket.closedAt && (
                <>
                  <dt>Fermé</dt>
                  <dd>{formatDateTime(ticket.closedAt)}</dd>
                </>
              )}
            </dl>
          </Card>
        </aside>
      </div>
    </>
  );
}
