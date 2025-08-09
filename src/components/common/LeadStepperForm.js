// /src/components/common/LeadStepperForm.js
import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Box, Typography, StepConnector, stepConnectorClasses, styled, Paper, Stack } from '@mui/material';
import { PersonPin, CreditCard, FactCheck } from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';

// Import your custom components
import AppButton from './AppButton';
import AppInput from './AppInput';

// --- Styled Components for the Stepper ---
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.3s ease-in-out',
  ...(ownerState.active && {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;
  const icons = {
    1: <PersonPin />,
    2: <CreditCard />,
    3: <FactCheck />,
  };
  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

// --- Validation Schemas for Each Step ---
const steps = ['Personal Details', 'Financial Identity', 'Bank Preference'];
const schemas = [
  yup.object().shape({
    customerName: yup.string().required('Customer name is required'),
    mobileNumber: yup.string().matches(/^[0-9]{10}$/, 'Must be a valid 10-digit number').required('Mobile number is required'),
  }),
  yup.object().shape({
    panCard: yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').required('PAN card is required'),
    aadharNumber: yup.string().matches(/^[0-9]{12}$/, 'Must be a 12-digit number').required('Aadhar card is required'),
  }),
  yup.object().shape({
    preferredBank: yup.string().required('Please select a preferred bank'),
    employmentType: yup.string().required('Employment type is required'),
    monthlySalary: yup.number().typeError('Must be a number').positive('Salary must be positive').optional(),
  }),
];

// --- Form Content for Each Step ---
const getStepContent = (step, control) => {
  switch (step) {
    case 0:
      return (
        <>
          <AppInput name="customerName" control={control} label="Customer Name" />
          <AppInput name="mobileNumber" control={control} label="Mobile Number" />
        </>
      );
    case 1:
      return (
        <>
          <AppInput name="panCard" control={control} label="PAN Card Number" />
          <AppInput name="aadharNumber" control={control} label="Aadhar Card Number" />
        </>
      );
    case 2:
      return (
        <>
          <AppInput name="preferredBank" control={control} label="Preferred Bank" />
          <AppInput name="employmentType" control={control} label="Employment Type (e.g., Salaried)" />
          <AppInput name="monthlySalary" control={control} label="Monthly Salary (Optional)" type="number" />
        </>
      );
    default:
      return 'Unknown step';
  }
};

/**
 * An attractive, multi-step form for creating leads.
 * @param {func} onSubmit - A function to call with the final form data when submitted.
 */
const LeadStepperForm = ({ onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = schemas[activeStep];
  
  const methods = useForm({
    resolver: yupResolver(currentValidationSchema),
    mode: 'onChange', // Validate on change for instant feedback
  });
  
  const { handleSubmit, trigger, control } = methods;

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const onFormSubmit = (data) => {
    console.log('Final form data:', data);
    onSubmit(data); // Pass data to the parent component
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 4 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Stack spacing={3}>
                {getStepContent(activeStep, control)}
              </Stack>
            </motion.div>
          </AnimatePresence>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
            <AppButton
              variant="secondary"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </AppButton>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? (
              <AppButton variant="primary" type="submit">
                Submit Lead
              </AppButton>
            ) : (
              <AppButton variant="primary" onClick={handleNext}>
                Next
              </AppButton>
            )}
          </Box>
        </Box>
      </FormProvider>
    </Paper>
  );
};

export default LeadStepperForm;
