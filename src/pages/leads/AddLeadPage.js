// /src/pages/leads/AddLeadPage.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Alert, 
  Collapse, 
  Paper,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  keyframes, 
  alpha 
} from '@mui/system';
import { motion } from 'framer-motion';
import { 
  Share, 
  ContentCopy, 
  Person, 
  Link as LinkIcon,
  CheckCircle,
  Send
} from '@mui/icons-material';

// Import Custom Components
import LeadStepperForm from '../../components/common/LeadStepperForm';

// Import Hooks
import { useLeads, useNotifications } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';

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
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

const AddLeadPage = () => {
  // State
  const [submissionStatus, setSubmissionStatus] = useState({ 
    state: 'idle', 
    message: '', 
    leadId: null 
  });
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Hooks
  const { user } = useAuth();
  const { 
    createLead, 
    leadLoading, 
    leadError, 
    generateShareLink, 
    copyShareLink, 
    getShareLink 
  } = useLeads();
  const { addNotification } = useNotifications();

  // Check if user can create leads
  const canCreateLeads = user && ['SUPER ADMIN', 'ADMIN'].includes(user.role);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    setSubmissionStatus({ state: 'loading', message: '', leadId: null });
    
    try {
      const response = await createLead(data);
      
      if (response) {
        setSubmissionStatus({ 
          state: 'success', 
          message: `Lead created successfully! (ID: ${response._id || 'Generated'})`,
          leadId: response._id
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmissionStatus({ state: 'idle', message: '', leadId: null });
        }, 5000);
      }
    } catch (error) {
      console.error('Lead creation error:', error);
      setSubmissionStatus({ 
        state: 'error', 
        message: error.message || 'Failed to create lead. Please try again.',
        leadId: null 
      });
    }
  };

  // Handle share link generation
  const handleGenerateShareLink = async () => {
    if (!selectedUserId.trim()) {
      addNotification('error', 'Please enter a User ID');
      return;
    }

    try {
      const shareLink = await copyShareLink(selectedUserId.trim());
      setShareDialogOpen(false);
      setSelectedUserId('');
      // Notification is already handled in copyShareLink
    } catch (error) {
      console.error('Share link generation error:', error);
    }
  };

  // Handle dialog close
  const handleShareDialogClose = () => {
    setShareDialogOpen(false);
    setSelectedUserId('');
  };

  // Show access denied if user doesn't have permission
  if (!canCreateLeads) {
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
          <Typography variant="h4" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You don't have permission to create leads. Only Admins and Super Admins can access this page.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: 'calc(100vh - 128px)',
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants}>
            <Stack 
              direction="row" 
              alignItems="center" 
              justifyContent="space-between" 
              sx={{ mb: 4 }}
            >
              <Box>
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
                  Create New Lead
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Guide your new client through our streamlined process in just a few steps.
                </Typography>
              </Box>
              
              {/* Share Link Button */}
              <Tooltip title="Generate share link for client to fill lead data">
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={() => setShareDialogOpen(true)}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    }
                  }}
                >
                  Share Link
                </Button>
              </Tooltip>
            </Stack>
          </motion.div>

          {/* User Info Chip */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Chip
                icon={<Person />}
                label={`Logged in as: ${user?.name || user?.email} (${user?.role})`}
                variant="outlined"
                sx={{
                  backgroundColor: alpha('#1976d2', 0.1),
                  borderColor: 'primary.main',
                  '& .MuiChip-icon': {
                    color: 'primary.main'
                  }
                }}
              />
            </Box>
          </motion.div>

          {/* Lead Form */}
          <motion.div variants={itemVariants}>
            <LeadStepperForm 
              onSubmit={handleFormSubmit}
              isSharedForm={false}
            />
          </motion.div>

          {/* Submission Status */}
          <motion.div variants={itemVariants}>
            <Collapse in={submissionStatus.state === 'success' || submissionStatus.state === 'error'}>
              <Alert
                severity={submissionStatus.state}
                sx={{ 
                  mt: 3, 
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
                onClose={() => setSubmissionStatus({ state: 'idle', message: '', leadId: null })}
                action={
                  submissionStatus.state === 'success' && submissionStatus.leadId && (
                    <Button
                      color="inherit"
                      size="small"
                      startIcon={<Share />}
                      onClick={() => {
                        setSelectedUserId(submissionStatus.leadId);
                        setShareDialogOpen(true);
                      }}
                    >
                      Share
                    </Button>
                  )
                }
              >
                {submissionStatus.message}
              </Alert>
            </Collapse>
          </motion.div>

          {/* Loading Indicator */}
          {leadLoading && (
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Creating lead...
                </Alert>
              </Box>
            </motion.div>
          )}

          {/* Global Error Display */}
          {leadError && (
            <motion.div variants={itemVariants}>
              <Box sx={{ mt: 3 }}>
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {leadError}
                </Alert>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>

      {/* Share Link Dialog */}
      <Dialog 
        open={shareDialogOpen} 
        onClose={handleShareDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LinkIcon color="primary" />
            <Typography variant="h6" component="div">
              Generate Share Link
            </Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter a User ID to generate a shareable link that allows the client to fill their lead data directly.
          </Typography>
          
          <TextField
            fullWidth
            label="User ID"
            placeholder="Enter user ID (e.g., user123, client456)"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
          />

          {selectedUserId.trim() && (
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                backgroundColor: alpha('#e3f2fd', 0.5),
                border: '1px solid',
                borderColor: 'primary.light'
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Generated Link Preview:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  color: 'primary.main'
                }}
              >
                {getShareLink(selectedUserId.trim())}
              </Typography>
            </Paper>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleShareDialogClose}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerateShareLink}
            variant="contained"
            disabled={!selectedUserId.trim()}
            startIcon={<ContentCopy />}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3
            }}
          >
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddLeadPage;