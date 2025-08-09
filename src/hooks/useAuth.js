// /src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * A custom hook to provide easy access to the AuthContext.
 */
export const useAuth = () => { // Changed to a named export
  return useContext(AuthContext);
};

// The default export is removed.
