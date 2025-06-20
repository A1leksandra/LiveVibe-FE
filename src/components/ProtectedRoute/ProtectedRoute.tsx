import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isUserAdmin } from '../../shared/utils/authUtils';

interface ProtectedRouteProps {
  children: React.ReactElement;
  checkAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, checkAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    setIsAdmin(isUserAdmin());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (checkAdmin && !isAdmin) {
    return <Navigate to="/events" />;
  }

  return children;
};

export default ProtectedRoute; 