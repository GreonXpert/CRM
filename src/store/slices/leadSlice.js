// src/store/slices/leadSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leads: [],
  isLoading: false,
  error: null,
};

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads: (state, action) => {
      state.leads = action.payload;
    },
    addLead: (state, action) => {
      state.leads.push(action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLeads, addLead, setLoading, setError } = leadSlice.actions;

export default leadSlice.reducer;
