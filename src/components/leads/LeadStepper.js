// src/components/leads/LeadStepper.js
import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  Slide,
  Paper,
  Chip,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person,
  Business,
  AccountBalance,
  Phone,
  CreditCard,
  Fingerprint,
  Work,
  AttachMoney,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  Info,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const steps = ['Personal Details', 'Employment Info', 'Bank Preference'];

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 10px 40px rgba(99, 102, 241, 0.1)',
  border: `1px solid ${theme.palette.grey[100]}`,
  overflow: 'visible',
}));

const StepperContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: 16,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
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
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  '& .MuiStepConnector-root': {
    top: 22,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
    '& .MuiStepConnector-line': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderTopWidth: 2,
    },
  },
  '& .MuiStepConnector-active .MuiStepConnector-line': {
    borderColor: 'white',
  },
  '& .MuiStepConnector-completed .MuiStepConnector-line': {
    borderColor: 'white',
  },
}));

const StepIconContainer = styled(Box)(({ theme, active, completed }) => ({
  width: 50,
  height: 50,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: completed || active ? 'white' : 'rgba(255, 255, 255, 0.3)',
  color: completed || active ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.8)',
  boxShadow: completed || active ? '0 4px 20px rgba(255, 255, 255, 0.3)' : 'none',
  transition: 'all 0.3s ease',
  transform: active ? 'scale(1.1)' : 'scale(1)',
}));

const StyledStepLabel = styled(Typography)(({ theme, active }) => ({
  color: 'white',
  fontWeight: active ? 600 : 400,
  fontSize: '0.875rem',
  textAlign: 'center',
  marginTop: theme.spacing(1),
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
}));

const FormSection = styled(Box)(({ theme }) => ({
  minHeight: 350,
  padding: theme.spacing(3),
  position: 'relative',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  borderRadius: 12,
  border: `1px solid ${theme.palette.primary.main}20`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    '&:hover': {
      backgroundColor: 'white',
      boxShadow: `0 4px 12px rgba(99, 102, 241, 0.1)`,
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: `0 4px 20px rgba(99, 102, 241, 0.15)`,
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
      boxShadow: `0 4px 12px rgba(99, 102, 241, 0.1)`,
    },
    '&.Mui-focused': {
      backgroundColor: 'white',
      boxShadow: `0 4px 20px rgba(99, 102, 241, 0.15)`,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
}));

const NextButton = styled(ActionButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  boxShadow: `0 4px 15px rgba(99, 102, 241, 0.3)`,
  '&:hover': {
    boxShadow: `0 6px 20px rgba(99, 102, 241, 0.4)`,
    transform: 'translateY(-2px)',
  },
}));

const BackButton = styled(ActionButton)(({ theme }) => ({
  color: theme.palette.grey[600],
  border: `2px solid ${theme.palette.grey[200]}`,
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
    borderColor: theme.palette.grey[300],
    transform: 'translateY(-1px)',
  },
}));

const LeadStepper = ({ onLeadCreate, isCreating }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    panCard: '',
    aadharNumber: '',
    employmentType: 'Salaried',
    monthlySalary: '',
    preferredBank: '',
  });
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};
    if (activeStep === 0) {
      if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
      if (!/^[0-9]{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'A valid 10-digit mobile number is required';
      if (!formData.panCard.trim()) newErrors.panCard = 'PAN card is required';
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard)) newErrors.panCard = 'PAN format should be ABCDE1234F';
      if (!formData.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhar number is required';
      if (!/^[0-9]{12}$/.test(formData.aadharNumber)) newErrors.aadharNumber = 'Aadhar should be 12 digits';
    }
    if (activeStep === 1) {
      if (!formData.employmentType) newErrors.employmentType = 'Employment type is required';
      if (!formData.monthlySalary || formData.monthlySalary <= 0) newErrors.monthlySalary = 'A valid monthly salary is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // PAN card - only capital letters and numbers
    if (name === 'panCard') {
      processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (processedValue.length > 10) processedValue = processedValue.slice(0, 10);
    }
    
    // Mobile number - only numbers
    if (name === 'mobileNumber') {
      processedValue = value.replace(/[^0-9]/g, '');
      if (processedValue.length > 10) processedValue = processedValue.slice(0, 10);
    }
    
    // Aadhar - only numbers
    if (name === 'aadharNumber') {
      processedValue = value.replace(/[^0-9]/g, '');
      if (processedValue.length > 12) processedValue = processedValue.slice(0, 12);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onLeadCreate(formData);
    }
  };

  const getStepContent = (step) => {
    const sectionIcons = [
      <Person sx={{ fontSize: 28, color: 'primary.main' }} />,
      <Business sx={{ fontSize: 28, color: 'primary.main' }} />,
      <AccountBalance sx={{ fontSize: 28, color: 'primary.main' }} />
    ];

    const sectionTitles = [
      'Personal Information',
      'Employment Details',
      'Banking Preferences'
    ];

    const sectionDescriptions = [
      'Please provide your personal identification details',
      'Tell us about your employment and income',
      'Select your preferred banking partner'
    ];

    switch (step) {
      case 0:
        return (
          <Fade in={activeStep === 0} timeout={500}>
            <Box>
              <SectionHeader>
                {sectionIcons[0]}
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    {sectionTitles[0]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {sectionDescriptions[0]}
                  </Typography>
                </Box>
              </SectionHeader>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    name="customerName"
                    label="Full Customer Name"
                    value={formData.customerName}
                    onChange={handleChange}
                    error={!!errors.customerName}
                    helperText={errors.customerName}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    name="mobileNumber"
                    label="Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber || `${formData.mobileNumber.length}/10 digits`}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="panCard"
                    label="PAN Card Number"
                    value={formData.panCard}
                    onChange={handleChange}
                    error={!!errors.panCard}
                    helperText={errors.panCard || `${formData.panCard.length}/10 characters (Format: ABCDE1234F)`}
                    fullWidth
                    placeholder="ABCDE1234F"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCard color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    name="aadharNumber"
                    label="Aadhar Number"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    error={!!errors.aadharNumber}
                    helperText={errors.aadharNumber || `${formData.aadharNumber.length}/12 digits`}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Fingerprint color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );
      case 1:
        return (
          <Fade in={activeStep === 1} timeout={500}>
            <Box>
              <SectionHeader>
                {sectionIcons[1]}
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    {sectionTitles[1]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {sectionDescriptions[1]}
                  </Typography>
                </Box>
              </SectionHeader>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledFormControl fullWidth error={!!errors.employmentType}>
                    <InputLabel>Employment Type</InputLabel>
                    <Select
                      name="employmentType"
                      value={formData.employmentType}
                      label="Employment Type"
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <Work color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="Salaried">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          💼 Salaried Employee
                        </Box>
                      </MenuItem>
                      <MenuItem value="Self-Employed">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          🏢 Self-Employed
                        </Box>
                      </MenuItem>
                    </Select>
                  </StyledFormControl>
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    name="monthlySalary"
                    label="Monthly Salary/Income"
                    type="number"
                    value={formData.monthlySalary}
                    onChange={handleChange}
                    error={!!errors.monthlySalary}
                    helperText={errors.monthlySalary || 'Enter your monthly income in ₹'}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );
      case 2:
        return (
          <Fade in={activeStep === 2} timeout={500}>
            <Box>
              <SectionHeader>
                {sectionIcons[2]}
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    {sectionTitles[2]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {sectionDescriptions[2]}
                  </Typography>
                </Box>
              </SectionHeader>
              <StyledTextField
                name="preferredBank"
                label="Preferred Bank (Optional)"
                value={formData.preferredBank}
                onChange={handleChange}
                fullWidth
                placeholder="e.g., State Bank of India, HDFC Bank, ICICI Bank"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalance color="action" />
                    </InputAdornment>
                  ),
                }}
                helperText="This helps us process your application faster"
              />
            </Box>
          </Fade>
        );
      default:
        return 'Unknown step';
    }
  };

  const getStepIcon = (index) => {
    const icons = [<Person />, <Business />, <AccountBalance />];
    return icons[index];
  };

  return (
    <StyledCard>
      <CardContent sx={{ p: 0 }}>
        {/* Enhanced Stepper Header */}
        <StepperContainer>
          <StyledStepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={() => (
                    <StepIconContainer
                      active={activeStep === index}
                      completed={activeStep > index}
                    >
                      {activeStep > index ? (
                        <CheckCircle sx={{ fontSize: 24 }} />
                      ) : (
                        getStepIcon(index)
                      )}
                    </StepIconContainer>
                  )}
                >
                  <StyledStepLabel active={activeStep === index}>
                    {label}
                  </StyledStepLabel>
                </StepLabel>
              </Step>
            ))}
          </StyledStepper>
        </StepperContainer>

        {/* Form Content */}
        <FormSection>
          <Slide direction="left" in={true} timeout={300}>
            <Box>
              {getStepContent(activeStep)}
            </Box>
          </Slide>
        </FormSection>

        {/* Action Buttons */}
        <Box sx={{ p: 3, pt: 0 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'grey.50',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <BackButton
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
            >
              Previous
            </BackButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={`Step ${activeStep + 1} of ${steps.length}`}
                color="primary"
                variant="outlined"
                size="small"
              />
              <Tooltip title="Form validation will be checked before proceeding">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {activeStep === steps.length - 1 ? (
              <NextButton
                onClick={handleSubmit}
                disabled={isCreating}
                startIcon={isCreating ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                {isCreating ? 'Creating...' : 'Create Lead'}
              </NextButton>
            ) : (
              <NextButton onClick={handleNext} endIcon={<ArrowForward />}>
                Continue
              </NextButton>
            )}
          </Paper>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default LeadStepper;
