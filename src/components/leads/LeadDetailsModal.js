// src/components/leads/LeadDetailsModal.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
  Card,
  CardContent,
  Divider,
  IconButton,
  Paper,
  Avatar,
  Fade,
  Tooltip,
} from '@mui/material';
import {
  Print,
  GetApp,
  Close as CloseIcon,
  Person,
  Phone,
  CreditCard,
  Fingerprint,
  Work,
  AttachMoney,
  AccountBalance,
  CalendarToday,
  Badge,
  TrendingUp,
  PersonAdd,
} from '@mui/icons-material';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.15)',
    overflow: 'visible',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    maxWidth: 700,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  padding: theme.spacing(3),
  position: 'relative',
  '& .MuiTypography-root': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontWeight: 600,
    fontSize: '1.5rem',
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.9)',
  border: `1px solid ${theme.palette.grey[100]}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: `0 8px 25px rgba(99, 102, 241, 0.1)`,
    transform: 'translateY(-2px)',
  },
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: 12,
  margin: theme.spacing(1, 0),
  background: 'rgba(248, 250, 252, 0.6)',
  border: `1px solid ${theme.palette.grey[100]}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(99, 102, 241, 0.05)',
    borderColor: theme.palette.primary.light,
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
  marginRight: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
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
}));

const PrintButton = styled(ActionButton)(({ theme }) => ({
  color: theme.palette.secondary.main,
  border: `2px solid ${theme.palette.secondary.main}`,
  backgroundColor: 'rgba(6, 182, 212, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    transform: 'translateY(-1px)',
  },
}));

const CloseButton = styled(ActionButton)(({ theme }) => ({
  color: theme.palette.grey[600],
  border: `2px solid ${theme.palette.grey[200]}`,
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
    borderColor: theme.palette.grey[300],
    transform: 'translateY(-1px)',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { bg: theme.palette.success.main, color: 'white' };
      case 'pending':
        return { bg: theme.palette.warning.main, color: 'white' };
      case 'rejected':
        return { bg: theme.palette.error.main, color: 'white' };
      default:
        return { bg: theme.palette.grey[400], color: 'white' };
    }
  };

  const colors = getStatusColor();
  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontWeight: 600,
    borderRadius: 20,
    padding: theme.spacing(0.5, 1),
  };
});

const WatermarkBox = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) rotate(-45deg)',
  fontSize: '4rem',
  fontWeight: 900,
  color: 'rgba(99, 102, 241, 0.05)',
  zIndex: 0,
  userSelect: 'none',
  pointerEvents: 'none',
}));

const LeadDetailsModal = ({ open, onClose, lead }) => {
  if (!lead) return null;

  const handleDownloadPdf = () => {
    const input = document.getElementById('lead-details-content');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth;
      const height = width / ratio;

      // Add watermark
      pdf.setFontSize(50);
      pdf.setTextColor(230, 230, 230);
      pdf.text('EBS Card', pdfWidth / 2, pdfHeight / 2, {
        angle: -45,
        align: 'center',
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, width, height > pdfHeight ? pdfHeight : height);
      pdf.save(`lead-${lead.customerName}.pdf`);
    });
  };
  
  const handlePrint = () => {
    const printContent = document.getElementById('lead-details-content').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const leadInfo = [
    { 
      icon: <Person color="primary" />, 
      label: 'Customer Name', 
      value: lead.customerName,
      section: 'personal'
    },
    { 
      icon: <Phone color="primary" />, 
      label: 'Mobile Number', 
      value: lead.mobileNumber,
      section: 'personal'
    },
    { 
      icon: <CreditCard color="primary" />, 
      label: 'PAN Card', 
      value: lead.panCard,
      section: 'personal'
    },
    { 
      icon: <Fingerprint color="primary" />, 
      label: 'Aadhar Number', 
      value: lead.aadharNumber,
      section: 'personal'
    },
    { 
      icon: <Work color="secondary" />, 
      label: 'Employment Type', 
      value: lead.employmentType,
      section: 'employment'
    },
    { 
      icon: <AttachMoney color="secondary" />, 
      label: 'Monthly Salary', 
      value: `₹${parseInt(lead.monthlySalary).toLocaleString('en-IN')}`,
      section: 'employment'
    },
    { 
      icon: <AccountBalance color="secondary" />, 
      label: 'Preferred Bank', 
      value: lead.preferredBank || 'Not Specified',
      section: 'banking'
    },
  ];

  const systemInfo = [
    { 
      icon: <TrendingUp color="info" />, 
      label: 'Status', 
      value: <StatusChip label={lead.status} status={lead.status} size="small" />,
      section: 'system'
    },
    { 
      icon: <Badge color="info" />, 
      label: 'Source', 
      value: lead.source,
      section: 'system'
    },
    { 
      icon: <PersonAdd color="info" />, 
      label: 'Created By', 
      value: lead.createdBy?.name || 'System',
      section: 'system'
    },
    { 
      icon: <CalendarToday color="info" />, 
      label: 'Created At', 
      value: format(new Date(lead.createdAt), 'PPpp'),
      section: 'system'
    },
  ];

  return (
    <StyledDialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
    >
      <StyledDialogTitle>
        <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mr: 1 }}>
          <Person />
        </Avatar>
        <Typography variant="h6" component="span">
          Lead Details - {lead.customerName}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
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

      <DialogContent 
        id="lead-details-content" 
        sx={{ 
          p: 3, 
          position: 'relative',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
        }}
      >
        <WatermarkBox>
          EBS CARD
        </WatermarkBox>

        {/* Personal Information Section */}
        <Box sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: 'primary.main', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Person /> Personal Information
          </Typography>
          <InfoCard>
            <CardContent sx={{ p: 2 }}>
              <Grid container spacing={1}>
                {leadInfo.filter(info => info.section === 'personal').map((info, index) => (
                  <Grid item xs={12} key={index}>
                    <InfoRow>
                      <IconContainer>
                        {info.icon}
                      </IconContainer>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {info.label}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {info.value}
                        </Typography>
                      </Box>
                    </InfoRow>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </InfoCard>
        </Box>

        {/* Employment & Banking Section */}
        <Box sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: 'secondary.main', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Work /> Employment & Banking
          </Typography>
          <InfoCard>
            <CardContent sx={{ p: 2 }}>
              <Grid container spacing={1}>
                {leadInfo.filter(info => ['employment', 'banking'].includes(info.section)).map((info, index) => (
                  <Grid item xs={12} key={index}>
                    <InfoRow>
                      <IconContainer>
                        {info.icon}
                      </IconContainer>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {info.label}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {info.value}
                        </Typography>
                      </Box>
                    </InfoRow>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </InfoCard>
        </Box>

        {/* System Information Section */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: 'info.main', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Badge /> System Information
          </Typography>
          <InfoCard>
            <CardContent sx={{ p: 2 }}>
              <Grid container spacing={1}>
                {systemInfo.map((info, index) => (
                  <Grid item xs={12} key={index}>
                    <InfoRow>
                      <IconContainer>
                        {info.icon}
                      </IconContainer>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {info.label}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {typeof info.value === 'string' ? (
                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                              {info.value}
                            </Typography>
                          ) : (
                            info.value
                          )}
                        </Box>
                      </Box>
                    </InfoRow>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </InfoCard>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Paper
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: 'grey.50',
            width: '100%',
            justifyContent: 'flex-end',
          }}
        >
          <Tooltip title="Print lead details">
            <PrintButton 
              onClick={handlePrint} 
              startIcon={<Print />}
              size="large"
            >
              Print
            </PrintButton>
          </Tooltip>
          
          <Tooltip title="Download as PDF">
            <DownloadButton 
              onClick={handleDownloadPdf} 
              startIcon={<GetApp />}
              size="large"
            >
              Download PDF
            </DownloadButton>
          </Tooltip>
          
          <CloseButton 
            onClick={onClose}
            size="large"
          >
            Close
          </CloseButton>
        </Paper>
      </DialogActions>
    </StyledDialog>
  );
};

export default LeadDetailsModal;
