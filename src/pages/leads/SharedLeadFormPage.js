// /src/pages/leads/SharedLeadFormPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Alert,
  Backdrop,
  CircularProgress,
  Stack,
  Chip
} from '@mui/material';
import { keyframes, alpha } from '@mui/system';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ErrorOutline, 
  Person,
  Business,
  Security 
} from '@mui/icons-material';

// Import Custom Components
import LeadStepperForm from '../../components/common/LeadStepperForm';

// Import Services
import { createLeadFromLink } from '../../api/leadService';

// --- Animated Gradient Background ---
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

const SharedLeadFormPage = () => {
  // Get userId from URL params
  const { userId } = useParams();
  const navigate = useNavigate();

  // State
  const [submissionStatus, setSubmissionStatus] = useState({ 
    state: 'idle', 
    message: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidLink, setIsValidLink] = useState(false);

  // Validate the link on component mount
  useEffect(() => {
    const validateLink = async () => {
      try {
        // Basic validation - check if userId exists and is valid format
        if (!userId || userId.trim().length < 3) {
          setIsValidLink(false);
          setSubmissionStatus({
            state: 'error',
            message: 'Invalid share link. Please contact the administrator.'
          });
        } else {
          setIsValidLink(true);
        }
      } catch (error) {
        console.error('Link validation error:', error);
        setIsValidLink(false);
        setSubmissionStatus({
          state: 'error',
          message: 'Unable to validate share link. Please try again later.'
        });
      } finally {
        setIsValidating(false);
      }
    };

    validateLink();
  }, [userId]);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmissionStatus({ state: 'loading', message: '' });
    
    try {
      const response = await createLeadFromLink(userId, data);
      
      if (response.success) {
        setSubmissionStatus({ 
          state: 'success', 
          message: 'Thank you! Your information has been submitted successfully. We will contact you soon.' 
        });
        
        // Redirect to a thank you page after 3 seconds
        setTimeout(() => {
          navigate('/thank-you', { 
            state: { 
              message: 'Your lead information has been submitted successfully!' 
            } 
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Lead submission error:', error);
      
      let errorMessage = 'Failed to submit your information. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmissionStatus({ 
        state: 'error', 
        message: errorMessage 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while validating
  if (isValidating) {
    return (
      <Backdrop open sx={{ zIndex: 9999 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
            Validating share link...
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  // Invalid link state
  if (!isValidLink) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            backgroundColor: alpha('#f44336', 0.1),
            border: '1px solid',
            borderColor: 'error.light'
          }}
        >
          <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" color="error" gutterBottom>
            Invalid Share Link
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {submissionStatus.message || 'This share link is invalid or has expired. Please contact the administrator for a new link.'}
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Success state - show completion message
  if (submissionStatus.state === 'success') {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            backgroundColor: alpha('#4caf50', 0.1),
            border: '1px solid',
            borderColor: 'success.light'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
          </motion.div>
          
          <Typography variant="h3" color="success.main" gutterBottom sx={{ fontWeight: 700 }}>
            Submission Successful!
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {submissionStatus.message}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Redirecting to confirmation page...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
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
          background: `linear-gradient(-45deg, #E8F5E8, #E3F2FD, #F3E5F5, #FFF3E0)`,
          backgroundSize: '400% 400%',
          animation: `${gradientAnimation} 20s ease infinite`,
        }}
      />

      <Container maxWidth="md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                mb: 4, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
                GreonXpert
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 300 }}>
                Complete Your Lead Information
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Please fill out the form below with your details. All information is secure and confidential.
              </Typography>
            </Paper>
          </motion.div>

          {/* Security & Trust Indicators */}
          <motion.div variants={itemVariants}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ mb: 4, justifyContent: 'center' }}
            >
              <Chip
                icon={<Security />}
                label="Secure & Encrypted"
                variant="outlined"
                sx={{
                  backgroundColor: alpha('#4caf50', 0.1),
                  borderColor: 'success.main',
                  color: 'success.main',
                  '& .MuiChip-icon': { color: 'success.main' }
                }}
              />
              <Chip
                icon={<Business />}
                label="Confidential Process"
                variant="outlined"
                sx={{
                  backgroundColor: alpha('#2196f3', 0.1),
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '& .MuiChip-icon': { color: 'primary.main' }
                }}
              />
              <Chip
                icon={<Person />}
                label={`User ID: ${userId}`}
                variant="outlined"
                sx={{
                  backgroundColor: alpha('#ff9800', 0.1),
                  borderColor: 'warning.main',
                  color: 'warning.main',
                  '& .MuiChip-icon': { color: 'warning.main' }
                }}
              />
            </Stack>
          </motion.div>

          {/* Lead Form */}
          <motion.div variants={itemVariants}>
            <LeadStepperForm 
              onSubmit={handleFormSubmit}
              isSharedForm={true}
              userId={userId}
            />
          </motion.div>

          {/* Error Display */}
          {submissionStatus.state === 'error' && (
            <motion.div variants={itemVariants}>
              <Alert
                severity="error"
                sx={{ 
                  mt: 3, 
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
                onClose={() => setSubmissionStatus({ state: 'idle', message: '' })}
              >
                {submissionStatus.message}
              </Alert>
            </motion.div>
          )}

          {/* Footer Information */}
          <motion.div variants={itemVariants}>
            <Paper 
              elevation={1} 
              sx={{ 
                mt: 4, 
                p: 3, 
                borderRadius: 2,
                backgroundColor: alpha('#f5f5f5', 0.8),
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                By submitting this form, you agree to our privacy policy and terms of service.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Your data is processed securely and will only be used for the purposes of this lead inquiry.
              </Typography>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>

      {/* Submission Loading Backdrop */}
      <Backdrop
        open={isSubmitting}
        sx={{ 
          zIndex: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
            Submitting your information...
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
};

export default SharedLeadFormPage;