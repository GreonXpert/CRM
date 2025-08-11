// src/components/admin/AdminManagement.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Avatar,
  Grid,
  Fab,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  AdminPanelSettings,
  Email,
  Person,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useRegisterMutation } from '../../store/api/authApi';
import { useGetAllUsersQuery, useDeleteUserMutation } from '../../store/api/userApi';

const AdminManagement = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
  });
  const [errors, setErrors] = useState({});
  
  const { isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const { data: usersData, isLoading: isLoadingUsers, refetch } = useGetAllUsersQuery({
    role: 'ADMIN',
  });
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    if (location.state?.openDialog) {
      setOpen(true);
      // Clear the state to prevent re-opening on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Redirect if not super admin
  if (!isSuperAdmin()) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Only Super Admins can access this page.
        </Typography>
      </Box>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
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
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      await register(formData).unwrap();
      setOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'ADMIN',
      });
      refetch(); // Refresh the users list
    } catch (error) {
      setErrors({
        submit: error?.data?.message || 'Failed to create admin. Please try again.',
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      try {
        await deleteUser(userId).unwrap();
        refetch();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'ADMIN',
    });
    setErrors({});
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'A';
  };

  const admins = usersData?.data || [];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Admin Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={refetch} disabled={isLoadingUsers}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5b21b6, #7c3aed)',
                },
              }}
            >
              Create Admin
            </Button>
          </Box>
        </Box>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary' }}
        >
          Manage admin users and their permissions
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  }}
                >
                  <AdminPanelSettings />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {admins.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Admins
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Admins Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600 }}
            >
              Admin Users
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingUsers ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                      Loading admins...
                    </TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                      No admin users found
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'white',
                              width: 40,
                              height: 40,
                            }}
                          >
                            {getInitials(admin.name)}
                          </Avatar>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {admin.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {admin.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={admin.role}
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteUser(admin._id)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create Admin Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create New Admin
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              InputProps={{
                startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
            
            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
              InputProps={{
                startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
            
            <TextField
              fullWidth
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password || 'Minimum 6 characters'}
              margin="normal"
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isRegistering}
            sx={{
              minWidth: 100,
              background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5b21b6, #7c3aed)',
              },
            }}
          >
            {isRegistering ? 'Creating...' : 'Create Admin'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add admin"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', sm: 'none' },
          background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5b21b6, #7c3aed)',
          },
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default AdminManagement;
