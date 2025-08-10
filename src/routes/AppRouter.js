// /src/routes/AppRouter.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

// Import Hooks
import { useAuth } from '../hooks/useAuth';

// Import Route Guards
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Import Layout Components
import MainLayout from '../layouts/MainLayout';
import PublicLayout from '../layouts/PublicLayout';

// Import Pages - Lazy Loading for Better Performance
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('../pages/auth/ForgotPasswordPage'));

// Dashboard Pages
const SuperAdminDashboard = React.lazy(() => import('../pages/dashboard/SuperAdminDashboard'));
const AdminDashboard = React.lazy(() => import('../pages/dashboard/AdminDashboard'));

// Lead Pages
const AddLeadPage = React.lazy(() => import('../pages/leads/AddLeadPage'));
const LeadsListPage = React.lazy(() => import('../pages/leads/LeadsListPage'));
const LeadDetailsPage = React.lazy(() => import('../pages/leads/LeadDetailsPage'));
const SharedLeadFormPage = React.lazy(() => import('../pages/leads/SharedLeadFormPage'));

// User Management Pages
const UsersListPage = React.lazy(() => import('../pages/users/UsersListPage'));
const AddUserPage = React.lazy(() => import('../pages/users/AddUserPage'));
const UserDetailsPage = React.lazy(() => import('../pages/users/UserDetailsPage'));

// Report Pages
const ReportsPage = React.lazy(() => import('../pages/reports/ReportsPage'));

// Other Pages
const ProfilePage = React.lazy(() => import('../pages/profile/ProfilePage'));
const SettingsPage = React.lazy(() => import('../pages/settings/SettingsPage'));
const NotFoundPage = React.lazy(() => import('../pages/errors/NotFoundPage'));
const UnauthorizedPage = React.lazy(() => import('../pages/errors/UnauthorizedPage'));
const ThankYouPage = React.lazy(() => import('../pages/shared/ThankYouPage'));

// ==============================================
// LOADING COMPONENT
// ==============================================
const PageLoader = ({ message = 'Loading...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: 2,
    }}
  >
    <CircularProgress size={48} />
    <Typography variant="h6" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// ==============================================
// DASHBOARD ROUTE COMPONENT
// ==============================================
const DashboardRoute = () => {
  const { user } = useAuth();
  
  // Redirect to appropriate dashboard based on role
  if (user?.role === 'SUPER ADMIN') {
    return <SuperAdminDashboard />;
  } else if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  } else {
    // Default to admin dashboard for other roles
    return <AdminDashboard />;
  }
};

// ==============================================
// MAIN ROUTER COMPONENT
// ==============================================
const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes - No Authentication Required */}
          <Route element={<PublicRoute />}>
            <Route element={<PublicLayout />}>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Shared Lead Form - Public Access */}
              <Route 
                path="/lead/shared/:userId" 
                element={
                  <Suspense fallback={<PageLoader message="Loading form..." />}>
                    <SharedLeadFormPage />
                  </Suspense>
                } 
              />
              
              {/* Thank You Page */}
              <Route path="/thank-you" element={<ThankYouPage />} />
              
              {/* Error Pages */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Route>
          </Route>

          {/* Private Routes - Authentication Required */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              {/* Dashboard Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <Suspense fallback={<PageLoader message="Loading dashboard..." />}>
                    <DashboardRoute />
                  </Suspense>
                } 
              />

              {/* Lead Management Routes */}
              <Route path="/leads">
                <Route 
                  index 
                  element={
                    <Suspense fallback={<PageLoader message="Loading leads..." />}>
                      <LeadsListPage />
                    </Suspense>
                  } 
                />
                <Route 
                  path="add" 
                  element={
                    <PrivateRoute roles={['SUPER ADMIN', 'ADMIN']}>
                      <Suspense fallback={<PageLoader message="Loading form..." />}>
                        <AddLeadPage />
                      </Suspense>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path=":leadId" 
                  element={
                    <Suspense fallback={<PageLoader message="Loading lead details..." />}>
                      <LeadDetailsPage />
                    </Suspense>
                  } 
                />
              </Route>

              {/* User Management Routes - Super Admin Only */}
              <Route element={<PrivateRoute roles={['SUPER ADMIN']} />}>
                <Route path="/users">
                  <Route 
                    index 
                    element={
                      <Suspense fallback={<PageLoader message="Loading users..." />}>
                        <UsersListPage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="add" 
                    element={
                      <Suspense fallback={<PageLoader message="Loading form..." />}>
                        <AddUserPage />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path=":userId" 
                    element={
                      <Suspense fallback={<PageLoader message="Loading user details..." />}>
                        <UserDetailsPage />
                      </Suspense>
                    } 
                  />
                </Route>
              </Route>

              {/* Reports Routes - Admin and Super Admin */}
              <Route element={<PrivateRoute roles={['SUPER ADMIN', 'ADMIN']} />}>
                <Route 
                  path="/reports" 
                  element={
                    <Suspense fallback={<PageLoader message="Loading reports..." />}>
                      <ReportsPage />
                    </Suspense>
                  } 
                />
              </Route>

              {/* Profile and Settings - All Authenticated Users */}
              <Route 
                path="/profile" 
                element={
                  <Suspense fallback={<PageLoader message="Loading profile..." />}>
                    <ProfilePage />
                  </Suspense>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <Suspense fallback={<PageLoader message="Loading settings..." />}>
                    <SettingsPage />
                  </Suspense>
                } 
              />
            </Route>
          </Route>

          {/* Root Redirect */}
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />

          {/* Catch-all Route - 404 Page */}
          <Route 
            path="*" 
            element={
              <Suspense fallback={<PageLoader />}>
                <NotFoundPage />
              </Suspense>
            } 
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;