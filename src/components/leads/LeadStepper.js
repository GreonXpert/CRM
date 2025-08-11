// src/components/leads/LeadStepper.js
import React,
 
{ useState } from 'react';
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
  alpha,
  Avatar,
} from '@mui/material';
import { Person, Business, MonetizationOn } from '@mui/icons-material';

const steps = ['Personal Details', 'Employment Info', 'Bank Preference'];

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
      if (!formData.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhar number is required';
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onLeadCreate(formData);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="customerName"
                label="Customer Name"
                value={formData.customerName}
                onChange={handleChange}
                error={!!errors.customerName}
                helperText={errors.customerName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="mobileNumber"
                label="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="panCard"
                label="PAN Card"
                value={formData.panCard}
                onChange={handleChange}
                error={!!errors.panCard}
                helperText={errors.panCard}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="aadharNumber"
                label="Aadhar Number"
                value={formData.aadharNumber}
                onChange={handleChange}
                error={!!errors.aadharNumber}
                helperText={errors.aadharNumber}
                fullWidth
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                >
                  <MenuItem value="Salaried">Salaried</MenuItem>
                  <MenuItem value="Self-Employed">Self-Employed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="monthlySalary"
                label="Monthly Salary"
                type="number"
                value={formData.monthlySalary}
                onChange={handleChange}
                error={!!errors.monthlySalary}
                helperText={errors.monthlySalary}
                fullWidth
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <TextField
            name="preferredBank"
            label="Preferred Bank (Optional)"
            value={formData.preferredBank}
            onChange={handleChange}
            fullWidth
          />
        );
      default:
        return 'Unknown step';
    }
  };

  const getStepIcon = (index) => {
    const icons = {
      0: <Person />,
      1: <Business />,
      2: <MonetizationOn />,
    };
    return icons[index];
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={() => (
              <Avatar sx={{ 
                bgcolor: activeStep >= index ? 'primary.main' : 'grey.300',
                color: 'white'
              }}>
                {getStepIcon(index)}
              </Avatar>
            )}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4, mb: 2, p: 3, minHeight: 200 }}>
        {getStepContent(activeStep)}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleSubmit} variant="contained" disabled={isCreating}>
            {isCreating ? <CircularProgress size={24} /> : 'Create Lead'}
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default LeadStepper;
