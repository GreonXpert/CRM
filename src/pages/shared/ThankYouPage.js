// /src/pages/shared/ThankYouPage.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Button,
  Stack,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Home, 
  Business,
  Email,
  Phone
} from '@mui/icons-material';
import { keyframes, alpha } from '@mui/system';

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
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const iconVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: 'easeOut',
      delay: 0.3
    }
  }
};

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get message from navigation state
  const message = location.state?.message || 'Thank you for your submission!';

  // Redirect to home after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      window.close(); // Try to close the window if opened in new tab
      // If window doesn't close, redirect to a generic page
      setTimeout(() => {
        window.location.href = 'https://greonxpert.com'; // Replace with your company website
      }, 1000);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    // Try to close the window first
    if (window.opener) {
      window.close();
    } else {
      // If not opened as popup, redirect to company website
      window.location.href = 'https://greonxpert.com'; // Replace with your company website
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        py: 4,
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
          background: `linear-gradient(-45deg, #E8F5E8, #E3F2FD, #F3E5F5, #FFF8E1)`,
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
          {/* Main Success Card */}
          <motion.div variants={itemVariants}>
            <Paper 
              elevation={8} 
              sx={{ 
                p: 6, 
                borderRadius: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid',
                borderColor: 'success.light',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.05,
                  backgroundImage: 'radial-gradient(circle at 25px 25px, #4caf50 2px, transparent 0), radial-gradient(circle at 75px 75px, #2196f3 2px, transparent 0)',
                  backgroundSize: '100px 100px',
                  zIndex: 0
                }}
              />

              {/* Content */}
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                {/* Success Icon */}
                <motion.div variants={iconVariants}>
                  <CheckCircle 
                    sx={{ 
                      fontSize: 120, 
                      color: 'success.main',
                      mb: 3,
                      filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))'
                    }} 
                  />
                </motion.div>

                {/* Title */}
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 2
                    }}
                  >
                    Submission Successful!
                  </Typography>
                </motion.div>

                {/* Message */}
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h5" 
                    color="text.secondary" 
                    sx={{ mb: 4, fontWeight: 300 }}
                  >
                    {message}
                  </Typography>
                </motion.div>

                {/* Info Chips */}
                <motion.div variants={itemVariants}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2} 
                    sx={{ mb: 4, justifyContent: 'center' }}
                  >
                    <Chip
                      icon={<CheckCircle />}
                      label="Information Received"
                      variant="outlined"
                      sx={{
                        backgroundColor: alpha('#4caf50', 0.1),
                        borderColor: 'success.main',
                        color: 'success.main',
                        fontWeight: 600,
                        '& .MuiChip-icon': { color: 'success.main' }
                      }}
                    />
                    <Chip
                      icon={<Business />}
                      label="Processing Started"
                      variant="outlined"
                      sx={{
                        backgroundColor: alpha('#2196f3', 0.1),
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        fontWeight: 600,
                        '& .MuiChip-icon': { color: 'primary.main' }
                      }}
                    />
                  </Stack>
                </motion.div>

                {/* Next Steps */}
                <motion.div variants={itemVariants}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      mb: 4,
                      backgroundColor: alpha('#e3f2fd', 0.5),
                      border: '1px solid',
                      borderColor: 'primary.light'
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      What happens next?
                    </Typography>
                    <Stack spacing={1} sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" color="text.secondary">
                        • Our team will review your information within 24 hours
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • You will receive a confirmation email shortly
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • A representative will contact you to discuss next steps
                      </Typography>
                    </Stack>
                  </Paper>
                </motion.div>

                {/* Action Button */}
                <motion.div variants={itemVariants}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Home />}
                    onClick={handleGoHome}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Close Window
                  </Button>
                </motion.div>
              </Box>
            </Paper>
          </motion.div>

          {/* Company Information */}
          <motion.div variants={itemVariants}>
            <Paper 
              elevation={2} 
              sx={{ 
                mt: 4, 
                p: 3, 
                borderRadius: 3,
                backgroundColor: alpha('#f5f5f5', 0.8),
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                GreonXpert
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Innovating Sustainable Solutions
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mt: 2, justifyContent: 'center' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    contact@greonxpert.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    +91 XXX XXX XXXX
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </motion.div>

          {/* Auto-close Notice */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                This window will automatically close in 10 seconds
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ThankYouPage;