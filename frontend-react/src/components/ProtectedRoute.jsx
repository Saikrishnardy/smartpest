import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, user } = useAuth(); // Get user from AuthContext
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && (!user || user.role !== 'admin')) {
    // If adminOnly is true and user is not an admin, redirect to home or a forbidden page
    // For now, redirect to home page, but a specific /forbidden page could be better
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;