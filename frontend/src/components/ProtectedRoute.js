// Protects routes so only authenticated users can access them.
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { token, loading } = useAuth();

  if (loading) {
    return null;
  }

  return token ? React.createElement(Outlet, null) : React.createElement(Navigate, { to: '/login', replace: true });
}

export default ProtectedRoute;
