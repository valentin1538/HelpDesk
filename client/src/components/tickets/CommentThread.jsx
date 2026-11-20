import { useEffect, useState } from 'react';
import { CircleAlert, Lock, MessagesSquare, Send } from 'lucide-react';
import { addComment, listComments } from '../../api/comments.js';
import FormField from '../FormField.jsx';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { ROLE_LABELS } from '../../constants/labels.js';
import { isStaff } from '../../constants/workflow.js';
import { useAuth } from '../../hooks/useAuth.js';
import { formatDateTime, formatRelative, fullName } from '../../utils/format.js';

const MAX_LENGTH = 5000;

function CommentItem({ comment }) {
  const author = comment.author;
  return (
    <li className={`comment${comment.isInternal ? ' comment-internal' : ''}`}>
      <Avatar firstName={author?.firstName} lastName={author?.lastName} size={32} />
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{fullName(author)}</span>
          {author?.role && author.role !== 'user' && (
            <span className="comment-role">{ROLE_LABELS[author.role]}</span>
          )}
          {comment.isInternal && (
            <Badge tone="accent">
              <Lock size={12} aria-hidden="true" /> Note interne
            </Badge>
          )}
          <time
            className="comment-time"
            dateTime={comment.createdAt}
            title={formatDateTime(comment.createdAt)}
          >
            {formatRelative(comment.createdAt)}
          </time>
        </div>
        <p className="comment-body">{comment.content}</p>
      </div>
    </li>
  );
}

/**
 * US06 — Fil de discussion du ticket.
 *  - lecture paginée (page 1 = les messages les plus récents, bouton pour charger les précédents)
 *  - envoi d'un message ; le support peut en faire une note interne (RG6 : jamais renvoyée à un `user`)
 *  - ticket fermé : plus de commentaire possible (RG7)
 * Les droits et les règles restent appliqués par le serveur : ce composant ne fait que guider l'interface.
 */
export default function CommentThread({ ticket }) {
  const { user } = useAuth();
  const staff = isStaff(user);
  const closed = ticket.status === 'closed';

  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadMorePending, setLoadMorePending] = useState(false);
  const [content, setContent] = useState('');
  const [internal, setInternal] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Le composant est monté par ticket (`key` côté page) : `loading` démarre à true, rien à réarmer.
  useEffect(() => {
    let cancelled = false;
    listComments(ticket._id, { page: 1 })
      .then((result) => {
        if (cancelled) return;
        setComments(result.comments);
        setPagination(result.pagination);
        setError(null);
      })
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [ticket._id]);

  async function loadPrevious() {
    if (!pagination) return;
    setLoadMorePending(true);
    setError(null);
    try {
      const result = await listComments(ticket._id, { page: pagination.page + 1 });
      // les pages vont du plus récent au plus ancien : les précédents se placent devant
      setComments((current) => [...result.comments, ...current]);
      setPagination(result.pagination);
    } catch (err) {
      setError(err);
    } finally {
      setLoadMorePending(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) {
      setError({
        message: 'Écrivez un message avant de l’envoyer.',
        details: { content: 'Le message ne peut pas être vide' },
      });
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const comment = await addComment(ticket._id, { content, isInternal: internal });
      setComments((current) => [...current, comment]);
      setContent('');
      setInternal(false);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  const hasPrevious = pagination && pagination.page < pagination.totalPages;

  return (
    <div className="comments">
      {error && (
        <p className="alert" role="alert">
          <CircleAlert size={16} aria-hidden="true" />
          {error.message}
        </p>
      )}

      {loading ? (
        <div className="comment-skeleton" aria-busy="true" aria-label="Chargement de la discussion">
          <div className="skeleton" style={{ height: 56, borderRadius: 12 }} />
          <div className="skeleton" style={{ height: 56, borderRadius: 12 }} />
        </div>
      ) : comments.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="Aucun message pour l’instant"
          description="Posez une question ou donnez une précision : le support et vous êtes les seuls à voir ce fil."
        />
      ) : (
        <>
          {hasPrevious && (
            <div className="comment-more">
              <Button variant="ghost" size="sm" loading={loadMorePending} onClick={loadPrevious}>
                Voir les messages précédents
              </Button>
            </div>
          )}
          <ul className="comment-list">
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </ul>
        </>
      )}

      {closed ? (
        <p className="comment-closed">
          Ce ticket est fermé : la discussion est close. Déclarez un nouvel incident si le problème
          revient.
        </p>
      ) : (
        <form className="comment-form" onSubmit={handleSubmit} noValidate>
          <FormField
            as="textarea"
            label="Votre message"
            name="content"
            rows={3}
            placeholder="Précisez votre demande, répondez au support…"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              if (error?.details?.content) setError(null);
            }}
            error={error?.details?.content}
            maxLength={MAX_LENGTH}
            counter
          />

          {staff && (
            <label className="comment-options">
              <input
                type="checkbox"
                checked={internal}
                onChange={(event) => setInternal(event.target.checked)}
              />
              Note interne — visible uniquement par le support, jamais par le demandeur.
            </label>
          )}

          <div className="comment-form-actions">
            <Button type="submit" icon={Send} loading={submitting}>
              {submitting ? 'Envoi…' : 'Envoyer'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
