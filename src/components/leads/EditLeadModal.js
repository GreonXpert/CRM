// src/components/leads/EditLeadModal.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { useUpdateLeadMutation } from '../../store/api/leadApi';

const EditLeadModal = ({ open, onClose, lead }) => {
  const [formData, setFormData] = useState({});
  const [updateLead, { isLoading }] = useUpdateLeadMutation();

  useEffect(() => {
    if (lead) {
      setFormData({
        id: lead._id,
        customerName: lead.customerName || '',
        mobileNumber: lead.mobileNumber || '',
        panCard: lead.panCard || '',
        aadharNumber: lead.aadharNumber || '',
        employmentType: lead.employmentType || 'Salaried',
        monthlySalary: lead.monthlySalary || '',
        preferredBank: lead.preferredBank || '',
        status: lead.status || 'New',
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateLead(formData).unwrap();
      onClose(true); // Pass true to indicate success
    } catch (error) {
      console.error('Failed to update lead:', error);
      onClose(false); // Pass false to indicate failure
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="sm">
      <DialogTitle>Edit Lead</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="customerName"
              label="Customer Name"
              value={formData.customerName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="mobileNumber"
              label="Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="panCard"
              label="PAN Card"
              value={formData.panCard}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="aadharNumber"
              label="Aadhar Number"
              value={formData.aadharNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <TextField
              name="monthlySalary"
              label="Monthly Salary"
              type="number"
              value={formData.monthlySalary}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="preferredBank"
              label="Preferred Bank (Optional)"
              value={formData.preferredBank}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Follow-up">Follow-up</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLeadModal;