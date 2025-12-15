import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ManagerRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Permitir acesso para 'manager' ou 'admin'
  if (!['manager', 'admin'].includes(user?.role)) {
    return <Navigate to="/app/team" replace />;
  }

  return <Outlet />;
};

export default ManagerRoute;