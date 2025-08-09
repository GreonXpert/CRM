// /src/components/common/AppInput.js
import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff, Search } from '@mui/icons-material';

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'inputVariant',
})(({ theme, inputVariant = 'standard' }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    
    // --- Variant Styles ---

    // 1. Standard Variant (Default)
    ...(inputVariant === 'standard' && {
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}30`, // Soft glow on focus
      },
    }),

    // 2. Filled Variant
    ...(inputVariant === 'filled' && {
      backgroundColor: theme.palette.background.default,
      '& fieldset': {
        border: 'none',
      },
      '&:hover': {
        backgroundColor: '#E9ECEF',
      },
      '&.Mui-focused': {
        backgroundColor: '#FFFFFF',
        '& fieldset': {
            border: `1px solid ${theme.palette.primary.main}`,
        }
      },
    }),
    
    // 3. Search Variant
    ...(inputVariant === 'search' && {
      backgroundColor: theme.palette.background.default,
      borderRadius: '50px', // Pill shape for search bars
      '& fieldset': {
        border: 'none',
      },
      '&.Mui-focused': {
        backgroundColor: '#FFFFFF',
        '& fieldset': {
            border: `1px solid ${theme.palette.primary.main}`,
        }
      },
    }),
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

/**
 * A versatile, styled text input component.
 * @param {string} inputVariant - The style of the input. Can be 'standard', 'filled', or 'search'.
 * @param {string} type - The input type, e.g., 'text', 'password', 'email'.
 * @param {object} otherProps - Any other props to pass to the MUI TextField component (label, value, onChange, etc.).
 */
const AppInput = ({ inputVariant, type, ...otherProps }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const adornment = {
    // For password fields, show the visibility toggle
    ...(type === 'password' && {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleTogglePassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }),
    // For search fields, show the search icon
    ...(inputVariant === 'search' && {
        startAdornment: (
            <InputAdornment position="start">
                <Search color="action" />
            </InputAdornment>
        )
    })
  };

  return (
    <StyledTextField
      fullWidth
      variant="outlined" // MUI's base variant
      inputVariant={inputVariant} // Our custom prop for styling
      type={inputType}
      InputProps={adornment}
      {...otherProps}
    />
  );
};

export default AppInput;
