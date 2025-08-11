// src/components/leads/LeadListTable.js
import React from 'react';
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
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const LeadListTable = ({ leads, isLoading, error, onView, onEdit, onDelete }) => {
  const { user, isSuperAdmin } = useAuth();

  const getStatusChip = (status) => {
    let color;
    switch (status) {
      case 'New': color = 'info'; break;
      case 'Follow-up': color = 'warning'; break;
      case 'Approved': color = 'success'; break;
      case 'Rejected': color = 'error'; break;
      default: color = 'default';
    }
    return <Chip label={status} color={color} size="small" />;
  };

  const getInitials = (name) => name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'L';

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">Failed to load leads. Please try again.</Alert>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="leads table">
        <TableHead>
          <TableRow>
            <TableCell>Customer Name</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads && leads.length > 0 ? (
            leads.map((lead) => {
              const canModify = isSuperAdmin() || user.id === lead.createdBy._id;
              return (
                <TableRow key={lead._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>{getInitials(lead.customerName)}</Avatar>
                      <Typography variant="body2">{lead.customerName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{lead.mobileNumber}</TableCell>
                  <TableCell>{getStatusChip(lead.status)}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{format(new Date(lead.createdAt), 'PPpp')}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Lead">
                      <IconButton onClick={() => onView(lead)} size="small" color="primary">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    {canModify && (
                      <>
                        <Tooltip title="Edit Lead">
                          <IconButton onClick={() => onEdit(lead)} size="small" color="secondary">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Lead">
                          <IconButton onClick={() => onDelete(lead._id)} size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">No leads found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeadListTable;
