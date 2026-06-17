import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Plan gating is temporarily disabled while signup runs without plans.
  // if (user?.plan === 'guest') {
  //   return <Navigate to="/plan-notification" state={{ from: location }} replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
