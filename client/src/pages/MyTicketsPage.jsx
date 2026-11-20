import { Inbox, Plus } from "lucide-react";
import { Link } from "react-router";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";

// Liste des tickets : US03
export default function MyTicketsPage() {
  return (
    <>
      <PageHeader
        title="Mes tickets"
        description="Suivez l’avancement de vos demandes auprès du support informatique."
        actions={
          <Button as={Link} to="/tickets/new" icon={Plus}>
            Nouveau ticket
          </Button>
        }
      />
      <Card>
        <EmptyState
          icon={Inbox}
          title="Aucun ticket pour le moment"
          description="Une imprimante en panne, un accès qui bloque ? Déclarez l’incident : vous suivrez sa prise en charge ici, en temps réel."
          action={
            <Button as={Link} to="/tickets/new" variant="secondary" icon={Plus}>
              Déclarer un incident
            </Button>
          }
        />
      </Card>
    </>
  );
}
