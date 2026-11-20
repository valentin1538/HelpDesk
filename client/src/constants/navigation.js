import {
  Inbox,
  LayoutDashboard,
  ListChecks,
  Palette,
  PlusCircle,
} from "lucide-react";

/**
 * Navigation de la barre latérale, par groupes (inspiré de Jira).
 * `roles` : rôles autorisés à voir le lien (absent = tous les utilisateurs connectés).
 * Le filtrage par rôle est appliqué par US09 (routes protégées).
 */
export const NAV_GROUPS = Object.freeze([
  {
    label: "Mon espace",
    items: [
      { to: "/tickets", label: "Mes tickets", icon: Inbox, end: true },
      { to: "/tickets/new", label: "Nouveau ticket", icon: PlusCircle },
    ],
  },
  {
    label: "Support",
    items: [
      {
        to: "/queue",
        label: "File du support",
        icon: ListChecks,
        roles: ["technician", "admin"],
      },
    ],
  },
  {
    label: "Pilotage",
    items: [
      {
        to: "/admin",
        label: "Tableau de bord",
        icon: LayoutDashboard,
        roles: ["admin"],
      },
      { to: "/styleguide", label: "Guide de style", icon: Palette },
    ],
  },
]);
