// src/components/admin/EditUserModal.js

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  IconButton,
  Typography,
  Box,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Slide,
  LinearProgress,
} from '@mui/material';
import {
  Close,
  Person,
  Email,
  AdminPanelSettings,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useUpdateUserMutation } from '../../store/api/userApi';

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

// Styled Components
const EnhancedDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
    boxShadow: '0 20px 60px rgba(99, 102, 241, 0.2)',
    overflow: 'visible',
    position: 'relative',
    minWidth: '500px',
    maxWidth: '600px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
      borderRadius: '20px 20px 0 0',
    },
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
  borderRadius: '0 0 16px 16px',
  marginBottom: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
}));

const FloatingAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  animation: `${float} 3s ease-in-out infinite`,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
  border: '3px solid rgba(255, 255, 255, 0.8)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.15)',
      transform: 'translateY(-1px)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const ActionButton = styled(Button)(({ theme, variant: buttonVariant }) => ({
  borderRadius: 10,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  minWidth: '120px',
  ...(buttonVariant === 'contained' && {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    color: 'white',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
    },
  }),
  ...(buttonVariant === 'outlined' && {
    borderColor: theme.palette.grey[300],
    color: theme.palette.text.secondary,
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: 'rgba(99, 102, 241, 0.05)',
      transform: 'translateY(-1px)',
    },
  }),
}));

const AnimatedContent = styled(Box)({
  animation: `${slideIn} 0.4s ease-out`,
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditUserModal = ({ open, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'ADMIN',
  });
  const [errors, setErrors] = useState({});
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'ADMIN',
      });
      setErrors({});
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await updateUser({
        id: user._id,
        ...formData,
      }).unwrap();

      // Call the onUpdate callback to refresh the data
      if (onUpdate) {
        onUpdate();
      }

      onClose();
    } catch (error) {
      setErrors({
        submit: error?.data?.message || 'Failed to update user. Please try again.',
      });
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      role: 'ADMIN',
    });
    setErrors({});
    onClose();
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'U';
  };

  if (!user) return null;

  return (
    <EnhancedDialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
    >
      {/* Loading Progress */}
      {isUpdating && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            borderRadius: '20px 20px 0 0',
          }}
        />
      )}

      {/* Header */}
      <DialogTitle sx={{ p: 0 }}>
        <HeaderSection>
          <FloatingAvatar>
            {getInitials(user.name)}
          </FloatingAvatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Edit Administrator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update administrator information
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main',
                transform: 'rotate(90deg)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Close />
          </IconButton>
        </HeaderSection>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 3, pb: 2 }}>
        <AnimatedContent>
          {/* Error Alert */}
          {errors.submit && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                animation: `${slideIn} 0.3s ease-out`,
              }}
              onClose={() => setErrors(prev => ({ ...prev, submit: '' }))}
            >
              {errors.submit}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Name Field */}
              <StyledTextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                disabled={isUpdating}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter administrator's full name"
              />

              {/* Email Field */}
              <StyledTextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isUpdating}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter email address"
              />

              {/* Role Field */}
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Role"
                  disabled={isUpdating}
                  startAdornment={
                    <InputAdornment position="start">
                      <AdminPanelSettings color="primary" />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    },
                  }}
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                </Select>
                {errors.role && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.role}
                  </Typography>
                )}
              </FormControl>

              {/* User Info Display */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                }}
              >
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  User Information
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>User ID:</strong> {user._id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </AnimatedContent>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <ActionButton
          variant="outlined"
          onClick={handleClose}
          disabled={isUpdating}
          startIcon={<Cancel />}
        >
          Cancel
        </ActionButton>
        <ActionButton
          variant="contained"
          onClick={handleSubmit}
          disabled={isUpdating}
          startIcon={isUpdating ? null : <Save />}
        >
          {isUpdating ? 'Updating...' : 'Update Admin'}
        </ActionButton>
      </DialogActions>
    </EnhancedDialog>
  );
};

export default EditUserModal;
