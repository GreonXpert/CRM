// /src/routes/PublicRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

/**
 * PublicRoute component for handling public pages
 * Redirects authenticated users away from auth pages to dashboard
 * Allows unauthenticated users to access public pages
 */
const PublicRoute = ({ redirectTo = '/dashboard' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Check if current path is an auth page
  const authPages = ['/login', '/register', '/forgot-password'];
  const isAuthPage = authPages.includes(location.pathname);

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (user && isAuthPage) {
    return <Navigate to={redirectTo} replace />;
  }

  // Allow access to public pages (shared forms, thank you page, etc.)
  return <Outlet />;
};

export default PublicRoute;