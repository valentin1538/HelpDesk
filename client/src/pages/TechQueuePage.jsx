import { ListChecks } from "lucide-react";
import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";

// File des tickets du support : US04
export default function TechQueuePage() {
  return (
    <>
      <PageHeader
        title="File du support"
        description="Tous les tickets, triés par urgence puis par ancienneté."
      />
      <Card>
        <EmptyState
          icon={ListChecks}
          title="La file est vide"
          description="Les nouveaux tickets apparaîtront ici, avec leurs filtres par statut, priorité et catégorie."
        >
          <Badge tone="accent">US04</Badge>
        </EmptyState>
      </Card>
    </>
  );
}
