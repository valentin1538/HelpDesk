import { NavLink, Outlet } from 'react-router';

export default function Layout() {
  return (
    <>
      <header style={{ display: 'flex', gap: 16, padding: '12px 24px', background: '#fff', borderBottom: '1px solid #ddd' }}>
        <strong>HelpDesk</strong>
        <NavLink to="/tickets">Mes tickets</NavLink>
        <NavLink to="/tickets/new">Nouveau ticket</NavLink>
        <NavLink to="/queue">File technicien</NavLink>
        <NavLink to="/admin">Tableau de bord</NavLink>
      </header>
      <main style={{ padding: 24 }}><Outlet /></main>
    </>
  );
}