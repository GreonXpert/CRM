// pages/dashboard/SuperAdminDashboard.js - Updated with enhanced context
import React, { useEffect } from 'react';
import { Container, Grid, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

// Import Custom Components
import StatCard from '../../components/dashboard/StatCard';
import AppChart from '../../components/dashboard/AppChart';
import LeadTable from '../../components/dashboard/EnhancedLeadTable';

// Import Icons
import { Group, CheckCircle, ThumbDown, TrendingUp, BarChart, PieChart } from '@mui/icons-material';

// Import Enhanced Context Hooks
import { useLeads, useDashboard, useNotifications } from '../../context/AppContext';

// Import Mock Services (remove in production)
import { MockDataService } from '../../api/apiClient';

// ==============================================
// ANIMATION VARIANTS
// ==============================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

// ==============================================
// MAIN COMPONENT
// ==============================================
const SuperAdminDashboard = () => {
  // Context hooks
  const { 
    leads, 
    loading: leadsLoading, 
    error: leadsError, 
    fetchLeads,
    deleteLead 
  } = useLeads();
  
  const { 
    dashboardStats, 
    loading: dashboardLoading, 
    error: dashboardError, 
    fetchDashboardStats 
  } = useDashboard();
  
  const { 
    error: globalError, 
    clearError,
    addNotification 
  } = useNotifications();

  // ==============================================
  // DATA FETCHING
  // ==============================================
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Clear any existing errors
        clearError();

        // Fetch dashboard data using mock services (replace with real API calls)
        const [statsResponse, leadsResponse] = await Promise.all([
          MockDataService.getDashboardStats(),
          MockDataService.getRecentLeads()
        ]);

        // Simulate setting data through context
        // In real implementation, these would be called through context hooks
        console.log('Dashboard stats:', statsResponse.data);
        console.log('Recent leads:', leadsResponse.data);

        // Add success notification
        addNotification({
          type: 'success',
          message: 'Dashboard data loaded successfully'
        });

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        addNotification({
          type: 'error',
          message: 'Failed to load dashboard data. Please try again.'
        });
      }
    };

    initializeDashboard();
  }, [clearError, addNotification]);

  // ==============================================
  // EVENT HANDLERS
  // ==============================================
  const handleEditLead = (lead) => {
    console.log('Edit lead:', lead);
    addNotification({
      type: 'info',
      message: `Editing lead for ${lead.customerName}`
    });
    // Implement edit functionality
  };

  const handleDeleteLead = async (leadId) => {
    try {
      await deleteLead(leadId);
      addNotification({
        type: 'success',
        message: 'Lead deleted successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to delete lead. Please try again.'
      });
    }
  };

  // ==============================================
  // MOCK DATA FOR DEMONSTRATION
  // ==============================================
  const mockStats = {
    totalLeads: 1284,
    approvedCount: 972,
    rejectedCount: 312,
    approvalRatio: 75.7,
    statusCounts: [
      { name: 'Approved', value: 972 },
      { name: 'Rejected', value: 312 },
      { name: 'Follow-up', value: 150 },
      { name: 'New', value: 50 },
    ],
    monthlyPerformance: [
      { name: 'Jan', leads: 150 },
      { name: 'Feb', leads: 200 },
      { name: 'Mar', leads: 180 },
      { name: 'Apr', leads: 250 },
      { name: 'May', leads: 220 },
      { name: 'Jun', leads: 300 },
    ],
  };

  const mockRecentLeads = [
    { 
      _id: '1', 
      customerName: 'Rohan Verma', 
      mobileNumber: '9876543210',
      status: 'Approved', 
      createdAt: new Date().toISOString(), 
      createdBy: { name: 'Admin One', email: 'admin1@example.com' },
      panCard: 'ABCDE1234F',
      aadharNumber: '123456789012',
      preferredBank: 'HDFC'
    },
    { 
      _id: '2', 
      customerName: 'Sneha Reddy', 
      mobileNumber: '9123456789',
      status: 'New', 
      createdAt: new Date().toISOString(), 
      createdBy: { name: 'Admin Two', email: 'admin2@example.com' },
      panCard: 'FGHIJ5678K',
      aadharNumber: '234567890123',
      preferredBank: 'ICICI'
    },
    { 
      _id: '3', 
      customerName: 'Arjun Singh', 
      mobileNumber: '9988776655',
      status: 'Rejected', 
      createdAt: new Date().toISOString(), 
      createdBy: { name: 'Admin One', email: 'admin1@example.com' },
      panCard: 'KLMNO9012P',
      aadharNumber: '345678901234',
      preferredBank: 'AXIS'
    },
    { 
      _id: '4', 
      customerName: 'Meera Desai', 
      mobileNumber: '9765432109',
      status: 'Follow-up', 
      createdAt: new Date().toISOString(), 
      createdBy: { name: 'Admin Three', email: 'admin3@example.com' },
      panCard: 'QRSTU3456V',
      aadharNumber: '456789012345',
      preferredBank: 'SBI'
    },
  ];

  // Use context data if available, otherwise use mock data
  const currentStats = dashboardStats || mockStats;
  const currentLeads = leads.length > 0 ? leads : mockRecentLeads;
  const isLoading = dashboardLoading || leadsLoading;
  const hasError = dashboardError || leadsError || globalError;

  // ==============================================
  // LOADING STATE
  // ==============================================
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '400px' 
        }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  // ==============================================
  // RENDER COMPONENT
  // ==============================================
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            Super Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome back! Here's an overview of your platform's performance.
          </Typography>
        </motion.div>

        {/* Error Alert */}
        {hasError && (
          <motion.div variants={itemVariants}>
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={clearError}
            >
              {hasError}
            </Alert>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Leads"
                value={currentStats.totalLeads?.toLocaleString() || '0'}
                icon={<Group />}
                color="primary"
                trend={5.2}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Approved"
                value={currentStats.approvedCount?.toLocaleString() || '0'}
                icon={<CheckCircle />}
                color="success"
                trend={8.1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Rejected"
                value={currentStats.rejectedCount?.toLocaleString() || '0'}
                icon={<ThumbDown />}
                color="error"
                trend={-3.2}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Approval Rate"
                value={`${currentStats.approvalRatio?.toFixed(1) || '0'}%`}
                icon={<TrendingUp />}
                color="info"
                trend={2.4}
              />
            </Grid>
          </Grid>
        </motion.div>

        {/* Charts */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <AppChart
                title="Monthly Performance"
                data={currentStats.monthlyPerformance || []}
                type="bar"
                icon={<BarChart />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppChart
                title="Status Distribution"
                data={currentStats.statusCounts || []}
                type="pie"
                icon={<PieChart />}
              />
            </Grid>
          </Grid>
        </motion.div>

        {/* Recent Leads Table */}
        <motion.div variants={itemVariants}>
          <Box 
            sx={{ 
              backgroundColor: 'background.paper', 
              borderRadius: 2, 
              p: 3,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)' 
            }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ fontWeight: 600 }}
            >
              Recent Leads
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Latest leads submitted to the platform
            </Typography>
            
            <LeadTable
              leads={currentLeads}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
              loading={isLoading}
              error={hasError}
            />
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default SuperAdminDashboard;