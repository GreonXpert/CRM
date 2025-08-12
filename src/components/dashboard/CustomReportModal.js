// src/components/dashboard/CustomReportModal.js
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Slide,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download,
  DateRange,
  Description,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useDownloadCustomReportMutation } from '../../store/api/reportApi';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
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
      borderRadius: '20px 20px 0 0',
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    '&:hover': {
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
      transform: 'translateY(-1px)',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
      transform: 'translateY(-2px)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    '&:hover': {
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
      transform: 'translateY(-1px)',
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.15)',
      transform: 'translateY(-2px)',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
}));

const DownloadButton = styled(ActionButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  boxShadow: `0 4px 15px rgba(99, 102, 241, 0.3)`,
  '&:hover': {
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

const CustomReportModal = ({ open, handleClose, onSuccess, onError }) => {
  const [params, setParams] = useState({
    startDate: '',
    endDate: '',
    format: 'csv',
  });
  const [downloadCustomReport, { isLoading }] = useDownloadCustomReportMutation();

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleDownload = async () => {
    try {
      // Validate dates
      if (!params.startDate || !params.endDate) {
        onError('Please select both start and end dates');
        return;
      }

      if (new Date(params.startDate) > new Date(params.endDate)) {
        onError('Start date cannot be later than end date');
        return;
      }

      const response = await downloadCustomReport(params).unwrap();
      
      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `report_${currentDate}.${params.format}`;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onSuccess(`Report downloaded successfully as ${filename}`);
      handleClose();
      
      // Reset form
      setParams({
        startDate: '',
        endDate: '',
        format: 'csv',
      });
    } catch (error) {
      console.error('Failed to download report:', error);
      onError(error.data?.message || 'Failed to download report. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setParams({
      startDate: '',
      endDate: '',
      format: 'csv',
    });
    handleClose();
  };

  return (
    <StyledDialog 
      open={open} 
      onClose={handleCloseModal} 
      maxWidth="sm" 
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up", timeout: 400 }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)`,
                color: 'white',
              }}
            >
              <Download />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Download Custom Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate and download reports for specified date range
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                color: 'primary.main',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 3, py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Date Range Section */}
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 2, 
                fontWeight: 600, 
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <DateRange sx={{ fontSize: 18, color: 'primary.main' }} />
              Date Range
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <StyledTextField
                name="startDate"
                label="Start Date"
                type="date"
                value={params.startDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRange color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                name="endDate"
                label="End Date"
                type="date"
                value={params.endDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRange color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Format Selection */}
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 2, 
                fontWeight: 600, 
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Description sx={{ fontSize: 18, color: 'secondary.main' }} />
              Report Format
            </Typography>
            
            <StyledFormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select
                name="format"
                value={params.format}
                label="Format"
                onChange={handleChange}
              >
                <MenuItem value="csv">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    📊 CSV (Spreadsheet)
                  </Box>
                </MenuItem>
                <MenuItem value="pdf">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    📄 PDF (Document)
                  </Box>
                </MenuItem>
              </Select>
            </StyledFormControl>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <CancelButton 
          onClick={handleCloseModal}
          size="large"
        >
          Cancel
        </CancelButton>
        <DownloadButton 
          onClick={handleDownload}
          disabled={isLoading || !params.startDate || !params.endDate}
          size="large"
          startIcon={isLoading ? <CircularProgress size={20} /> : <Download />}
        >
          {isLoading ? 'Generating...' : 'Download Report'}
        </DownloadButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default CustomReportModal;
