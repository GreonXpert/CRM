// /src/pages/auth/ResetPasswordPage.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Stack, Alert, Link } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';

// Import custom components
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';

// A placeholder for your auth service
const authService = {
  resetPassword: async (token, password) => {
    console.log(`Resetting password with token: ${token}`);
    // Simulate API call
    if (password === 'fail') { // for testing error state
        return Promise.reject({ success: false, message: 'Invalid or expired token.' });
    }
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  },
};

// Validation schema
const schema = yup.object().shape({
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPasswordPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resettoken } = useParams(); // Get the token from the URL
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.resetPassword(resettoken, data.password);
      if (response.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
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
          {isSuccess ? (
            <Box textAlign="center">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <Typography component="h1" variant="h2" sx={{ mb: 2 }}>
                  Password Reset!
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Your password has been successfully updated.
                </Typography>
                <AppButton variant="primary" onClick={() => navigate('/login')}>
                  Proceed to Login
                </AppButton>
              </motion.div>
            </Box>
          ) : (
            <>
              <Typography component="h1" variant="h2" sx={{ mb: 2 }}>
                Reset Password
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Create a new, strong password for your account.
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
                <Stack spacing={2}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <AppInput
                        {...field}
                        inputVariant="filled"
                        label="New Password"
                        type="password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        autoFocus
                      />
                    )}
                  />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <AppInput
                        {...field}
                        inputVariant="filled"
                        label="Confirm New Password"
                        type="password"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
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
                    {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPasswordPage;
