import React from 'react';
import { useUser } from '../context/UserContext';
import { Navigate, Outlet } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

const AuthWrapper = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    // Optionally render a loading spinner or skeleton screen
    return <div>Loading...</div>; 
  }

  if (!user) {
    // User is not authenticated, show the landing page
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the children routes
  return children ? children : <Outlet />;
};

export default AuthWrapper;
