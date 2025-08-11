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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormHelperText,
} from '@mui/material';

const EditLeadModal = ({ open, onClose, lead, onSave, isUpdating }) => {
  const [formData, setFormData] = useState(lead);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // When a new lead is passed in, update the form data
    if (lead) {
      setFormData(lead);
    }
  }, [lead]);

  // Return null if the dialog is not open or there's no lead data
  if (!open || !formData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (formData.status === 'Rejected' && !formData.rejectionReason) {
      newErrors.rejectionReason = 'Rejection reason is required when status is Rejected.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 700 }}>Edit Lead</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="Customer Name" value={formData.customerName} fullWidth disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Mobile Number" value={formData.mobileNumber} fullWidth disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={formData.status} onChange={handleChange} label="Status">
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Application Collected">Application Collected</MenuItem>
                <MenuItem value="Verification Pending">Verification Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {formData.status === 'Rejected' && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.rejectionReason}>
                  <InputLabel>Rejection Reason</InputLabel>
                  <Select name="rejectionReason" value={formData.rejectionReason || ''} onChange={handleChange} label="Rejection Reason">
                    <MenuItem value="CIBIL Issue">CIBIL Issue</MenuItem>
                    <MenuItem value="Low Income">Low Income</MenuItem>
                    <MenuItem value="Documentation Missing">Documentation Missing</MenuItem>
                    <MenuItem value="Not Interested">Not Interested</MenuItem>
                    <MenuItem value="Poor Lead">Poor Lead</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.rejectionReason && <FormHelperText>{errors.rejectionReason}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField name="rejectionNotes" label="Rejection Notes" value={formData.rejectionNotes || ''} onChange={handleChange} fullWidth multiline rows={3} />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={isUpdating}>
          {isUpdating ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLeadModal;
