import { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { Link, Navigate, useLocation } from 'react-router';
import FormField from '../components/FormField.jsx';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import Button from '../components/ui/Button.jsx';
import { homePathFor } from '../context/AuthContext.js';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
  const { login, user, status } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Connecté (déjà, ou juste après l'envoi du formulaire) : UNE seule redirection, vers la page
  // demandée avant la connexion (routes protégées, US09) ou, à défaut, l'accueil du rôle.
  if (status === 'authenticated') {
    return <Navigate to={location.state?.from ?? homePathFor(user.role)} replace />;
  }

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(form.email, form.password); // la session ouverte déclenche la redirection ci-dessus
    } catch (err) {
      setError(err);
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Bon retour parmi nous" subtitle="Connectez-vous pour suivre vos demandes.">
      <form onSubmit={handleSubmit} noValidate>
        {error && !error.details && (
          <p className="alert" role="alert">
            <CircleAlert size={16} aria-hidden="true" />
            {error.message}
          </p>
        )}

        <FormField
          label="Email professionnel"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="prenom.nom@entreprise.fr"
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

        <Button type="submit" size="lg" block loading={submitting}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>

      <p className="auth-switch">
        Pas encore de compte ? <Link to="/register">Créer un compte</Link>
      </p>
    </AuthLayout>
  );
}
