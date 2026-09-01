import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, getAuthToken } from '../lib/api';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const token = getAuthToken();
  const user = getCurrentUser();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase();
    const hasRole = allowedRoles.some((role) => role.toLowerCase() === userRole);
    if (!hasRole) {
      // Redirect user to their role-appropriate dashboard if they attempt to access forbidden routes
      if (userRole === 'borrower') {
        return <Navigate to="/borrower/dashboard" replace />;
      } else if (userRole === 'lender' || userRole === 'admin') {
        return <Navigate to="/lender/dashboard" replace />;
      }
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
