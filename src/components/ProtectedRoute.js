import React from 'react';
import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const stripeSuccess = searchParams.get('stripe_success') === 'true';

  if (user?.plan === 'guest') {
    if (stripeSuccess) {
      return <Outlet />;
    }
    return <Navigate to="/plan-notification" state={{ from: location }} replace />;
  }


  return <Outlet />;
};

export default ProtectedRoute;