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
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import DashboardHome from '../components/dashboard/DashboardHome';
import AdminManagement from '../components/admin/AdminManagement';
import LeadPage from './LeadPage';
import CustomReportModal from '../components/dashboard/CustomReportModal'; // Import the modal
import AnalyticsPage from './AnalyticsPage';

const DRAWER_WIDTH = 280;

// Styled Components (no changes here)
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)`,
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
  '& .MuiToolbar-root': {
    minHeight: 70,
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #ffffff 100%)`,
  minHeight: '100vh',
  overflowX: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
    zIndex: 0,
  },
}));

const ContentWrapper = styled(Box)(() => ({
  position: 'relative',
  zIndex: 1,
  padding: '24px',
}));

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false); // State for the report modal
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleReportModalOpen = () => {
    setReportModalOpen(true);
  };

  const handleReportModalClose = () => {
    setReportModalOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Enhanced Header */}
      <StyledAppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Header onDrawerToggle={handleDrawerToggle} />
      </StyledAppBar>

      {/* Enhanced Sidebar */}
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
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
              borderRight: `1px solid ${theme.palette.grey[200]}`,
              boxShadow: '4px 0 20px rgba(99, 102, 241, 0.1)',
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
              background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
              borderRight: `1px solid ${theme.palette.grey[200]}`,
              boxShadow: '4px 0 20px rgba(99, 102, 241, 0.1)',
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* Enhanced Main Content */}
      <MainContent
        component="main"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar sx={{ minHeight: 70 }} />
        <ContentWrapper>
          <Fade in={true} timeout={800}>
            <Box>
              <Routes>
                <Route
                  path="/"
                  element={<DashboardHome onGenerateReport={handleReportModalOpen} />}
                />
                <Route path="/admin-management" element={<AdminManagement />} />
                <Route path="/leads" element={<LeadPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </Routes>
            </Box>
          </Fade>
        </ContentWrapper>
      </MainContent>

      {/* Report Modal */}
      <CustomReportModal
        open={reportModalOpen}
        handleClose={handleReportModalClose}
      />
    </Box>
  );
};

export default Dashboard;