// src/pages/LeadPage.js
import React, { useState } from 'react';
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
} from '@mui/material';
import { Add, Link as LinkIcon } from '@mui/icons-material';
import LeadStepper from '../components/leads/LeadStepper';
import LeadListTable from '../components/leads/LeadListTable';
import LeadDetailsModal from '../components/leads/LeadDetailsModal';
import { useCreateLeadMutation, useGetAllLeadsQuery, useDeleteLeadMutation } from '../store/api/leadApi';
import { useAuth } from '../contexts/AuthContext';

const LeadPage = () => {
  const [open, setOpen] = useState(false);
  const [viewLead, setViewLead] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  const { data: leadsData, error, isLoading, refetch } = useGetAllLeadsQuery();
  const [deleteLead] = useDeleteLeadMutation();
  const { user } = useAuth();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleViewClose = () => setViewLead(null);

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

  const handleEditLead = (lead) => {
    // Placeholder for edit functionality
    console.log('Editing lead:', lead);
    alert(`Editing lead: ${lead.customerName}`);
  };

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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Lead Management</Typography>
        <Box>
          <Button variant="outlined" startIcon={<LinkIcon />} onClick={handleCopyLink} sx={{ mr: 2 }}>Share Link</Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>Add Lead</Button>
        </Box>
      </Box>

      <LeadListTable
        leads={leadsData?.data}
        isLoading={isLoading}
        error={error}
        onView={setViewLead}
        onEdit={handleEditLead}
        onDelete={handleDeleteLead}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
        <DialogTitle>Create New Lead</DialogTitle>
        <DialogContent>
          <LeadStepper onLeadCreate={handleCreateLead} isCreating={isCreating} />
        </DialogContent>
      </Dialog>
      
      <LeadDetailsModal open={!!viewLead} onClose={handleViewClose} lead={viewLead} />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeadPage;