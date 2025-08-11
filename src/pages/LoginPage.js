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
  Paper,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  BusinessCenter,
  Security,
} from '@mui/icons-material';
import { useLoginMutation } from '../store/api/authApi';
import { setCredentials, setError, clearError } from '../store/slices/authSlice';
import { useAuth } from '../contexts/AuthContext';

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
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
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
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, color: 'white' }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    background: 'linear-gradient(45deg, #ffffff, #f0f9ff)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  EBS Cards
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    opacity: 0.9,
                    fontWeight: 300,
                  }}
                >
                  Advanced CRM Platform
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Paper
                      sx={{
                        p: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                      }}
                    >
                      <BusinessCenter sx={{ color: 'white' }} />
                    </Paper>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      Streamlined Lead Management
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Paper
                      sx={{
                        p: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                      }}
                    >
                      <Security sx={{ color: 'white' }} />
                    </Paper>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      Enterprise-Grade Security
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1200}>
              <Card
                sx={{
                  maxWidth: 450,
                  mx: 'auto',
                  backdropFilter: 'blur(20px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 1,
                      }}
                    >
                      Welcome Back
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      Sign in to access your CRM dashboard
                    </Typography>
                  </Box>

                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ mb: 3, borderRadius: 2 }}
                      onClose={() => dispatch(clearError())}
                    >
                      {error}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
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
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />

                    <TextField
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
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 3 }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5b21b6, #7c3aed)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </Box>

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Need access? Contact your system administrator
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;