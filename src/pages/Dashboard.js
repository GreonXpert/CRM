// src/pages/Dashboard.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import DashboardHome from '../components/dashboard/DashboardHome';
import AdminManagement from '../components/admin/AdminManagement';
import LeadPage from './LeadPage';

const DRAWER_WIDTH = 280;

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <Header onDrawerToggle={handleDrawerToggle} />
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              backgroundColor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'grey.200',
            },
          }}
        >
          <Sidebar onMobileClose={handleDrawerToggle} />
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              backgroundColor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'grey.200',
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Toolbar /> {/* Spacer for fixed header */}
        <Box sx={{ p: 3 }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/admin-management" element={<AdminManagement />} />
            <Route path="/leads" element={<LeadPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
