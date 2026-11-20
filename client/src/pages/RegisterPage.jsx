import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import FormField from '../components/FormField.jsx';
import { homePathFor } from '../context/AuthContext.js';
import { useAuth } from '../hooks/useAuth.js';

const EMPTY = { firstName: '', lastName: '', email: '', department: '', password: '' };

export default function RegisterPage() {
  const { register, user, status } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === 'authenticated') return <Navigate to={homePathFor(user.role)} replace />;

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { department, ...rest } = form;
      const newUser = await register(department.trim() ? form : rest);
      navigate(homePathFor(newUser.role), { replace: true });
    } catch (err) {
      setError(err);
      setSubmitting(false);
    }
  }

  const fieldError = (name) => error?.details?.[name];

  return (
    <main className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Créer un compte</h1>
        <p className="muted">Pour déclarer et suivre vos incidents informatiques</p>

        {error && !error.details && (
          <p className="alert" role="alert">
            {error.message}
          </p>
        )}

        <div className="field-row">
          <FormField
            label="Prénom"
            name="firstName"
            autoComplete="given-name"
            value={form.firstName}
            onChange={update}
            error={fieldError('firstName')}
            required
            autoFocus
          />
          <FormField
            label="Nom"
            name="lastName"
            autoComplete="family-name"
            value={form.lastName}
            onChange={update}
            error={fieldError('lastName')}
            required
          />
        </div>
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update}
          error={fieldError('email')}
          required
        />
        <FormField
          label="Service (facultatif)"
          name="department"
          autoComplete="organization-title"
          placeholder="ex. Comptabilité"
          value={form.department}
          onChange={update}
          error={fieldError('department')}
        />
        <FormField
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={update}
          error={fieldError('password')}
          hint="Au moins 8 caractères, dont une lettre et un chiffre"
          required
        />

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Création du compte…' : 'S’inscrire'}
        </button>

        <p className="auth-switch">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </main>
  );
}
