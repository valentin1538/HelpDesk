import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import FormField from '../components/FormField.jsx';
import { homePathFor } from '../context/AuthContext.js';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
  const { login, user, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Déjà connecté : pas de raison de rester sur la page de connexion
  if (status === 'authenticated') return <Navigate to={homePathFor(user.role)} replace />;

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const loggedUser = await login(form.email, form.password);
      // Retour à la page demandée avant la connexion (routes protégées, US09), sinon accueil du rôle
      navigate(location.state?.from ?? homePathFor(loggedUser.role), { replace: true });
    } catch (err) {
      setError(err);
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Se connecter</h1>
        <p className="muted">HelpDesk — support informatique</p>

        {error && !error.details && (
          <p className="alert" role="alert">
            {error.message}
          </p>
        )}

        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update}
          error={error?.details?.email}
          required
          autoFocus
        />
        <FormField
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={update}
          error={error?.details?.password}
          required
        />

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>

        <p className="auth-switch">
          Pas encore de compte ? <Link to="/register">S’inscrire</Link>
        </p>
      </form>
    </main>
  );
}
