import { Route, Routes } from 'react-router';
import HomeRedirect from './components/auth/HomeRedirect.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MyTicketsPage from './pages/MyTicketsPage.jsx';
import NewTicketPage from './pages/NewTicketPage.jsx';
import TicketDetailPage from './pages/TicketDetailPage.jsx';
import TechQueuePage from './pages/TechQueuePage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import StyleguidePage from './pages/StyleguidePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<HomeRedirect />} />
          <Route path="tickets" element={<MyTicketsPage />} />
          <Route path="tickets/new" element={<NewTicketPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />
          <Route path="styleguide" element={<StyleguidePage />} />
          <Route element={<ProtectedRoute roles={['technician', 'admin']} />}>
            <Route path="queue" element={<TechQueuePage />} />
          </Route>
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Route>
      {/* URL inconnue → page 404 (hors garde : visible connecté ou non) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
