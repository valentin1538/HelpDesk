import { ChevronRight, MessagesSquare } from "lucide-react";
import { Link, useParams } from "react-router";
import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";

// Détail d'un ticket : US05 (actions) et US06 (commentaires)
export default function TicketDetailPage() {
  const { id } = useParams();
  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <Link to="/tickets">Tickets</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="ticket-key">{id}</span>
          </>
        }
        title="Détail du ticket"
      />
      <Card>
        <EmptyState
          icon={MessagesSquare}
          title="Le détail du ticket arrive bientôt"
          description="Description, historique, discussion en temps réel et actions du support seront réunis sur cette page."
        >
          <div style={{ display: "flex", gap: 8 }}>
            <Badge tone="accent">US05</Badge>
            <Badge tone="accent">US06</Badge>
          </div>
        </EmptyState>
      </Card>
    </>
  );
}
