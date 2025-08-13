// src/pages/LeadPage.js
import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Avatar,
  Grid,
  Chip,
  Fade,
  Slide,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { 
  Add, 
  Link as LinkIcon, 
  People,
  TrendingUp,
  Assessment,
  Timeline,
  Share,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled, keyframes, alpha, lighten, darken } from '@mui/material/styles';import LeadStepper from '../components/leads/LeadStepper';
import LeadListTable from '../components/leads/LeadListTable';
import LeadDetailsModal from '../components/leads/LeadDetailsModal';
import EditLeadModal from '../components/leads/EditLeadModal';
import RejectionReasonModal from '../components/leads/RejectionReasonModal';
import { useCreateLeadMutation, useGetAllLeadsQuery, useDeleteLeadMutation, useUpdateLeadMutation } from '../store/api/leadApi';
import { useAuth } from '../contexts/AuthContext';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

// Styled Components
const HeaderSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: 24,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: `${float} 6s ease-in-out infinite`,
  },
}));

// Replace the existing StatsCard styled component with this
const StatsCard = styled(Card)(({ theme, color }) => ({
  borderRadius: 20,
  background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
  border: `1px solid ${color}20`,
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px ${color}30`,
    animation: `${glow} 2s ease-in-out infinite`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
  },
}));

// Add this new styled component for the floating icon
const FloatingStatsIcon = styled(Avatar)(({ theme, color }) => ({
  width: 60,
  height: 60,
  animation: `${float} 3s ease-in-out infinite`,
  background: `${color}20`,
  color: color,
  border: `2px solid ${color}30`,
  boxShadow: `0 8px 25px ${color}20`,
}));

// Add the glow animation
const glow = keyframes`
  0%, 100% { box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 8px 40px rgba(99, 102, 241, 0.6); }
`;


const EnhancedDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 24,
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
    boxShadow: '0 20px 60px rgba(99, 102, 241, 0.2)',
    overflow: 'visible',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const FloatingAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  animation: `${float} 4s ease-in-out infinite`,
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
}));

const LeadPage = () => {
  const [open, setOpen] = useState(false);
  const [viewLead, setViewLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [rejectionModal, setRejectionModal] = useState({ open: false, leadId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  const { data: leadsData, error, isLoading, refetch } = useGetAllLeadsQuery();
  const [deleteLead] = useDeleteLeadMutation();
  const [updateLead] = useUpdateLeadMutation();
  const { user } = useAuth();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleViewClose = () => setViewLead(null);
  const handleEditClose = (isSuccess) => {
    setEditLead(null);
    if (isSuccess) {
      setSnackbar({ open: true, message: 'Lead updated successfully!', severity: 'success' });
      refetch();
    }
  };

  const handleCreateLead = async (leadData) => {
    try {
      await createLead(leadData).unwrap();
      setSnackbar({ open: true, message: 'Lead created successfully!', severity: 'success' });
      handleClose();
      refetch();
    } catch (error) {
      setSnackbar({ open: true, message: error.data?.message || 'Failed to create lead.', severity: 'error' });
    }
  };

  const handleCopyLink = () => {
    if (user && user.id) {
      const link = `${window.location.origin}/create-lead/${user.id}`;
      navigator.clipboard.writeText(link);
      setSnackbar({ open: true, message: 'Link copied to clipboard!', severity: 'info' });
    } else {
      setSnackbar({ open: true, message: 'Could not generate link. User not found.', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const handleEditLead = (lead) => setEditLead(lead);

  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(leadId).unwrap();
        setSnackbar({ open: true, message: 'Lead deleted successfully!', severity: 'success' });
        refetch();
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to delete lead.', severity: 'error' });
      }
    }
  };

  const handleStatusChange = async (leadId, status) => {
    if (status === 'Rejected') {
      setRejectionModal({ open: true, leadId });
    } else {
      try {
        await updateLead({ id: leadId, status, rejectionReason: '', rejectionNotes: '' }).unwrap();
        setSnackbar({ open: true, message: 'Lead status updated successfully!', severity: 'success' });
        refetch();
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to update lead status.', severity: 'error' });
      }
    }
  };

  const handleRejectionSubmit = async ({ reason, notes }) => {
    const { leadId } = rejectionModal;
    try {
      await updateLead({ id: leadId, status: 'Rejected', rejectionReason: reason, rejectionNotes: notes }).unwrap();
      setSnackbar({ open: true, message: 'Lead has been marked as rejected.', severity: 'success' });
      refetch();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update lead status.', severity: 'error' });
    } finally {
      setRejectionModal({ open: false, leadId: null });
    }
  };

  const leads = leadsData?.data || [];
  
const statsData = React.useMemo(() => {
  return [
    {
      title: 'Total Leads',
      value: leads.length,
      description: 'All leads in the system',
      icon: People,
      color: theme.palette.primary.main,
    },
    {
      title: 'New Leads',
      value: leads.filter(l => l.status === 'New').length,
      description: 'Awaiting review',
      icon: Timeline,
      color: theme.palette.info.main,
    },
    {
      title: 'Approved',
      value: leads.filter(l => l.status === 'Approved').length,
      description: 'Successfully converted',
      icon: TrendingUp,
      color: theme.palette.success.main,
    },
    {
      title: 'Follow-up',
      value: leads.filter(l => l.status === 'Follow-up').length,
      description: 'Requires attention',
      icon: Assessment,
      color: theme.palette.warning.main,
    },
  ];
}, [leads, theme]);


  return (
    <Box>
      {/* Enhanced Header */}
      <Fade in={true} timeout={800}>
        <HeaderSection>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                  <FloatingAvatar>
                    <People sx={{ fontSize: 40 }} />
                  </FloatingAvatar>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      Lead Management 📊
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                      Track and manage your potential customers effectively
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<Assessment />}
                    label="Lead Dashboard"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                  <Chip
                    icon={<People />}
                    label={`${leads.length} Total Leads`}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Tooltip title="Share Lead Creation Link">
                    <ActionButton
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={handleCopyLink}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          borderColor: 'white',
                          background: 'rgba(255, 255, 255, 0.2)',
                        },
                      }}
                    >
                      Share Link
                    </ActionButton>
                  </Tooltip>
                  <ActionButton
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpen}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    Add Lead
                  </ActionButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </HeaderSection>
      </Fade>

      {/* Enhanced Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
  {statsData.map((stat, index) => {
    const Icon = stat.icon;
    return (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <Fade in timeout={300 + index * 100}>
          <StatsCard color={stat.color}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FloatingStatsIcon color={stat.color}>
                  <Icon />
                </FloatingStatsIcon>
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Typography 
                    variant="h4" 
                    fontWeight="bold" 
                    color={stat.color}
                    sx={{ mb: 0.5 }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} sx={{ color: stat.color }} />
                    ) : (
                      stat.value
                    )}
                  </Typography>
                </Box>
              </Box>
              <Typography 
                variant="h6" 
                fontWeight="600" 
                sx={{ mb: 1, color: 'text.primary' }}
              >
                {stat.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ opacity: 0.8 }}
              >
                {stat.description}
              </Typography>
            </CardContent>
          </StatsCard>
        </Fade>
      </Grid>
    );
  })}
</Grid>
      {/* Enhanced Lead List Table */}
     <Fade in={true} timeout={1200}>
  <Box>
    <LeadListTable
      leads={leads}
      isLoading={isLoading}
      error={error}
      onView={setViewLead}
      onEdit={handleEditLead}
      onDelete={handleDeleteLead}
      onStatusChange={handleStatusChange}
    />
  </Box>
</Fade>


      {/* Enhanced Create Lead Dialog */}
      <EnhancedDialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="md" 
        fullScreen={fullScreen}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
              <Add />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Create New Lead
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <LeadStepper onLeadCreate={handleCreateLead} isCreating={isCreating} />
        </DialogContent>
      </EnhancedDialog>
      
      <LeadDetailsModal open={!!viewLead} onClose={handleViewClose} lead={viewLead} />
      <EditLeadModal open={!!editLead} onClose={handleEditClose} lead={editLead} />
      <RejectionReasonModal
        open={rejectionModal.open}
        onClose={() => setRejectionModal({ open: false, leadId: null })}
        onSubmit={handleRejectionSubmit}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeadPage;
