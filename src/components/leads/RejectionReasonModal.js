// src/components/leads/RejectionReasonModal.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  IconButton,
  Divider,
  Fade,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Notes as NotesIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components for enhanced appearance
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.15)',
    overflow: 'visible',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(3),
  position: 'relative',
  '& .MuiTypography-root': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontWeight: 600,
    fontSize: '1.25rem',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 4px 12px rgba(99, 102, 241, 0.15)`,
    },
    '&.Mui-focused': {
      boxShadow: `0 4px 20px rgba(99, 102, 241, 0.25)`,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 4px 12px rgba(99, 102, 241, 0.15)`,
    },
    '&.Mui-focused': {
      boxShadow: `0 4px 20px rgba(99, 102, 241, 0.25)`,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  padding: theme.spacing(1.2, 3),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
}));

const SubmitButton = styled(ActionButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  boxShadow: `0 4px 15px rgba(99, 102, 241, 0.3)`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, #3730a3 100%)`,
    boxShadow: `0 6px 20px rgba(99, 102, 241, 0.4)`,
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    background: theme.palette.grey[300],
    color: theme.palette.grey[500],
    boxShadow: 'none',
    transform: 'none',
  },
}));

const CancelButton = styled(ActionButton)(({ theme }) => ({
  color: theme.palette.grey[600],
  border: `2px solid ${theme.palette.grey[200]}`,
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
    borderColor: theme.palette.grey[300],
    transform: 'translateY(-1px)',
  },
}));

const SectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: '#fefefe',
  border: `1px solid ${theme.palette.grey[100]}`,
  marginBottom: theme.spacing(2),
}));

const RejectionReasonModal = ({ open, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    // Validation
    const newErrors = {};
    if (!reason) newErrors.reason = 'Please select a rejection reason';
    if (!notes.trim()) newErrors.notes = 'Please provide rejection notes';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ reason, notes });
    handleClose();
  };

  const handleClose = () => {
    setReason('');
    setNotes('');
    setErrors({});
    onClose();
  };

  const rejectionReasons = [
    { value: 'CIBIL Issue', label: 'CIBIL Score Issue', icon: '📊' },
    { value: 'Low Income', label: 'Insufficient Income', icon: '💰' },
    { value: 'Documentation Missing', label: 'Documentation Missing', icon: '📄' },
    { value: 'Not Interested', label: 'Customer Not Interested', icon: '❌' },
    { value: 'Poor Lead', label: 'Poor Lead Quality', icon: '⚠️' },
    { value: 'Other', label: 'Other Reasons', icon: '📝' },
  ];

  return (
    <StyledDialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
    >
      <StyledDialogTitle>
        <WarningIcon sx={{ fontSize: 28 }} />
        <Typography variant="h6" component="span">
          Lead Rejection
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ padding: 3 }}>
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: '0.9rem'
            }
          }}
        >
          Please specify the reason for rejecting this lead. This action cannot be undone.
        </Alert>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SectionBox>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CategoryIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                  Rejection Reason
                </Typography>
              </Box>
              <StyledFormControl fullWidth error={!!errors.reason}>
                <InputLabel>Select Reason *</InputLabel>
                <Select
                  value={reason}
                  label="Select Reason *"
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (errors.reason) {
                      setErrors(prev => ({ ...prev, reason: '' }));
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                      }
                    }
                  }}
                >
                  {rejectionReasons.map((reasonOption) => (
                    <MenuItem 
                      key={reasonOption.value} 
                      value={reasonOption.value}
                      sx={{
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(99, 102, 241, 0.08)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '1.1rem' }}>{reasonOption.icon}</span>
                        {reasonOption.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.reason && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                    {errors.reason}
                  </Typography>
                )}
              </StyledFormControl>
            </SectionBox>
          </Grid>

          <Grid item xs={12}>
            <SectionBox>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotesIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                  Additional Notes
                </Typography>
              </Box>
              <StyledTextField
                label="Detailed rejection notes *"
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (errors.notes) {
                    setErrors(prev => ({ ...prev, notes: '' }));
                  }
                }}
                placeholder="Please provide detailed information about the rejection reason..."
                error={!!errors.notes}
                helperText={errors.notes || "Provide specific details to help improve future lead quality"}
                inputProps={{ maxLength: 500 }}
              />
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ display: 'block', textAlign: 'right', mt: 1 }}
              >
                {notes.length}/500 characters
              </Typography>
            </SectionBox>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ padding: 3, gap: 2 }}>
        <CancelButton 
          onClick={handleClose}
          size="large"
        >
          Cancel
        </CancelButton>
        <SubmitButton 
          onClick={handleSubmit}
          size="large"
          disabled={!reason || !notes.trim()}
        >
          Reject Lead
        </SubmitButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default RejectionReasonModal;
