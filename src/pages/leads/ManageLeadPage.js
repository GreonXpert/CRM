// /src/pages/leads/ManageLeadPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Stack, 
  Alert,
  Snackbar,
  Paper,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';

// Import Custom Components
import EnhancedLeadTable from '../../components/dashboard/EnhancedLeadTable';
import AppButton from '../../components/common/AppButton';

// Import Icons
import { Add, Download, Print, Refresh } from '@mui/icons-material';

// Import Services
import leadService from '../../api/leadService';
import { useAuth } from '../../hooks/useAuth';

// --- Animation Variants for Framer Motion ---
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

const ManageLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [refreshing, setRefreshing] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch leads from API
  const fetchLeads = async (showRefreshMessage = false) => {
    try {
      if (showRefreshMessage) setRefreshing(true);
      
      const response = await leadService.getAllLeads();
      
      if (response.success) {
        setLeads(response.data || []);
        if (showRefreshMessage) {
          setSnackbar({
            open: true,
            message: `Successfully refreshed ${response.count} leads`,
            severity: 'success'
          });
        }
      } else {
        throw new Error(response.message || 'Failed to fetch leads');
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      setError(error.message || 'Failed to fetch leads. Please try again.');
      setSnackbar({
        open: true,
        message: error.message || 'Failed to fetch leads',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      if (showRefreshMessage) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleEditLead = (lead) => {
    navigate(`/leads/edit/${lead._id}`);
  };

  const handleDeleteLead = async (leadId) => {
    try {
      const response = await leadService.deleteLead(leadId);
      
      if (response.success) {
        setLeads(prevLeads => prevLeads.filter(lead => lead._id !== leadId));
        setSnackbar({
          open: true,
          message: 'Lead deleted successfully',
          severity: 'success'
        });
      } else {
        throw new Error(response.message || 'Failed to delete lead');
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete lead',
        severity: 'error'
      });
    }
  };

  const handleRefresh = () => {
    fetchLeads(true);
  };

  const getStatusCounts = () => {
    const counts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        pt: 2,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={3}
            >
              <Box>
                <Typography 
                  variant="h2" 
                  gutterBottom
                  sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                  }}
                >
                  Lead Management
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {user?.role === 'SUPER ADMIN' 
                    ? 'Manage all leads across the platform' 
                    : 'Manage your created leads'
                  }
                </Typography>
                
                {/* Status Overview */}
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <Chip
                      key={status}
                      label={`${status}: ${count}`}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: 
                          status === 'Approved' ? 'success.main' :
                          status === 'Rejected' ? 'error.main' :
                          status === 'Follow-up' ? 'warning.main' :
                          'primary.main',
                        color:
                          status === 'Approved' ? 'success.main' :
                          status === 'Rejected' ? 'error.main' :
                          status === 'Follow-up' ? 'warning.main' :
                          'primary.main',
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" spacing={2}>
                <AppButton
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleRefresh}
                  disabled={refreshing}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(103, 126, 234, 0.1)',
                    },
                  }}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </AppButton>
                
                <AppButton
                  variant="primary"
                  startIcon={<Add />}
                  onClick={() => navigate('/leads/add')}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    boxShadow: '0 8px 32px rgba(103, 126, 234, 0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(103, 126, 234, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Add New Lead
                </AppButton>
              </Stack>
            </Stack>
          </Paper>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div variants={itemVariants}>
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {error}
            </Alert>
          </motion.div>
        )}

        {/* Lead Table */}
        <motion.div variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
            }}
          >
            <EnhancedLeadTable
              leads={leads}
              loading={loading}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
              userRole={user?.role}
            />
          </Paper>
        </motion.div>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageLeadsPage;