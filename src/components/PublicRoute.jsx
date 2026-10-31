import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Guard for guest-only public routes (/login, /register)
export default function PublicRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Synchronously redirect authenticated users to the dashboard with zero flash
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

