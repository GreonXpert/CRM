// /src/pages/leads/AddLeadPage.js
import React, { useState } from 'react';
import { Container, Typography, Box, Alert, Collapse } from '@mui/material';
import { keyframes } from '@mui/system';
import { motion } from 'framer-motion';

// Import Custom Components
import LeadStepperForm from '../../components/common/LeadStepperForm';

// A placeholder for your lead service
const leadService = {
  createLead: async (data) => {
    console.log('Creating lead with data:', data);
    // Simulate an API call that might fail sometimes
    if (data.customerName.toLowerCase() === 'fail') {
        return Promise.reject({ message: 'Failed to create lead. Please try again.' });
    }
    return new Promise(resolve => setTimeout(() => resolve({ success: true, leadId: 'L12345' }), 1500));
  },
};

// --- Animated Gradient Background ---
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AddLeadPage = () => {
  const [submissionStatus, setSubmissionStatus] = useState({ state: 'idle', message: '' }); // idle, success, error

  const handleFormSubmit = async (data) => {
    setSubmissionStatus({ state: 'loading', message: '' });
    try {
      const response = await leadService.createLead(data);
      if (response.success) {
        setSubmissionStatus({ state: 'success', message: `Lead created successfully! (ID: ${response.leadId})` });
        // Optionally, you can reset the form or redirect the user after a delay
      }
    } catch (error) {
      setSubmissionStatus({ state: 'error', message: error.message || 'An unknown error occurred.' });
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: 'calc(100vh - 128px)', // Adjust based on Navbar/Footer height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        py: 5,
      }}
    >
      {/* Futuristic Animated Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: `linear-gradient(-45deg, #F4F6F8, #E3F2FD, #F4F6F8, #BBDEFB)`,
          backgroundSize: '400% 400%',
          animation: `${gradientAnimation} 15s ease infinite`,
        }}
      />

      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Create New Lead
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 5 }}>
            Guide your new client through our streamlined process in just a few steps.
          </Typography>

          <LeadStepperForm onSubmit={handleFormSubmit} />

          <Collapse in={submissionStatus.state === 'success' || submissionStatus.state === 'error'}>
            <Alert
              severity={submissionStatus.state}
              sx={{ mt: 3, borderRadius: 2 }}
              onClose={() => setSubmissionStatus({ state: 'idle', message: '' })}
            >
              {submissionStatus.message}
            </Alert>
          </Collapse>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AddLeadPage;
