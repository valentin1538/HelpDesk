import { ArrowLeft, ShieldX } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function ForbiddenPage() {
  return (
    <Card>
      <EmptyState
        icon={ShieldX}
        title="Accès réservé"
        description="Cette page est réservée à une autre équipe. Si vous pensez qu’il s’agit d’une erreur, contactez votre administrateur."
        action={
          <Button as={Link} to="/" variant="secondary" icon={ArrowLeft}>
            Retour à l’accueil
          </Button>
        }
      />
    </Card>
  );
}
