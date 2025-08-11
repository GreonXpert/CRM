// src/components/leads/LeadDetailsModal.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
} from '@mui/material';
import { Print, GetApp } from '@mui/icons-material';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const LeadDetailsModal = ({ open, onClose, lead }) => {
  if (!lead) return null;

  const handleDownloadPdf = () => {
    const input = document.getElementById('lead-details-content');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth;
      const height = width / ratio;

      // Add watermark
      pdf.setFontSize(50);
      pdf.setTextColor(230, 230, 230);
      pdf.text('EBS Card', pdfWidth / 2, pdfHeight / 2, {
        angle: -45,
        align: 'center',
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, width, height > pdfHeight ? pdfHeight : height);
      pdf.save(`lead-${lead.customerName}.pdf`);
    });
  };
  
  const handlePrint = () => {
    const printContent = document.getElementById('lead-details-content').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee' }}>
        Lead Details
      </DialogTitle>
      <DialogContent dividers id="lead-details-content" sx={{ position: 'relative' }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography variant="subtitle2">Customer Name:</Typography></Grid>
            <Grid item xs={6}><Typography>{lead.customerName}</Typography></Grid>
            
            <Grid item xs={6}><Typography variant="subtitle2">Mobile Number:</Typography></Grid>
            <Grid item xs={6}><Typography>{lead.mobileNumber}</Typography></Grid>
            
            <Grid item xs={6}><Typography variant="subtitle2">PAN Card:</Typography></Grid>
            <Grid item xs={6}><Typography>{lead.panCard}</Typography></Grid>
            
            <Grid item xs={6}><Typography variant="subtitle2">Aadhar Number:</Typography></Grid>
            <Grid item xs={6}><Typography>{lead.aadharNumber}</Typography></Grid>
            
            <Grid item xs={6}><Typography variant="subtitle2">Employment Type:</Typography></Grid>
            <Grid item xs={6}><Typography>{lead.employmentType}</Typography></Grid>
            
            <Grid item xs={6}><Typography variant="subtitle2">Monthly Salary:</Typography></Grid>
            <Grid item xs={6}><Typography>₹{lead.monthlySalary}</Typography></Grid>
            
            <Grid item xs={6}><Typography variant="subtitle2">Preferred Bank:</Typography></Grid>
            <Grid item xs={6}><Typography>{lead.preferredBank || 'N/A'}</Typography></Grid>
            
            <Grid item xs={6}><Typography variant="subtitle2">Status:</Typography></Grid>
            <Grid item xs={6}><Chip label={lead.status} size="small" /></Grid>
            
            <Grid item xs={6}><Typography variant="subtitle2">Source:</Typography></Grid>
            <Grid item xs={6}><Typography>{lead.source}</Typography></Grid>
            
            <Grid item xs={6}><Typography variant="subtitle2">Created By:</Typography></Grid>
            <Grid item xs={6}><Typography>{lead.createdBy?.name || 'N/A'}</Typography></Grid>
            
            <Grid item xs={6}><Typography variant="subtitle2">Created At:</Typography></Grid>
            <Grid item xs={6}><Typography>{format(new Date(lead.createdAt), 'PPpp')}</Typography></Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button onClick={handlePrint} startIcon={<Print />}>Print</Button>
        <Button onClick={handleDownloadPdf} startIcon={<GetApp />} variant="contained">Download PDF</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadDetailsModal;
