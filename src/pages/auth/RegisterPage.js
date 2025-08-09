// /src/pages/auth/RegisterPage.js
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

// A new SVG illustration for the registration page
const RegisterIllustration = () => (
  <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#81C784', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <motion.rect
      x="0" y="0" width="800" height="600" fill="url(#grad2)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
    />
    <motion.g initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
      <rect x="250" y="200" width="300" height="200" rx="20" fill="#FFFFFF" />
      <line x1="250" y1="250" x2="550" y2="250" stroke="#E0E0E0" strokeWidth="2" />
      <circle cx="300" cy="280" r="10" fill="#BDBDBD" />
      <rect x="330" y="275" width="180" height="10" rx="5" fill="#BDBDBD" />
      <circle cx="300" cy="320" r="10" fill="#BDBDBD" />
      <rect x="330" y="315" width="150" height="10" rx="5" fill="#BDBDBD" />
    </motion.g>
    <Typography component="text" x="400" y="500" fontFamily="Inter" fontSize="32" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">
      Join Our Team
    </Typography>
  </svg>
);

// A placeholder for your auth service
const authService = {
  register: async (data) => {
    console.log('Registering with:', data);
    if (data.email === 'exists@test.com') {
      return Promise.reject({ message: 'An account with this email already exists.' });
    }
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1500));
  },
};

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required('Your name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const RegisterPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.register(data);
      if (response.success) {
        // On successful registration, navigate to the login page
        navigate('/login');
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
            <RegisterIllustration />
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
                Create Account
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Fill in the details below to get started.
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
                <Stack spacing={2.5}>
                  <Controller name="name" control={control} render={({ field }) => (
                      <AppInput {...field} inputVariant="filled" label="Full Name" error={!!errors.name} helperText={errors.name?.message} autoFocus />
                  )}/>
                  <Controller name="email" control={control} render={({ field }) => (
                      <AppInput {...field} inputVariant="filled" label="Email Address" type="email" error={!!errors.email} helperText={errors.email?.message} />
                  )}/>
                  <Controller name="password" control={control} render={({ field }) => (
                      <AppInput {...field} inputVariant="filled" label="Password" type="password" error={!!errors.password} helperText={errors.password?.message} />
                  )}/>
                  <Controller name="confirmPassword" control={control} render={({ field }) => (
                      <AppInput {...field} inputVariant="filled" label="Confirm Password" type="password" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
                  )}/>
                  
                  {error && <Alert severity="error">{error}</Alert>}
                  
                  <AppButton type="submit" variant="primary" fullWidth disabled={loading} sx={{ py: 1.5 }}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </AppButton>

                  <Typography variant="body2" color="text.secondary" align="center">
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login" variant="subtitle2">
                      Sign In
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

export default RegisterPage;
