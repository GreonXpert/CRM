// /src/pages/profile/UserProfilePage.js
import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box, Avatar, Tabs, Tab, Stack, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Import Custom Components & Icons
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { Edit, Lock, CameraAlt } from '@mui/icons-material';

// --- Placeholders for Hooks and Services ---
const useAuth = () => ({
  user: {
    name: 'Mirshad Ali',
    email: 'mirshad@ebscards.com',
    role: 'SUPER ADMIN',
    avatar: 'https://i.pravatar.cc/150?u=mirshadali'
  },
});

const userService = {
  updateProfile: async (data) => {
    console.log('Updating profile:', data);
    return { success: true, message: 'Profile updated successfully!' };
  },
  changePassword: async (data) => {
    console.log('Changing password...');
    if (data.currentPassword === 'password123') {
        return { success: true, message: 'Password changed successfully!' };
    }
    return Promise.reject({ message: 'Incorrect current password.' });
  }
};
// --- End Placeholders ---

// --- Styled Components ---
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

const AvatarUploadOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    opacity: 1,
  },
});

// --- Validation Schemas ---
const profileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(6, 'New password must be at least 6 characters').required('New password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match').required('Please confirm your new password'),
});

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
};

const UserProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({ open: false, type: '', message: '' });

  const { control: profileControl, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email },
  });

  const { control: passwordControl, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onProfileSubmit = async (data) => {
    try {
      const res = await userService.updateProfile(data);
      setNotification({ open: true, type: 'success', message: res.message });
    } catch (err) {
      setNotification({ open: true, type: 'error', message: err.message });
    }
  };

  const onPasswordSubmit = async (data) => {
     try {
      const res = await userService.changePassword(data);
      setNotification({ open: true, type: 'success', message: res.message });
      resetPasswordForm();
    } catch (err) {
      setNotification({ open: true, type: 'error', message: err.message });
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Container maxWidth="lg">
        <Typography variant="h2" gutterBottom component={motion.h2} variants={itemVariants}>
          My Profile
        </Typography>
        <Grid container spacing={4}>
          {/* Left Column: Profile Card */}
          <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 4 }}>
              <Box sx={{ position: 'relative', width: 120, mx: 'auto', mb: 2 }}>
                <ProfileAvatar src={user.avatar} />
                <AvatarUploadOverlay>
                  <CameraAlt />
                </AvatarUploadOverlay>
              </Box>
              <Typography variant="h3">{user.name}</Typography>
              <Typography color="text.secondary" gutterBottom>{user.role}</Typography>
              <Typography variant="body2">{user.email}</Typography>
            </Paper>
          </Grid>

          {/* Right Column: Settings */}
          <Grid item xs={12} md={8} component={motion.div} variants={itemVariants}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tab icon={<Edit />} iconPosition="start" label="Update Information" />
                <Tab icon={<Lock />} iconPosition="start" label="Change Password" />
              </Tabs>
              <Box sx={{ pt: 3 }}>
                {notification.open && (
                  <Alert severity={notification.type} onClose={() => setNotification({ ...notification, open: false })} sx={{ mb: 2 }}>
                    {notification.message}
                  </Alert>
                )}
                {activeTab === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Box component="form" onSubmit={handleProfileSubmit(onProfileSubmit)}>
                      <Stack spacing={2}>
                        <Controller name="name" control={profileControl} render={({ field }) => <AppInput {...field} label="Full Name" error={!!profileErrors.name} helperText={profileErrors.name?.message} />} />
                        <Controller name="email" control={profileControl} render={({ field }) => <AppInput {...field} label="Email Address" type="email" error={!!profileErrors.email} helperText={profileErrors.email?.message} />} />
                        <AppButton type="submit" variant="primary" sx={{ alignSelf: 'flex-start' }}>Save Changes</AppButton>
                      </Stack>
                    </Box>
                  </motion.div>
                )}
                {activeTab === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Box component="form" onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                      <Stack spacing={2}>
                        <Controller name="currentPassword" control={passwordControl} render={({ field }) => <AppInput {...field} label="Current Password" type="password" error={!!passwordErrors.currentPassword} helperText={passwordErrors.currentPassword?.message} />} />
                        <Controller name="newPassword" control={passwordControl} render={({ field }) => <AppInput {...field} label="New Password" type="password" error={!!passwordErrors.newPassword} helperText={passwordErrors.newPassword?.message} />} />
                        <Controller name="confirmPassword" control={passwordControl} render={({ field }) => <AppInput {...field} label="Confirm New Password" type="password" error={!!passwordErrors.confirmPassword} helperText={passwordErrors.confirmPassword?.message} />} />
                        <AppButton type="submit" variant="primary" sx={{ alignSelf: 'flex-start' }}>Update Password</AppButton>
                      </Stack>
                    </Box>
                  </motion.div>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default UserProfilePage;
