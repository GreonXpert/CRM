// src/routes/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { AppDataProvider } from '../context/AppContext';

// Layouts
import MainLayout from '../layouts/MainLayout';
import PublicLayout from '../layouts/PublicLayout';

// Pages - Dashboard
import SuperAdminDashboard from '../pages/dashboard/SuperAdminDashboard';

// Pages - Authentication (assuming you have these)
// import LoginPage from '../pages/auth/LoginPage';
// import RegisterPage from '../pages/auth/RegisterPage';

// Pages - Leads
import LeadsListPage from '../pages/leads/LeadsListPage';
import LeadDetailsPage from '../pages/leads/LeadDetailsPage';

// Pages - Users
import UsersListPage from '../pages/users/UsersListPage';
import AddUserPage from '../pages/users/AddUserPage';
import UserDetailsPage from '../pages/users/UserDetailsPage';

// Pages - Other
import ReportsPage from '../pages/reports/ReportsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/settings/SettingsPage';

// Error Pages
import NotFoundPage from '../pages/errors/NotFoundPage';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green theme for GreonXpert
      light: '#60ad5e',
      dark: '#005005',
    },
    secondary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component (redirects if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Temporary Login Component (replace with your actual login component)
const TemporaryLoginPage = () => {
  const handleLogin = () => {
    // Mock login - replace with actual authentication
    localStorage.setItem('authToken', 'mock-token');
    window.location.href = '/dashboard';
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h2>GreonXpert Login</h2>
      <button onClick={handleLogin} style={{ 
        padding: '10px 20px', 
        backgroundColor: '#2e7d32', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Mock Login (Development)
      </button>
    </div>
  );
};

const AppRouter = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppDataProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <PublicLayout>
                  <TemporaryLoginPage />
                </PublicLayout>
              </PublicRoute>
            } />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              {/* Dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<SuperAdminDashboard />} />

              {/* Leads Management */}
              <Route path="leads" element={<LeadsListPage />} />
              <Route path="leads/:id" element={<LeadDetailsPage />} />
              <Route path="leads/create" element={<div>Create Lead Page - TODO</div>} />
              <Route path="leads/:id/edit" element={<div>Edit Lead Page - TODO</div>} />

              {/* Users Management */}
              <Route path="users" element={<UsersListPage />} />
              <Route path="users/create" element={<AddUserPage />} />
              <Route path="users/:id" element={<UserDetailsPage />} />
              <Route path="users/:id/edit" element={<div>Edit User Page - TODO</div>} />

              {/* Other Pages */}
              <Route path="reports" element={<ReportsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />

              {/* Error Pages */}
              <Route path="unauthorized" element={<UnauthorizedPage />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AppDataProvider>
    </ThemeProvider>
  );
};

export default AppRouter;