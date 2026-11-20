import {
  CircleCheckBig,
  Clock3,
  Inbox,
  LoaderCircle,
  PieChart,
  Users,
} from "lucide-react";
import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";

const KPIS = [
  { label: "Tickets ouverts", icon: Inbox },
  { label: "En cours", icon: LoaderCircle },
  { label: "Résolus ce mois", icon: CircleCheckBig },
  { label: "Délai moyen de résolution", icon: Clock3 },
];

// Tableau de bord : US10 (Aggregation Pipeline). Mise en page « bento » des maquettes.
export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Volumes, délais et charge de l’équipe support."
        actions={<Badge tone="accent">US10</Badge>}
      />
      <div className="bento">
        {KPIS.map(({ label, icon: Icon }) => (
          <Card key={label}>
            <div className="stat-label">
              <span className="stat-icon">
                <Icon size={16} aria-hidden="true" />
              </span>
              {label}
            </div>
            <div className="stat-value">—</div>
            <div className="stat-hint">Disponible avec les statistiques</div>
          </Card>
        ))}
        <Card className="bento-wide" title="Tickets par catégorie">
          <EmptyState icon={PieChart} title="Pas encore de données" />
        </Card>
        <Card className="bento-wide" title="Charge par technicien">
          <EmptyState icon={Users} title="Pas encore de données" />
        </Card>
      </div>
    </>
  );
}
