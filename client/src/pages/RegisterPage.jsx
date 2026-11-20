import { useState } from "react";
import { CircleAlert } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router";
import FormField from "../components/FormField.jsx";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";
import { homePathFor } from "../context/AuthContext.js";
import { useAuth } from "../hooks/useAuth.js";

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  password: "",
};

export default function RegisterPage() {
  const { register, user, status } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "authenticated")
    return <Navigate to={homePathFor(user.role)} replace />;

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
    <AuthLayout
      title="Créer votre compte"
      subtitle="Pour déclarer et suivre vos incidents informatiques."
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && !error.details && (
          <p className="alert" role="alert">
            <CircleAlert size={16} aria-hidden="true" />
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
            error={fieldError("firstName")}
            required
            autoFocus
          />
          <FormField
            label="Nom"
            name="lastName"
            autoComplete="family-name"
            value={form.lastName}
            onChange={update}
            error={fieldError("lastName")}
            required
          />
        </div>
        <FormField
          label="Email professionnel"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="prenom.nom@entreprise.fr"
          value={form.email}
          onChange={update}
          error={fieldError("email")}
          required
        />
        <FormField
          label="Service (facultatif)"
          name="department"
          autoComplete="organization-title"
          placeholder="ex. Comptabilité"
          value={form.department}
          onChange={update}
          error={fieldError("department")}
        />
        <FormField
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={update}
          error={fieldError("password")}
          hint="Au moins 8 caractères, dont une lettre et un chiffre"
          required
        />

        <Button type="submit" size="lg" block loading={submitting}>
          {submitting ? "Création du compte…" : "Créer mon compte"}
        </Button>
      </form>

      <p className="auth-switch">
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </AuthLayout>
  );
}
