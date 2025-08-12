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
  Divider,
  Badge,
  Slide,
  Fade,
  Zoom,
  LinearProgress,
  InputAdornment,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  AdminPanelSettings,
  Email,
  Person,
  Refresh,
  Security,
  SupervisorAccount,
  Shield,
  Lock,
  Visibility,
  VisibilityOff,
  AccountCircle,
  Timeline,
  TrendingUp,
  Groups,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useRegisterMutation } from '../../store/api/authApi';
import { useGetAllUsersQuery, useDeleteUserMutation } from '../../store/api/userApi';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 8px 40px rgba(99, 102, 241, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Styled Components
const HeaderSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: 24,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: `${float} 6s ease-in-out infinite`,
  },
}));

const StatsCard = styled(Card)(({ theme, gradient }) => ({
  borderRadius: 20,
  background: gradient,
  color: 'white',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    animation: `${glow} 2s ease-in-out infinite`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '200%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

const EnhancedDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 24,
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
    boxShadow: '0 20px 60px rgba(99, 102, 241, 0.2)',
    overflow: 'visible',
    position: 'relative',
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
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableHead-root': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
  },
  '& .MuiTableRow-root:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`,
    transform: 'scale(1.01)',
    transition: 'all 0.2s ease',
  },
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  boxShadow: `0 4px 15px rgba(99, 102, 241, 0.3)`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 20px rgba(99, 102, 241, 0.4)`,
  },
}));

const FloatingAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  animation: `${float} 4s ease-in-out infinite`,
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
}));

const AdminManagement = () => {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  if (!isSuperAdmin()) {
    return (
      <Fade in={true} timeout={800}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'error.main',
              mx: 'auto',
              mb: 3,
            }}
          >
            <Shield sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h4" color="error" sx={{ fontWeight: 700, mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Only Super Admins can access this page.
          </Typography>
        </Box>
      </Fade>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
      refetch();
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

  const statsData = [
    {
      title: 'Total Admins',
      value: admins.length,
      icon: <SupervisorAccount sx={{ fontSize: 32 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Active administrators',
    },
    {
      title: 'Active Sessions',
      value: Math.floor(admins.length * 0.8),
      icon: <Timeline sx={{ fontSize: 32 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: 'Currently online',
    },
    {
      title: 'Security Score',
      value: '98%',
      icon: <Security sx={{ fontSize: 32 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: 'System security rating',
    },
    {
      title: 'Performance',
      value: '95%',
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      description: 'System performance',
    },
  ];

  return (
    <Box>
      {/* Enhanced Header */}
      <Fade in={true} timeout={800}>
        <HeaderSection>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                  <FloatingAvatar>
                    <AdminPanelSettings sx={{ fontSize: 40 }} />
                  </FloatingAvatar>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      Admin Management 👨‍💼
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                      Manage your administrative team with powerful controls
                    </Typography>
                  </Box>
                </Box>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Chip
                    icon={<Shield />}
                    label="Super Admin Panel"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                  <Chip
                    icon={<Groups />}
                    label={`${admins.length} Admins`}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Tooltip title="Refresh Data">
                    <IconButton
                      onClick={refetch}
                      disabled={isLoadingUsers}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <ActionButton
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    Create Admin
                  </ActionButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </HeaderSection>
      </Fade>

   

      {/* Enhanced Admins Table */}
      <Fade in={true} timeout={1000}>
        <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(99, 102, 241, 0.1)' }}>
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)`,
              borderBottom: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ backgroundColor: 'primary.main', color: 'white' }}>
                <Groups />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Admin Users Directory
              </Typography>
            </Box>
          </Box>
          
          {isLoadingUsers && (
            <LinearProgress
              sx={{
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)`,
                },
              }}
            />
          )}
          
          <TableContainer component={Paper} elevation={0}>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountCircle color="action" />
                      User
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email color="action" />
                      Email
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AdminPanelSettings color="action" />
                      Role
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingUsers ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.light' }}>
                          <Refresh sx={{ fontSize: 30 }} />
                        </Avatar>
                        <Typography variant="h6" color="text.secondary">
                          Loading administrators...
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 60, height: 60, bgcolor: 'grey.300' }}>
                          <Person sx={{ fontSize: 30 }} />
                        </Avatar>
                        <Typography variant="h6" color="text.secondary">
                          No admin users found
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<Add />}
                          onClick={() => setOpen(true)}
                          sx={{ mt: 1 }}
                        >
                          Create First Admin
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin, index) => (
                    <Slide in={true} timeout={300 + index * 100} direction="left" key={admin._id}>
                      <TableRow hover sx={{ cursor: 'pointer' }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                background: `linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)`,
                                color: 'white',
                                width: 45,
                                height: 45,
                                fontWeight: 700,
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                              }}
                            >
                              {getInitials(admin.name)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {admin.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Administrator
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.primary">
                            {admin.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={admin.role}
                            sx={{
                              background: `linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)`,
                              color: 'primary.main',
                              fontWeight: 600,
                              border: '1px solid rgba(99, 102, 241, 0.2)',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(admin.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit Admin">
                              <IconButton
                                size="small"
                                sx={{
                                  color: 'primary.main',
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Admin">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteUser(admin._id)}
                                sx={{
                                  color: 'error.main',
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </Slide>
                  ))
                )}
              </TableBody>
            </StyledTable>
          </TableContainer>
        </Card>
      </Fade>

      {/* Enhanced Create Admin Dialog */}
{/* Enhanced Create Admin Dialog */}
<EnhancedDialog
  open={open}
  onClose={handleClose}
  maxWidth="sm"
  fullWidth
  TransitionComponent={Zoom}
  TransitionProps={{ timeout: 400 }}
  sx={{
    '& .MuiDialog-paper': {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      boxShadow: '0 32px 64px rgba(99, 102, 241, 0.2)',
      overflow: 'visible',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #10b981 100%)',
        borderRadius: 26,
        zIndex: -1,
      },
    },
  }}
>
  {/* Animated Header */}
  <DialogTitle 
    sx={{ 
      pb: 0, 
      pt: 4,
      background: 'transparent',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Background Pattern */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '150px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
        borderRadius: '24px 24px 0 0',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: `${float} 6s ease-in-out infinite`,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '10%',
          left: '-5%',
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: `${float} 4s ease-in-out infinite reverse`,
        },
      }}
    />
    
    {/* Header Content */}
    <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', pb: 3 }}>
      <Zoom in={open} timeout={600}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            color: 'white',
            mx: 'auto',
            mb: 2,
            boxShadow: '0 12px 24px rgba(99, 102, 241, 0.3)',
            border: '3px solid rgba(255, 255, 255, 0.8)',
            animation: `${float} 3s ease-in-out infinite`,
          }}
        >
          <Person sx={{ fontSize: 36 }} />
        </Avatar>
      </Zoom>
      
      <Slide in={open} direction="down" timeout={800}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              color: 'text.primary',
              mb: 1,
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create New Admin
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Add a new administrator to your team
          </Typography>
        </Box>
      </Slide>
    </Box>
  </DialogTitle>
  
  <DialogContent sx={{ px: 4, py: 3 }}>
    {/* Error Alert with Animation */}
    {errors.submit && (
      <Slide in={true} direction="down" timeout={500}>
        <Alert
          severity="error"
          sx={{ 
            mb: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            '& .MuiAlert-icon': {
              color: 'error.main',
            },
          }}
          onClose={() => setErrors(prev => ({ ...prev, submit: '' }))}
        >
          {errors.submit}
        </Alert>
      </Slide>
    )}
    
    {/* Enhanced Form */}
    <Box component="form" onSubmit={handleSubmit}>
      {/* Name Field with Enhanced Styling */}
      <Slide in={open} direction="left" timeout={600}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1, 
              fontWeight: 600, 
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Person sx={{ fontSize: 18, color: 'primary.main' }} />
            Full Name
          </Typography>
          <TextField
            fullWidth
            name="name"
            placeholder="Enter administrator's full name"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: 'rgba(248, 250, 252, 0.8)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'white',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.1)',
                  transform: 'translateY(-1px)',
                },
                '&.Mui-focused': {
                  background: 'white',
                  boxShadow: '0 6px 25px rgba(99, 102, 241, 0.15)',
                  transform: 'translateY(-2px)',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'primary.main',
              },
            }}
          />
        </Box>
      </Slide>
      
      {/* Email Field with Enhanced Styling */}
      <Slide in={open} direction="right" timeout={700}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1, 
              fontWeight: 600, 
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Email sx={{ fontSize: 18, color: 'secondary.main' }} />
            Email Address
          </Typography>
          <TextField
            fullWidth
            name="email"
            type="email"
            placeholder="admin@company.com"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: 'rgba(248, 250, 252, 0.8)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'white',
                  boxShadow: '0 4px 20px rgba(6, 182, 212, 0.1)',
                  transform: 'translateY(-1px)',
                },
                '&.Mui-focused': {
                  background: 'white',
                  boxShadow: '0 6px 25px rgba(6, 182, 212, 0.15)',
                  transform: 'translateY(-2px)',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'secondary.main',
              },
            }}
          />
        </Box>
      </Slide>
      
      {/* Password Field with Enhanced Styling */}
      <Slide in={open} direction="left" timeout={800}>
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1, 
              fontWeight: 600, 
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Lock sx={{ fontSize: 18, color: 'warning.main' }} />
            Password
          </Typography>
          <TextField
            fullWidth
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a secure password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password || 'Minimum 6 characters required'}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: 'rgba(248, 250, 252, 0.8)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'white',
                  boxShadow: '0 4px 20px rgba(245, 158, 11, 0.1)',
                  transform: 'translateY(-1px)',
                },
                '&.Mui-focused': {
                  background: 'white',
                  boxShadow: '0 6px 25px rgba(245, 158, 11, 0.15)',
                  transform: 'translateY(-2px)',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'warning.main',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{
                      color: 'text.secondary',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: 'warning.main',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Slide>
      
      {/* Password Strength Indicator */}
      <Fade in={formData.password.length > 0} timeout={500}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Password Strength
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formData.password.length >= 8 ? 'Strong' : formData.password.length >= 6 ? 'Medium' : 'Weak'}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min((formData.password.length / 8) * 100, 100)}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: formData.password.length >= 8 
                  ? 'linear-gradient(90deg, #10b981 0%, #047857 100%)'
                  : formData.password.length >= 6
                  ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
              },
            }}
          />
        </Box>
      </Fade>
    </Box>
  </DialogContent>
  
  {/* Enhanced Action Buttons */}
  <Box
    sx={{
      p: 4,
      pt: 2,
      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
      borderTop: '1px solid rgba(99, 102, 241, 0.1)',
    }}
  >
    <Stack direction="row" spacing={2} justifyContent="center">
      <Button
        onClick={handleClose}
        variant="outlined"
        size="large"
        sx={{
          minWidth: 140,
          borderRadius: 3,
          borderColor: 'grey.300',
          color: 'text.secondary',
          fontWeight: 600,
          py: 1.5,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'grey.400',
            backgroundColor: 'grey.50',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        Cancel
      </Button>
      
      <Button
        onClick={handleSubmit}
        disabled={isRegistering}
        size="large"
        sx={{
          minWidth: 140,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          color: 'white',
          fontWeight: 700,
          py: 1.5,
          boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #5b21b6 0%, #0891b2 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.5)',
          },
          '&:disabled': {
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.5) 0%, rgba(6, 182, 212, 0.5) 100%)',
            color: 'rgba(255, 255, 255, 0.7)',
            transform: 'none',
          },
        }}
      >
        {isRegistering ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} sx={{ color: 'white' }} />
            Creating...
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add sx={{ fontSize: 20 }} />
            Create Admin
          </Box>
        )}
      </Button>
    </Stack>
  </Box>
</EnhancedDialog>


      {/* Enhanced Floating Action Button */}
      <Zoom in={true} timeout={800}>
        <Fab
          color="primary"
          aria-label="add admin"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: { xs: 'flex', sm: 'none' },
            background: `linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(6, 182, 212, 0.9) 100%)`,
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
            '&:hover': {
              background: `linear-gradient(135deg, rgba(99, 102, 241, 1) 0%, rgba(6, 182, 212, 1) 100%)`,
              transform: 'scale(1.1)',
              boxShadow: '0 12px 35px rgba(99, 102, 241, 0.6)',
            },
          }}
        >
          <Add />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default AdminManagement;
