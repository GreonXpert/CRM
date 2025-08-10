// src/routes/AppRouter.js - Fixed Router Configuration
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Layouts
import MainLayout from '../Layouts/MainLayout';
import PublicLayout from '../Layouts/PublicLayout';

// Authentication Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Dashboard Pages
import SuperAdminDashboard from '../pages/dashboard/SuperAdminDashboard';

// Lead Pages
import LeadsListPage from '../pages/leads/LeadsListPage';
import LeadDetailsPage from '../pages/leads/LeadDetailsPage';
import CreateLeadPage from '../pages/leads/AddLeadPage';

// User Pages
import UsersListPage from '../pages/users/UsersListPage';
import AddUserPage from '../pages/users/AddUserPage';
import UserDetailsPage from '../pages/users/UserDetailsPage';

// Other Pages
import ReportsPage from '../pages/reports/ReportsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/settings/SettingsPage';

// Error Pages
import NotFoundPage from '../pages/errors/NotFoundPage';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/public/*" element={<PublicRoute />}>
        <Route path="*" element={<PublicLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/public/login" replace />} />
        </Route>
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Routes */}
      <Route path="/*" element={<ProtectedRoute />}>
        <Route path="*" element={<MainLayout />}>
          {/* Dashboard */}
          <Route path="dashboard" element={<SuperAdminDashboard />} />

          {/* Lead Management */}
          <Route path="leads" element={<LeadsListPage />} />
          <Route path="leads/create" element={<CreateLeadPage />} />
          <Route path="leads/:id" element={<LeadDetailsPage />} />
          <Route path="leads/:id/edit" element={<div>Edit Lead - TODO</div>} />

          {/* User Management */}
          <Route path="users" element={<UsersListPage />} />
          <Route path="users/create" element={<AddUserPage />} />
          <Route path="users/:id" element={<UserDetailsPage />} />
          <Route path="users/:id/edit" element={<div>Edit User - TODO</div>} />

          {/* Other Pages */}
          <Route path="reports" element={<ReportsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Error Pages */}
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          <Route path="404" element={<NotFoundPage />} />
          
          {/* Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;