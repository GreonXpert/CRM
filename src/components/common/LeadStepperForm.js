// /src/components/common/LeadStepperForm.js
import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Stack,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

// Icons
import { PersonPin, CreditCard, FactCheck, CheckCircle } from '@mui/icons-material';

// Import Custom Components
import AppInput from './AppInput';
import AppButton from './AppButton';

// Import Hooks
import { useLeads } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';

// --- Styled Components ---
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
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

// Individual schemas for each step
const stepSchemas = [
  yup.object().shape({
    customerName: yup.string()
      .required('Customer name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),
    mobileNumber: yup.string()
      .matches(/^[0-9]{10}$/, 'Must be a valid 10-digit number')
      .required('Mobile number is required'),
  }),
  yup.object().shape({
    panCard: yup.string()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)')
      .required('PAN card is required'),
    aadharNumber: yup.string()
      .matches(/^[0-9]{12}$/, 'Must be a 12-digit number')
      .required('Aadhar card is required'),
  }),
  yup.object().shape({
    preferredBank: yup.string()
      .required('Please select a preferred bank'),
    employmentType: yup.string()
      .oneOf(['Salaried', 'Self-Employed'], 'Please select a valid employment type')
      .required('Employment type is required'),
    monthlySalary: yup.number()
      .typeError('Must be a valid number')
      .positive('Salary must be positive')
      .nullable()
      .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value),
  }),
];

// Combined schema for final validation
const completeSchema = yup.object().shape({
  ...stepSchemas[0].fields,
  ...stepSchemas[1].fields,
  ...stepSchemas[2].fields,
});

// --- Form Content for Each Step ---
const getStepContent = (step, control, errors) => {
  switch (step) {
    case 0:
      return (
        <>
          <AppInput 
            name="customerName" 
            control={control} 
            label="Customer Name" 
            required
            error={!!errors?.customerName}
            helperText={errors?.customerName?.message}
          />
          <AppInput 
            name="mobileNumber" 
            control={control} 
            label="Mobile Number" 
            required
            type="tel"
            error={!!errors?.mobileNumber}
            helperText={errors?.mobileNumber?.message}
          />
        </>
      );
    case 1:
      return (
        <>
          <AppInput 
            name="panCard" 
            control={control} 
            label="PAN Card Number" 
            required
            placeholder="ABCDE1234F"
            style={{ textTransform: 'uppercase' }}
            error={!!errors?.panCard}
            helperText={errors?.panCard?.message}
          />
          <AppInput 
            name="aadharNumber" 
            control={control} 
            label="Aadhar Card Number" 
            required
            type="tel"
            placeholder="123456789012"
            error={!!errors?.aadharNumber}
            helperText={errors?.aadharNumber?.message}
          />
        </>
      );
    case 2:
      return (
        <>
          <AppInput 
            name="preferredBank" 
            control={control} 
            label="Preferred Bank" 
            required
            error={!!errors?.preferredBank}
            helperText={errors?.preferredBank?.message}
          />
          <AppInput 
            name="employmentType" 
            control={control} 
            label="Employment Type" 
            required
            select
            options={[
              { value: 'Salaried', label: 'Salaried' },
              { value: 'Self-Employed', label: 'Self-Employed' }
            ]}
            error={!!errors?.employmentType}
            helperText={errors?.employmentType?.message}
          />
          <AppInput 
            name="monthlySalary" 
            control={control} 
            label="Monthly Salary (Optional)" 
            type="number"
            error={!!errors?.monthlySalary}
            helperText={errors?.monthlySalary?.message}
          />
        </>
      );
    default:
      return 'Unknown step';
  }
};

/**
 * An enhanced multi-step form for creating leads with improved validation and UX.
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to call with the final form data when submitted
 * @param {Object} props.initialData - Initial form data (optional)
 * @param {boolean} props.isSharedForm - Whether this is a shared form (from link)
 * @param {string} props.userId - User ID for shared forms
 */
const LeadStepperForm = ({ 
  onSubmit, 
  initialData = {}, 
  isSharedForm = false, 
  userId = null 
}) => {
  // State
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Hooks
  const { createLead } = useLeads();
  const { user } = useAuth();

  // Form setup
  const methods = useForm({
    resolver: yupResolver(stepSchemas[activeStep]),
    mode: 'onChange',
    defaultValues: {
      customerName: '',
      mobileNumber: '',
      panCard: '',
      aadharNumber: '',
      preferredBank: '',
      employmentType: '',
      monthlySalary: '',
      ...initialData
    }
  });

  const { 
    handleSubmit, 
    trigger, 
    control, 
    formState: { errors, isValid }, 
    getValues,
    setError: setFormError
  } = methods;

  // Handle Next Button
  const handleNext = async () => {
    try {
      // Trigger validation for current step
      const isStepValid = await trigger();
      
      if (isStepValid) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        console.log('Validation failed for step:', activeStep, errors);
      }
    } catch (error) {
      console.error('Error during step validation:', error);
    }
  };

  // Handle Back Button
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle Form Submission
  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Final validation with complete schema
      await completeSchema.validate(data, { abortEarly: false });

      // Transform data if needed
      const formattedData = {
        ...data,
        panCard: data.panCard.toUpperCase(),
        monthlySalary: data.monthlySalary || undefined,
      };

      // Call the appropriate API based on form type
      let result;
      if (isSharedForm && userId) {
        // Call shared link API
        result = await createLead(formattedData, userId, true);
      } else {
        // Call regular API
        result = await createLead(formattedData);
      }

      if (result) {
        setSubmitSuccess(true);
        
        // Call parent onSubmit if provided
        if (onSubmit) {
          onSubmit(result);
        }

        // Reset form after successful submission
        setTimeout(() => {
          methods.reset();
          setActiveStep(0);
          setSubmitSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      if (error.inner) {
        // Yup validation errors
        error.inner.forEach((err) => {
          setFormError(err.path, { message: err.message });
        });
      } else if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle error close
  const handleErrorClose = () => {
    setSubmitError('');
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, position: 'relative' }}>
        {/* Loading Backdrop */}
        <Backdrop
          sx={{ 
            position: 'absolute', 
            zIndex: 10, 
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.8)' 
          }}
          open={isSubmitting}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2 }}>
              {isSharedForm ? 'Submitting your information...' : 'Creating lead...'}
            </Typography>
          </Box>
        </Backdrop>

        {/* Success Message */}
        {submitSuccess && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 4,
              zIndex: 10
            }}
          >
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" color="success.main" align="center">
              {isSharedForm ? 'Information Submitted Successfully!' : 'Lead Created Successfully!'}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              {isSharedForm ? 'Thank you for providing your information.' : 'The lead has been added to the system.'}
            </Typography>
          </Box>
        )}

        {/* Stepper */}
        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form */}
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
                  {getStepContent(activeStep, control, errors)}
                </Stack>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
              <AppButton
                variant="secondary"
                disabled={activeStep === 0 || isSubmitting}
                onClick={handleBack}
              >
                Back
              </AppButton>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length - 1 ? (
                <AppButton 
                  variant="primary" 
                  type="submit" 
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Lead'}
                </AppButton>
              ) : (
                <AppButton 
                  variant="primary" 
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next
                </AppButton>
              )}
            </Box>
          </Box>
        </FormProvider>
      </Paper>

      {/* Error Snackbar */}
      <Snackbar
        open={!!submitError}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {submitError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LeadStepperForm;