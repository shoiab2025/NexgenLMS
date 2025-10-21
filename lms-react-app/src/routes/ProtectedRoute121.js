import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthcontext } from '../contexts/Authcontext';

const ProtectedRoute = ({ children }) => {
  const { authUser } = useAuthcontext();

  // If no user is logged in, redirect to login page
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the children components (protected routes)
  return children;
};

export default ProtectedRoute;
