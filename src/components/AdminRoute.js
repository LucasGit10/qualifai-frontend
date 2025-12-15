import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const AdminRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    // Redirect them to the dashboard if they are not an admin
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
