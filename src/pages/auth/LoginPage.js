// /src/pages/auth/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Paper, Typography, Box, Stack, Alert, Grid, Link } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';

// Import custom components
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';

// A simple SVG illustration for the side panel
const LoginIllustration = () => (
  <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#63A4FF', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#1976D2', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <motion.rect
      x="0" y="0" width="800" height="600" fill="url(#grad1)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    />
    <motion.circle cx="400" cy="300" r="150" fill="#FFFFFF"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
    />
    <motion.path d="M350 300 L400 350 L500 250" stroke="#1976D2" strokeWidth="15" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.7 }}
    />
    <Typography component="text" x="400" y="500" fontFamily="Inter" fontSize="32" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">
      Welcome Back
    </Typography>
  </svg>
);


// A placeholder for your auth service
const authService = {
  login: async (data) => {
    console.log('Logging in with:', data);
    if (data.email === 'fail@test.com') {
        return Promise.reject({ message: 'Invalid credentials provided.' });
    }
    return new Promise(resolve => setTimeout(() => resolve({ success: true, user: { name: 'Mirshad Ali', role: 'SUPER ADMIN' } }), 1000));
  },
};

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Must be a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(data);
      if (response.success) {
        // Here you would typically set the user in your AuthContext
        // and then navigate to the dashboard.
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth={false} sx={{ height: '100vh', p: '0 !important' }}>
      <Grid container sx={{ height: '100%' }}>
        {/* Left Panel: Illustration */}
        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <LoginIllustration />
          </Box>
        </Grid>

        {/* Right Panel: Form */}
        <Grid item xs={12} md={6} component={Paper} elevation={6} square sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ width: '100%', maxWidth: '450px' }}
          >
            <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography component="h1" variant="h2" sx={{ mb: 1, fontWeight: 700 }}>
                Sign In
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Enter your credentials to access your account.
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
                <Stack spacing={2.5}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <AppInput
                        {...field}
                        inputVariant="filled"
                        label="Email Address"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        autoFocus
                      />
                    )}
                  />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <AppInput
                        {...field}
                        inputVariant="filled"
                        label="Password"
                        type="password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                  {error && <Alert severity="error">{error}</Alert>}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Link component={RouterLink} to="/forgot-password" variant="body2">
                      Forgot password?
                    </Link>
                  </Box>
                  <AppButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ py: 1.5 }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </AppButton>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/register" variant="subtitle2">
                      Sign Up
                    </Link>
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
