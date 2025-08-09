// /src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Import Custom Components & Icons
import AppButton from '../components/common/AppButton';
import { ArrowForward, AccountBalance, TrackChanges, MonetizationOn } from '@mui/icons-material';

// --- Keyframes for Animated Gradient Text ---
const textGradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AnimatedGradientText = styled(motion.span)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.light})`,
  backgroundSize: '200% 200%',
  animation: `${textGradientAnimation} 5s ease infinite`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AccountBalance sx={{ fontSize: 40 }} />,
      title: 'Multiple Banks, One Platform',
      description: 'Access credit card offers from top banks like HDFC, AXIS, and SBI all in one place.',
    },
    {
      icon: <TrackChanges sx={{ fontSize: 40 }} />,
      title: 'Real-Time Lead Tracking',
      description: 'Monitor the status of every lead you generate, from submission to approval, in real-time.',
    },
    {
      icon: <MonetizationOn sx={{ fontSize: 40 }} />,
      title: 'Instant Payouts',
      description: 'Receive your commissions quickly and efficiently as soon as your referred cards are approved.',
    },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: (theme) => `radial-gradient(circle, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <motion.div variants={itemVariants}>
            <Typography variant="h1" sx={{ fontWeight: 800, mb: 2 }}>
              Unlock Your Earning Potential with <AnimatedGradientText>EBS Cards</AnimatedGradientText>
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
              The ultimate CRM platform for DSAs, freelancers, and partners to generate and manage credit card leads effortlessly.
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <AppButton
              variant="primary"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/register')}
            >
              Get Started Now
            </AppButton>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" sx={{ fontWeight: 700, mb: 6 }}>
            Why Choose EBS Cards?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 4,
                      height: '100%',
                    }}
                  >
                    <Box color="primary.main" mb={2}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </motion.div>
  );
};

export default HomePage;
