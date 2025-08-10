// /src/components/common/AppInput.js
import React from 'react';
import { 
  TextField, 
  FormControl, 
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';

// ==============================================
// STYLED COMPONENTS
// ==============================================

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-error': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.error.main,
      },
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
}));

// ==============================================
// MAIN COMPONENT
// ==============================================

/**
 * Enhanced Input Component with React Hook Form integration
 * @param {Object} props - Component props
 * @param {string} props.name - Field name (required)
 * @param {Object} props.control - React Hook Form control object (required)
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.type - Input type (text, number, email, tel, etc.)
 * @param {boolean} props.required - Whether field is required
 * @param {boolean} props.disabled - Whether field is disabled
 * @param {boolean} props.multiline - Whether to render as multiline textarea
 * @param {number} props.rows - Number of rows for multiline
 * @param {boolean} props.select - Whether to render as select dropdown
 * @param {Array} props.options - Options for select dropdown
 * @param {string} props.helperText - Helper text to display
 * @param {boolean} props.error - Whether field has error
 * @param {string} props.size - Size variant (small, medium)
 * @param {boolean} props.fullWidth - Whether to take full width
 * @param {Object} props.inputProps - Additional props for input element
 * @param {Object} props.sx - Material-UI sx prop for styling
 * @param {Object} props.rules - Validation rules for React Hook Form
 */
const AppInput = ({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  multiline = false,
  rows = 4,
  select = false,
  options = [],
  helperText,
  error = false,
  size = 'medium',
  fullWidth = true,
  inputProps = {},
  sx = {},
  rules = {},
  ...rest
}) => {
  // Validation rules with required check
  const validationRules = {
    ...rules,
    ...(required && { required: `${label || name} is required` })
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field, fieldState: { error: fieldError } }) => {
        // Determine if there's an error
        const hasError = error || !!fieldError;
        const errorMessage = fieldError?.message || helperText;

        // Handle different input types
        if (select) {
          return (
            <StyledFormControl 
              fullWidth={fullWidth} 
              error={hasError}
              disabled={disabled}
              size={size}
              sx={sx}
            >
              <InputLabel required={required}>
                {label}
              </InputLabel>
              <Select
                {...field}
                label={label}
                placeholder={placeholder}
                {...rest}
              >
                {options.map((option) => (
                  <MenuItem 
                    key={option.value} 
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errorMessage && (
                <FormHelperText error={hasError}>
                  {errorMessage}
                </FormHelperText>
              )}
            </StyledFormControl>
          );
        }

        // Regular input field
        return (
          <StyledTextField
            {...field}
            label={label}
            placeholder={placeholder}
            type={type}
            required={required}
            disabled={disabled}
            error={hasError}
            helperText={errorMessage}
            multiline={multiline}
            rows={multiline ? rows : undefined}
            size={size}
            fullWidth={fullWidth}
            variant="outlined"
            inputProps={{
              ...inputProps,
              // Handle number inputs
              ...(type === 'number' && {
                min: 0,
                step: type === 'number' ? 'any' : undefined
              }),
              // Handle tel inputs
              ...(type === 'tel' && {
                pattern: '[0-9]*',
                inputMode: 'numeric'
              }),
              // Handle text transformation for PAN card
              ...(name === 'panCard' && {
                style: { textTransform: 'uppercase' }
              })
            }}
            sx={sx}
            {...rest}
            // Override onChange to handle special cases
            onChange={(e) => {
              let value = e.target.value;
              
              // Handle PAN card formatting
              if (name === 'panCard') {
                value = value.toUpperCase();
              }
              
              // Handle number inputs
              if (type === 'number') {
                // Allow empty string or valid numbers
                if (value === '' || (!isNaN(value) && !isNaN(parseFloat(value)))) {
                  field.onChange(value === '' ? '' : value);
                }
                return;
              }
              
              // Handle phone number formatting
              if (name === 'mobileNumber' || type === 'tel') {
                // Remove non-digits and limit to 10 digits
                value = value.replace(/\D/g, '').slice(0, 10);
              }
              
              // Handle Aadhar number formatting
              if (name === 'aadharNumber') {
                // Remove non-digits and limit to 12 digits
                value = value.replace(/\D/g, '').slice(0, 12);
              }
              
              field.onChange(value);
            }}
          />
        );
      }}
    />
  );
};

// ==============================================
// ENHANCED VARIANTS
// ==============================================

/**
 * AppInput variant specifically for phone numbers
 */
export const PhoneInput = (props) => (
  <AppInput
    {...props}
    type="tel"
    inputProps={{
      maxLength: 10,
      pattern: '[0-9]*',
      inputMode: 'numeric',
      ...props.inputProps
    }}
  />
);

/**
 * AppInput variant specifically for PAN card
 */
export const PANInput = (props) => (
  <AppInput
    {...props}
    name="panCard"
    inputProps={{
      maxLength: 10,
      style: { textTransform: 'uppercase' },
      ...props.inputProps
    }}
  />
);

/**
 * AppInput variant specifically for Aadhar number
 */
export const AadharInput = (props) => (
  <AppInput
    {...props}
    name="aadharNumber"
    type="tel"
    inputProps={{
      maxLength: 12,
      pattern: '[0-9]*',
      inputMode: 'numeric',
      ...props.inputProps
    }}
  />
);

/**
 * AppInput variant for currency/money inputs
 */
export const MoneyInput = (props) => (
  <AppInput
    {...props}
    type="number"
    inputProps={{
      min: 0,
      step: 1,
      ...props.inputProps
    }}
  />
);

/**
 * AppInput variant for search inputs
 */
export const SearchInput = (props) => (
  <AppInput
    {...props}
    type="search"
    placeholder="Search..."
    inputProps={{
      autoComplete: 'off',
      ...props.inputProps
    }}
  />
);

// ==============================================
// HELPER COMPONENT - Form Section
// ==============================================

/**
 * Form Section component for grouping related fields
 */
export const FormSection = ({ title, subtitle, children, sx = {} }) => (
  <Box sx={{ mb: 4, ...sx }}>
    {title && (
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
    )}
    {subtitle && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {subtitle}
      </Typography>
    )}
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {children}
    </Box>
  </Box>
);

export default AppInput;