// /src/pages/auth/ForgotPasswordPage.js
import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Stack, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';

// Import custom components
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';

// A placeholder for your auth service
// In your real app, this would make the API call
const authService = {
  forgotPassword: async (data) => {
    console.log('Sending password reset request for:', data.email);
    // Simulate API call
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  },
};

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email('Must be a valid email').required('Email is required'),
});

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.forgotPassword(data);
      if (response.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 4,
          }}
        >
          {isSubmitted ? (
            <Box textAlign="center">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <Typography component="h1" variant="h2" sx={{ mb: 2 }}>
                  Check Your Email
                </Typography>
                <Typography color="text.secondary">
                  If an account with that email exists, we have sent a link to reset your password.
                </Typography>
              </motion.div>
            </Box>
          ) : (
            <>
              <Typography component="h1" variant="h2" sx={{ mb: 1 }}>
                Forgot Password?
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                No worries! Enter your email and we'll send you a reset link.
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
                <Stack spacing={2}>
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
                  {error && <Alert severity="error">{error}</Alert>}
                  <AppButton
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </AppButton>
                </Stack>
              </Box>
            </>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ForgotPasswordPage;
