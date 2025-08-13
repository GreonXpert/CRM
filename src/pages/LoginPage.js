// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Container,
  Grid,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  BusinessCenter,
  Security,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useLoginMutation } from '../store/api/authApi';
import { setCredentials, setError, clearError } from '../store/slices/authSlice';
import { useAuth } from '../contexts/AuthContext';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
`;

const slideInLeft = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(-50px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
`;

const slideInRight = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(50px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
`;

// Styled Components
const FuturisticContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `
    linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 25%, 
    ${theme.palette.primary.dark}08 50%, ${theme.palette.secondary.dark}12 75%, ${theme.palette.primary.main}10 100%),
    radial-gradient(ellipse at top left, ${theme.palette.primary.main}08 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, ${theme.palette.secondary.main}08 0%, transparent 50%)
  `,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  },
}));

const FloatingElement = styled(Box)(({ delay = 0 }) => ({
  position: 'absolute',
  animation: `${float} ${4 + delay}s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  opacity: 0.1,
  pointerEvents: 'none',
}));

const GlassMorphismCard = styled(Card)(({ theme }) => ({
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: 24,
  boxShadow: `
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset
  `,
  position: 'relative',
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    borderRadius: '24px 24px 0 0',
  },
}));

const BrandingSection = styled(Box)(({ theme }) => ({
  animation: `${slideInLeft} 1s ease-out`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
    animation: `${pulse} 4s ease-in-out infinite`,
  },
}));

const LoginFormSection = styled(Box)({
  animation: `${slideInRight} 1s ease-out`,
});

const FuturisticTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(99, 102, 241, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(99, 102, 241, 0.2)',
      animation: `${glow} 2s ease-in-out infinite`,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

const FuturisticButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(2, 4),
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
  border: 'none',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover': {
    transform: 'translateY(-3px) scale(1.02)',
    boxShadow: '0 15px 40px rgba(99, 102, 241, 0.6)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(-1px) scale(0.98)',
  },
}));

const FloatingIcon = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 12px 35px rgba(99, 102, 241, 0.2)',
  animation: `${float} 3s ease-in-out infinite`,
  marginBottom: theme.spacing(3),
}));

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, error } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      dispatch(setError('Please fill in all fields'));
      return;
    }

    try {
      const result = await login(formData).unwrap();
      dispatch(setCredentials(result));
      navigate(from, { replace: true });
    } catch (err) {
      dispatch(setError(err?.data?.message || 'Login failed. Please try again.'));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FuturisticContainer>
      {/* Floating Background Elements */}
      <FloatingElement delay={0} sx={{ top: '10%', left: '5%' }}>
        <BusinessCenter sx={{ fontSize: 100, color: 'primary.main' }} />
      </FloatingElement>
      <FloatingElement delay={2} sx={{ top: '70%', right: '10%' }}>
        <Security sx={{ fontSize: 120, color: 'secondary.main' }} />
      </FloatingElement>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center" sx={{ minHeight: '100vh', py: 4 }}>
          {/* Left Side - Simple Branding */}
          <Grid item xs={12} lg={7}>
            <BrandingSection sx={{ textAlign: { xs: 'center', lg: 'left' }, color: 'white', pr: { lg: 4 } }}>
              <FloatingIcon sx={{ mx: { xs: 'auto', lg: 0 } }}>
                <BusinessCenter sx={{ fontSize: 40, color: 'primary.main' }} />
              </FloatingIcon>

              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  mb: 3,
                  fontSize: { xs: '3rem', sm: '4rem', lg: '5rem' },
                  background: 'linear-gradient(135deg, #ffffff 0%, #6366f1 50%, #8b5cf6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                }}
              >
                EBS Cards
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 300,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                Next-Generation CRM Platform
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.8,
                  maxWidth: 600,
                  lineHeight: 1.6,
                }}
              >
                Experience the future of customer relationship management with AI-powered 
                insights, real-time analytics, and seamless lead management.
              </Typography>
            </BrandingSection>
          </Grid>

          {/* Right Side - Login Form Only */}
          <Grid item xs={12} lg={5}>
            <LoginFormSection>
              <GlassMorphismCard sx={{ maxWidth: 500, mx: 'auto' }}>
                {isLoading && (
                  <LinearProgress
                    sx={{
                      position: 'absolute',
                      top: 4,
                      left: 0,
                      right: 0,
                      borderRadius: '24px 24px 0 0',
                      height: 3,
                    }}
                  />
                )}

                <CardContent sx={{ p: 5 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 3,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                      }}
                    >
                      <Security sx={{ fontSize: 32 }} />
                    </Avatar>
                    
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: 'text.primary',
                        mb: 1,
                        background: 'linear-gradient(135deg, #1e293b 0%, #6366f1 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Welcome Back
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                      }}
                    >
                      Sign in to access your CRM dashboard
                    </Typography>
                  </Box>

                  {error && (
                    <Fade in timeout={300}>
                      <Alert 
                        severity="error" 
                        sx={{ 
                          mb: 3, 
                          borderRadius: 3,
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                        }}
                        onClose={() => dispatch(clearError())}
                      >
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <FuturisticTextField
                      fullWidth
                      name="email"
                      type="email"
                      label="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      margin="normal"
                      required
                      autoComplete="email"
                      autoFocus
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 3 }}
                      placeholder="Enter your email address"
                    />

                    <FuturisticTextField
                      fullWidth
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      value={formData.password}
                      onChange={handleChange}
                      margin="normal"
                      required
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                              size="small"
                              sx={{
                                color: 'primary.main',
                                '&:hover': {
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                },
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 4 }}
                      placeholder="Enter your password"
                    />

                    <FuturisticButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading}
                      size="large"
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </FuturisticButton>
                  </Box>

                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Need access? Contact your system administrator
                    </Typography>
                  </Box>
                </CardContent>
              </GlassMorphismCard>
            </LoginFormSection>
          </Grid>
        </Grid>
      </Container>
    </FuturisticContainer>
  );
};

export default LoginPage;
