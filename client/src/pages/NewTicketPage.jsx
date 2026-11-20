import { ChevronRight, FilePlus2 } from "lucide-react";
import { Link } from "react-router";
import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";

// Formulaire de création : US02
export default function NewTicketPage() {
  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <Link to="/tickets">Mes tickets</Link>
            <ChevronRight size={14} aria-hidden="true" />
            Nouveau ticket
          </>
        }
        title="Déclarer un incident"
        description="Décrivez le problème : le support le prend en charge selon sa priorité."
      />
      <Card>
        <EmptyState
          icon={FilePlus2}
          title="Le formulaire arrive bientôt"
          description="Titre, description, catégorie et priorité : la déclaration d’incident est en cours de développement."
        >
          <Badge tone="accent">US02</Badge>
        </EmptyState>
      </Card>
    </>
  );
}
