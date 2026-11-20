import { Inbox, Plus, Send, Trash2 } from "lucide-react";
import FormField from "../components/FormField.jsx";
import Logo, { LogoMark } from "../components/brand/Logo.jsx";
import PriorityBadge from "../components/tickets/PriorityBadge.jsx";
import StatusBadge from "../components/tickets/StatusBadge.jsx";
import Avatar from "../components/ui/Avatar.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";

const COLORS = [
  ["Fond", "--color-bg"],
  ["Surface", "--color-surface"],
  ["Texte", "--color-text"],
  ["Texte secondaire", "--color-text-secondary"],
  ["Accent Opale", "--color-accent"],
  ["Danger", "--color-danger"],
];
const STATUSES = ["open", "in_progress", "waiting_user", "resolved", "closed"];
const PRIORITIES = ["low", "medium", "high", "critical"];
const TYPE_SCALE = [
  ["Titre de page", "var(--text-2xl)", 620],
  ["Titre de section", "var(--text-lg)", 620],
  ["Texte courant", "var(--text-base)", 420],
  ["Légende", "var(--text-sm)", 420],
];

const grid = { display: "grid", gap: 16 };
const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  alignItems: "center",
};

/** Guide de style vivant : la charte graphique appliquée aux vrais composants. */
export default function StyleguidePage() {
  return (
    <>
      <PageHeader
        eyebrow="Design system"
        title="Guide de style Opale"
        description="Tokens et composants de l’interface. Toute nouvelle page les réutilise : aucune couleur ni taille codée en dur."
      />

      <div style={grid}>
        <Card title="Identité">
          <div style={{ ...row, gap: 32 }}>
            <Logo size={48} subtitle="Service desk" />
            <LogoMark size={64} />
            <LogoMark size={32} />
            <p
              className="text-gradient"
              style={{ fontSize: 34, fontWeight: 620 }}
            >
              Le support IT, tout en clarté.
            </p>
          </div>
        </Card>

        <Card title="Couleurs">
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            }}
          >
            {COLORS.map(([name, token]) => (
              <div key={token}>
                <div
                  style={{
                    height: 64,
                    borderRadius: 12,
                    background: `var(${token})`,
                    border: "1px solid var(--color-border)",
                  }}
                />
                <div style={{ marginTop: 8, fontWeight: 520 }}>{name}</div>
                <code className="text-secondary" style={{ fontSize: 12 }}>
                  {token}
                </code>
              </div>
            ))}
            <div>
              <div
                style={{
                  height: 64,
                  borderRadius: 12,
                  background: "var(--gradient-opale)",
                }}
              />
              <div style={{ marginTop: 8, fontWeight: 520 }}>Dégradé Opale</div>
              <code className="text-secondary" style={{ fontSize: 12 }}>
                --gradient-opale
              </code>
            </div>
          </div>
        </Card>

        <Card title="Typographie — Inter">
          <div style={grid}>
            {TYPE_SCALE.map(([label, size, weight]) => (
              <div
                key={label}
                style={{ ...row, justifyContent: "space-between" }}
              >
                <span
                  style={{
                    fontSize: size,
                    fontWeight: weight,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {label}
                </span>
                <code className="text-secondary" style={{ fontSize: 12 }}>
                  {size} · {weight}
                </code>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Boutons">
          <div style={grid}>
            <div style={row}>
              <Button icon={Plus}>Créer un ticket</Button>
              <Button variant="secondary">Secondaire</Button>
              <Button variant="ghost">Discret</Button>
              <Button variant="danger" icon={Trash2}>
                Supprimer
              </Button>
              <Button loading>Envoi…</Button>
              <Button disabled>Désactivé</Button>
            </div>
            <div style={row}>
              <Button size="sm" icon={Send}>
                Petit
              </Button>
              <Button size="lg">Grand</Button>
              <Button
                variant="secondary"
                iconOnly
                icon={Plus}
                aria-label="Ajouter"
              />
            </div>
          </div>
        </Card>

        <Card title="Statuts et priorités">
          <div style={grid}>
            <div style={row}>
              {STATUSES.map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </div>
            <div style={row}>
              {PRIORITIES.map((p) => (
                <PriorityBadge key={p} priority={p} />
              ))}
            </div>
            <div style={row}>
              <span className="ticket-key">HD-0042</span>
              <Badge tone="accent">Technicien</Badge>
              <Badge>Neutre</Badge>
            </div>
          </div>
        </Card>

        <Card title="Champs de formulaire">
          <div className="field-row">
            <FormField
              label="Titre"
              name="sg-title"
              placeholder="Imprimante 2e étage HS"
            />
            <FormField
              label="Email"
              name="sg-email"
              defaultValue="pas-un-email"
              error="Email invalide"
            />
            <FormField
              label="Mot de passe"
              name="sg-password"
              type="password"
              hint="Au moins 8 caractères"
            />
          </div>
        </Card>

        <Card title="Avatars">
          <div style={row}>
            <Avatar firstName="Sophie" lastName="Martin" size={40} />
            <Avatar firstName="Karim" lastName="Benali" size={40} />
            <Avatar firstName="Nathalie" lastName="Roux" size={40} />
            <Avatar firstName="Thomas" lastName="Leroy" size={40} />
          </div>
        </Card>

        <Card title="État vide">
          <EmptyState
            icon={Inbox}
            title="Aucun ticket pour le moment"
            description="Un état vide explique la situation et propose toujours l’action suivante."
            action={<Button icon={Plus}>Déclarer un incident</Button>}
          />
        </Card>
      </div>
    </>
  );
}
