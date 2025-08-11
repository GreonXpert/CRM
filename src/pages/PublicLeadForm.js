// src/pages/PublicLeadForm.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Snackbar,
  Alert,
  Avatar,
} from '@mui/material';
import { BusinessCenter } from '@mui/icons-material';
import { useCreateLeadFromLinkMutation } from '../store/api/leadApi';
import LeadStepper from '../components/leads/LeadStepper'; // Import the stepper

const PublicLeadForm = () => {
  const { userId } = useParams();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [createLeadFromLink, { isLoading }] = useCreateLeadFromLinkMutation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLeadSubmit = async (formData) => {
    try {
      await createLeadFromLink({ userId, leadData: formData }).unwrap();
      setSnackbar({ open: true, message: 'Lead submitted successfully! Our team will contact you shortly.', severity: 'success' });
      setIsSubmitted(true);
    } catch (error) {
      setSnackbar({ open: true, message: error.data?.message || 'Failed to submit lead. Please try again.', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isSubmitted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Card sx={{ maxWidth: 500, p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Avatar sx={{ bgcolor: 'success.main', color: 'white', mx: 'auto', mb: 2, width: 56, height: 56 }}>
            <BusinessCenter sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Thank You!</Typography>
          <Typography color="text.secondary">Your details have been submitted successfully. Our team will get in touch with you soon.</Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Card sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 56, height: 56 }}>
                <BusinessCenter sx={{ fontSize: 32 }}/>
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Submit Your Details</Typography>
              <Typography color="text.secondary">Please fill out the form below to proceed.</Typography>
            </Box>
            {/* Use the LeadStepper component for the form */}
            <LeadStepper onLeadCreate={handleLeadSubmit} isCreating={isLoading} />
          </CardContent>
        </Card>
      </Container>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PublicLeadForm;
