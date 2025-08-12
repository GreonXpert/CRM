// src/components/leads/LeadListTable.js
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  Card,
  CardContent,
  Fade,
  Slide,
  LinearProgress,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Visibility,
  Person,
  Phone,
  Timeline,
  CalendarToday,
  Business,
  People,
  Search,
  Clear,
  FilterList,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: '0 10px 40px rgba(99, 102, 241, 0.1)',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.grey[100]}`,
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableHead-root': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.2s ease',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
      transform: 'scale(1.01)',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
    },
  },
  '& .MuiTableCell-root': {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    padding: theme.spacing(2),
  },
  '& .MuiTableCell-head': {
    fontWeight: 700,
    color: theme.palette.text.primary,
    fontSize: '0.95rem',
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
      transform: 'translateY(-1px)',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.15)',
      transform: 'translateY(-2px)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const ClearButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  color: theme.palette.text.secondary,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  minWidth: 'auto',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    transform: 'scale(1.05)',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'new':
        return { 
          bg: theme.palette.info.main, 
          color: 'white',
          icon: '🆕'
        };
      case 'follow-up':
        return { 
          bg: theme.palette.warning.main, 
          color: 'white',
          icon: '📞'
        };
      case 'approved':
        return { 
          bg: theme.palette.success.main, 
          color: 'white',
          icon: '✅'
        };
      case 'rejected':
        return { 
          bg: theme.palette.error.main, 
          color: 'white',
          icon: '❌'
        };
      default:
        return { 
          bg: theme.palette.grey[400], 
          color: 'white',
          icon: '📝'
        };
    }
  };

  const config = getStatusConfig();
  return {
    backgroundColor: config.bg,
    color: config.color,
    fontWeight: 600,
    borderRadius: 20,
    padding: theme.spacing(0.5, 1.5),
    '&:before': {
      content: `"${config.icon}"`,
      marginRight: theme.spacing(0.5),
    },
  };
});

const ActionIconButton = styled(IconButton)(({ theme, actionType }) => {
  const getActionConfig = () => {
    switch (actionType) {
      case 'view':
        return {
          color: theme.palette.primary.main,
          bg: `${theme.palette.primary.main}15`,
        };
      case 'edit':
        return {
          color: theme.palette.secondary.main,
          bg: `${theme.palette.secondary.main}15`,
        };
      case 'delete':
        return {
          color: theme.palette.error.main,
          bg: `${theme.palette.error.main}15`,
        };
      default:
        return {
          color: theme.palette.grey[600],
          bg: `${theme.palette.grey[300]}15`,
        };
    }
  };

  const config = getActionConfig();
  return {
    color: config.color,
    backgroundColor: config.bg,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: config.bg.replace('15', '25'),
      transform: 'scale(1.1)',
      boxShadow: `0 4px 12px ${config.color}40`,
    },
  };
});

const LeadListTable = ({ leads, isLoading, error, onView, onEdit, onDelete, onStatusChange }) => {
  const { user, isSuperAdmin } = useAuth();
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter leads based on search term
  const filteredLeads = useMemo(() => {
    if (!leads || !searchTerm) return leads;

    return leads.filter(lead => {
      const searchLower = searchTerm.toLowerCase();
      return (
        lead.customerName?.toLowerCase().includes(searchLower) ||
        lead.mobileNumber?.toLowerCase().includes(searchLower) ||
        lead.status?.toLowerCase().includes(searchLower) ||
        lead.source?.toLowerCase().includes(searchLower) ||
        lead.createdBy?.name?.toLowerCase().includes(searchLower) ||
        lead.rejectionReason?.toLowerCase().includes(searchLower) ||
        lead.rejectionNotes?.toLowerCase().includes(searchLower)
      );
    });
  }, [leads, searchTerm]);

  const getStatusChip = (status) => {
    return <StatusChip label={status} status={status} size="small" />;
  };

  const getInitials = (name) => name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'L';

  const handleStatusClick = (leadId) => {
    setEditingStatusId(leadId);
  };

  const handleStatusChange = (e, leadId) => {
    const newStatus = e.target.value;
    onStatusChange(leadId, newStatus);
    setEditingStatusId(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <LinearProgress
          sx={{
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)',
            },
          }}
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <Avatar sx={{ width: 80, height: 80, mb: 3, bgcolor: 'primary.light' }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary">
              Loading leads data...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontSize: '1rem',
              }
            }}
          >
            Failed to load leads. Please try again later.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Enhanced Table Header with Search */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
            borderBottom: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          {/* Header Title Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ backgroundColor: 'primary.main', color: 'white' }}>
                <Timeline />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Leads Directory
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and track all your leads in one place
                </Typography>
              </Box>
            </Box>
            
            {/* Results Counter */}
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {filteredLeads?.length || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {searchTerm ? 'Filtered Results' : 'Total Leads'}
              </Typography>
            </Box>
          </Box>

          {/* Search Section */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <SearchTextField
              placeholder="Search leads by name, phone, status, source, or creator..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="medium"
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <Tooltip title="Clear search">
                      <IconButton 
                        onClick={handleClearSearch}
                        size="small"
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { 
                            color: 'primary.main',
                            transform: 'scale(1.1)',
                          }
                        }}
                      >
                        <Clear />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            
            {searchTerm && (
              <Slide in={true} direction="left" timeout={300}>
                <ClearButton
                  onClick={handleClearSearch}
                  startIcon={<Clear />}
                >
                  Clear
                </ClearButton>
              </Slide>
            )}
            
            <Tooltip title="Advanced Filters">
              <IconButton
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: 'primary.main',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Search Results Info */}
          {searchTerm && (
            <Fade in={true} timeout={500}>
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {filteredLeads?.length === 0 ? (
                    <>
                      No results found for "<strong>{searchTerm}</strong>". Try different keywords.
                    </>
                  ) : (
                    <>
                      Found <strong>{filteredLeads?.length}</strong> lead{filteredLeads?.length !== 1 ? 's' : ''} matching "<strong>{searchTerm}</strong>"
                    </>
                  )}
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>

        <StyledTableContainer component={Paper} elevation={0}>
          <StyledTable aria-label="enhanced leads table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person color="action" />
                    Customer Details
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone color="action" />
                    Mobile
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timeline color="action" />
                    Status
                  </Box>
                </TableCell>
                <TableCell>Source</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business color="action" />
                    Created By
                  </Box>
                </TableCell>
                <TableCell>Rejection Reason</TableCell>
                <TableCell>Rejection Notes</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday color="action" />
                    Created At
                  </Box>
                </TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads && filteredLeads.length > 0 ? (
                filteredLeads.map((lead, index) => {
                  const canModify = isSuperAdmin() || user.id === lead.createdBy._id;
                  return (
                    <TableRow hover key={lead._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)',
                              color: 'white',
                              width: 45,
                              height: 45,
                              fontWeight: 700,
                              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                            }}
                          >
                            {getInitials(lead.customerName)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                              {lead.customerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Lead ID: {lead._id.slice(-6)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {lead.mobileNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {editingStatusId === lead._id ? (
                          <Select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(e, lead._id)}
                            onBlur={() => setEditingStatusId(null)}
                            autoFocus
                            size="small"
                            sx={{
                              borderRadius: 2,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          >
                            <MenuItem value="New">🆕 New</MenuItem>
                            <MenuItem value="Follow-up">📞 Follow-up</MenuItem>
                            <MenuItem value="Approved">✅ Approved</MenuItem>
                            <MenuItem value="Rejected">❌ Rejected</MenuItem>
                          </Select>
                        ) : (
                          <Box
                            onClick={() => canModify && handleStatusClick(lead._id)}
                            sx={{ 
                              cursor: canModify ? 'pointer' : 'default',
                              display: 'inline-block',
                              transition: 'transform 0.2s ease',
                              '&:hover': canModify ? {
                                transform: 'scale(1.05)',
                              } : {},
                            }}
                          >
                            {getStatusChip(lead.status)}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={lead.source}
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                            color: 'primary.main',
                            fontWeight: 500,
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: '0.875rem',
                              bgcolor: 'secondary.light',
                              color: 'secondary.contrastText',
                            }}
                          >
                            {getInitials(lead.createdBy?.name)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {lead.createdBy?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {lead.createdBy?.role || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{
                            maxWidth: 150,
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {lead.rejectionReason || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{
                            maxWidth: 200,
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {lead.rejectionNotes || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(lead.createdAt), 'HH:mm')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <ActionIconButton
                              onClick={() => onView(lead)}
                              size="small"
                              actionType="view"
                            >
                              <Visibility />
                            </ActionIconButton>
                          </Tooltip>
                          {canModify && (
                            <>
                              <Tooltip title="Edit Lead">
                                <ActionIconButton
                                  onClick={() => onEdit(lead)}
                                  size="small"
                                  actionType="edit"
                                >
                                  <Edit />
                                </ActionIconButton>
                              </Tooltip>
                              <Tooltip title="Delete Lead">
                                <ActionIconButton
                                  onClick={() => onDelete(lead._id)}
                                  size="small"
                                  actionType="delete"
                                >
                                  <Delete />
                                </ActionIconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.200' }}>
                        {searchTerm ? <Search sx={{ fontSize: 40, color: 'grey.500' }} /> : <People sx={{ fontSize: 40, color: 'grey.500' }} />}
                      </Avatar>
                      <Typography variant="h6" color="text.secondary">
                        {searchTerm ? 'No matching leads found' : 'No leads found'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm 
                          ? `Try adjusting your search criteria for "${searchTerm}"`
                          : 'Create your first lead to get started'
                        }
                      </Typography>
                      {searchTerm && (
                        <Button
                          variant="outlined"
                          onClick={handleClearSearch}
                          sx={{ mt: 1 }}
                        >
                          Clear Search
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </Card>
    </Fade>
  );
};

export default LeadListTable;
