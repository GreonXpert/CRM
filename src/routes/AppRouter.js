// /src/routes/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // **FIX:** Use a named import

// Layout & Pages
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import SuperAdminDashboard from '../pages/dashboard/SuperAdminDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import AddLeadPage from '../pages/leads/AddLeadPage';
import ManageLeadsPage from '../pages/leads/ManageLeadPage';
import UserProfilePage from '../pages/profile/UserProfilePage';
import NotFoundPage from '../pages/NotFoundPage';
import PrivateRoute from './PrivateRoute';
import ManageUsersPage from '../pages/admin/ManageUsersPage';

const AppRouter = () => {
  const { user } = useAuth();

  const Dashboard = user?.role === 'SUPER ADMIN' ? SuperAdminDashboard : AdminDashboard;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/resetpassword/:resettoken" element={<ResetPasswordPage />} />

        {/* Private Routes for both ADMIN and SUPER ADMIN */}
        <Route element={<PrivateRoute roles={['ADMIN', 'SUPER ADMIN']} />}>
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/leads/add" element={<AppLayout><AddLeadPage /></AppLayout>} />
          <Route path="/leads/manage" element={<AppLayout><ManageLeadsPage /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><UserProfilePage /></AppLayout>} />
        </Route>
        
        {/* Super Admin Only Routes */}
        <Route element={<PrivateRoute roles={['SUPER ADMIN']} />}>
          <Route path="/users/manage" element={<AppLayout><ManageUsersPage /></AppLayout>} />
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
