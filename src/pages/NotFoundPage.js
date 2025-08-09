// /src/pages/NotFoundPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Import Custom Components
import AppButton from '../components/common/AppButton';
import { Home } from '@mui/icons-material';

// --- Keyframes for Glitch Animation ---
const glitchAnimation = keyframes`
  2%, 64% {
    transform: translate(2px, -2px);
  }
  4%, 60% {
    transform: translate(-2px, 2px);
  }
  62% {
    transform: translate(13px, -1px) skew(-13deg);
  }
`;

const glitchAnimationBefore = keyframes`
  0%, 17%, 34%, 51%, 68%, 85%, 100% {
    clip-path: inset(0 0 98% 0);
  }
  8.5% {
    clip-path: inset(45% 0 45% 0);
  }
  25.5% {
    clip-path: inset(10% 0 80% 0);
  }
  42.5% {
    clip-path: inset(90% 0 2% 0);
  }
  59.5% {
    clip-path: inset(60% 0 30% 0);
  }
  76.5% {
    clip-path: inset(20% 0 75% 0);
  }
`;

const glitchAnimationAfter = keyframes`
  0%, 17%, 34%, 51%, 68%, 85%, 100% {
    clip-path: inset(98% 0 0 0);
  }
  8.5% {
    clip-path: inset(55% 0 35% 0);
  }
  25.5% {
    clip-path: inset(85% 0 5% 0);
  }
  42.5% {
    clip-path: inset(5% 0 90% 0);
  }
  59.5% {
    clip-path: inset(70% 0 20% 0);
  }
  76.5% {
    clip-path: inset(80% 0 15% 0);
  }
`;


const GlitchText = styled(Typography)(({ theme }) => ({
  position: 'relative',
  fontSize: '10rem',
  fontWeight: 900,
  color: theme.palette.primary.main,
  animation: `${glitchAnimation} 1s infinite linear alternate-reverse`,
  '&::before, &::after': {
    content: '"404"',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: theme.palette.background.default,
  },
  '&::before': {
    animation: `${glitchAnimationBefore} 2s infinite linear alternate-reverse`,
    left: '2px',
    textShadow: `-2px 0 ${theme.palette.secondary.main}`,
  },
  '&::after': {
    animation: `${glitchAnimationAfter} 2s infinite linear alternate-reverse`,
    left: '-2px',
    textShadow: `-2px 0 ${theme.palette.error.main}, 2px 2px ${theme.palette.primary.light}`,
  },
}));


const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        background: (theme) => `radial-gradient(circle, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <GlitchText>404</GlitchText>
          <Typography variant="h2" sx={{ mt: 2, fontWeight: 700 }}>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4, maxWidth: '400px', mx: 'auto' }}>
            Oops! The page you're looking for seems to have gotten lost in the digital space. Let's get you back on track.
          </Typography>
          <AppButton
            variant="primary"
            size="large"
            startIcon={<Home />}
            onClick={() => navigate('/dashboard')} // Navigate to dashboard for logged-in users
          >
            Go to Dashboard
          </AppButton>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
