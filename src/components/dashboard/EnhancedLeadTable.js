// /src/components/dashboard/EnhancedLeadTable.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Avatar,
  useTheme,
  styled,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Download,
  Print,
  Person,
  Phone,
  CreditCard,
  CalendarToday,
} from '@mui/icons-material';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Styled Components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderBottom: 'none',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(103, 126, 234, 0.04)',
  },
  '&:hover': {
    backgroundColor: 'rgba(103, 126, 234, 0.08)',
    transform: 'scale(1.001)',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
  fontWeight: 600,
  borderRadius: 16,
  ...(status === 'Approved' && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  }),
  ...(status === 'Rejected' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  }),
  ...(status === 'Follow-up' && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  }),
  ...(status === 'New' && {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.dark,
  }),
}));

// Lead Detail Card for PDF Generation
const LeadDetailCard = ({ lead, onClose }) => {
  const theme = useTheme();
  
  return (
    <Box
      id="lead-detail-card"
      sx={{
        width: 400,
        p: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        color: 'white',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1,
        }}
      />
      
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            EBS CARDS
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Lead Information Card
          </Typography>
        </Box>

        {/* Lead Details */}
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Customer Name
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {lead.customerName}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              <Phone />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Mobile Number
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {lead.mobileNumber}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              <CreditCard />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                PAN Card
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {lead.panCard}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              <CalendarToday />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Date Created
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <StatusChip
              status={lead.status}
              label={lead.status}
              sx={{ color: 'white !important', backgroundColor: 'rgba(255,255,255,0.2)' }}
            />
          </Box>
        </Stack>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Created by: {lead.createdBy?.name || 'System'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const EnhancedLeadTable = ({ leads, loading, onEdit, onDelete, userRole }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOpen = (lead) => {
    setSelectedLead(lead);
    setViewModalOpen(true);
  };

  const handleDeleteOpen = (lead) => {
    setSelectedLead(lead);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedLead) {
      onDelete(selectedLead._id);
    }
    setDeleteModalOpen(false);
    setSelectedLead(null);
  };

  const handleDownloadPDF = async (lead) => {
    setDownloading(true);
    try {
      // Create a temporary container for the lead card
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);

      // Render the lead detail card in the temp container
      const cardElement = document.createElement('div');
      cardElement.innerHTML = `
        <div style="
          width: 400px;
          padding: 24px;
          background: linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
          color: white;
          border-radius: 12px;
          font-family: 'Roboto', sans-serif;
        ">
          <div style="text-align: center; margin-bottom: 24px;">
            <h3 style="margin: 0 0 8px 0; font-weight: 700;">EBS CARDS</h3>
            <p style="margin: 0; opacity: 0.9; font-size: 14px;">Lead Information Card</p>
          </div>
          
          <div style="margin-bottom: 16px;">
            <p style="margin: 0 0 4px 0; opacity: 0.8; font-size: 12px;">Customer Name</p>
            <h4 style="margin: 0; font-weight: 600;">${lead.customerName}</h4>
          </div>
          
          <div style="margin-bottom: 16px;">
            <p style="margin: 0 0 4px 0; opacity: 0.8; font-size: 12px;">Mobile Number</p>
            <p style="margin: 0; font-weight: 600;">${lead.mobileNumber}</p>
          </div>
          
          <div style="margin-bottom: 16px;">
            <p style="margin: 0 0 4px 0; opacity: 0.8; font-size: 12px;">PAN Card</p>
            <p style="margin: 0; font-weight: 600;">${lead.panCard}</p>
          </div>
          
          <div style="margin-bottom: 16px;">
            <p style="margin: 0 0 4px 0; opacity: 0.8; font-size: 12px;">Date Created</p>
            <p style="margin: 0; font-weight: 600;">${format(new Date(lead.createdAt), 'MMM dd, yyyy')}</p>
          </div>
          
          <div style="text-align: center; margin: 16px 0;">
            <span style="
              display: inline-block;
              padding: 4px 12px;
              background: rgba(255,255,255,0.2);
              border-radius: 16px;
              font-weight: 600;
              font-size: 12px;
            ">${lead.status}</span>
          </div>
          
          <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.2);">
            <p style="margin: 0; opacity: 0.7; font-size: 11px;">Created by: ${lead.createdBy?.name || 'System'}</p>
          </div>
        </div>
      `;
      
      tempContainer.appendChild(cardElement);

      // Convert to canvas and then to PDF
      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const x = (210 - imgWidth) / 2; // Center horizontally
      const y = 30;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`${lead.customerName}_Lead_Details.pdf`);

      // Clean up
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = (lead) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lead Details - ${lead.customerName}</title>
        <style>
          body { 
            font-family: 'Roboto', Arial, sans-serif; 
            margin: 20px;
            background: linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
            color: white;
          }
          .card {
            max-width: 400px;
            margin: 0 auto;
            padding: 24px;
            border-radius: 12px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
          }
          .header { text-align: center; margin-bottom: 24px; }
          .field { margin-bottom: 16px; }
          .label { opacity: 0.8; font-size: 12px; margin-bottom: 4px; }
          .value { font-weight: 600; }
          .status { 
            text-align: center; 
            padding: 4px 12px; 
            background: rgba(255,255,255,0.2); 
            border-radius: 16px; 
            display: inline-block;
            margin: 16px 0;
          }
          .footer { 
            text-align: center; 
            margin-top: 24px; 
            padding-top: 16px; 
            border-top: 1px solid rgba(255,255,255,0.2);
            opacity: 0.7;
            font-size: 11px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2>EBS CARDS</h2>
            <p>Lead Information Card</p>
          </div>
          <div class="field">
            <div class="label">Customer Name</div>
            <div class="value">${lead.customerName}</div>
          </div>
          <div class="field">
            <div class="label">Mobile Number</div>
            <div class="value">${lead.mobileNumber}</div>
          </div>
          <div class="field">
            <div class="label">PAN Card</div>
            <div class="value">${lead.panCard}</div>
          </div>
          <div class="field">
            <div class="label">Date Created</div>
            <div class="value">${format(new Date(lead.createdAt), 'MMM dd, yyyy')}</div>
          </div>
          <div style="text-align: center;">
            <span class="status">${lead.status}</span>
          </div>
          <div class="footer">
            Created by: ${lead.createdBy?.name || 'System'}
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const paginatedLeads = leads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Customer Name</StyledTableCell>
              <StyledTableCell>Mobile</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Date Added</StyledTableCell>
              <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLeads.map((lead) => (
              <StyledTableRow key={lead._id}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {lead.customerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {lead.panCard}
                  </Typography>
                </TableCell>
                <TableCell>{lead.mobileNumber}</TableCell>
                <TableCell>
                  <StatusChip status={lead.status} label={lead.status} size="small" />
                </TableCell>
                <TableCell>
                  {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {lead.createdBy?.name || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {lead.createdBy?.email || ''}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        onClick={() => handleViewOpen(lead)} 
                        size="small" 
                        color="primary"
                        sx={{ '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Lead">
                      <IconButton 
                        onClick={() => onEdit(lead)} 
                        size="small" 
                        color="secondary"
                        sx={{ '&:hover': { backgroundColor: 'secondary.light', color: 'white' } }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Lead">
                      <IconButton 
                        onClick={() => handleDeleteOpen(lead)} 
                        size="small" 
                        color="error"
                        sx={{ '&:hover': { backgroundColor: 'error.light', color: 'white' } }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={leads.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'rgba(103, 126, 234, 0.02)',
        }}
      />

      {/* View Modal */}
      <Dialog 
        open={viewModalOpen} 
        onClose={() => setViewModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          Lead Details
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          {selectedLead && <LeadDetailCard lead={selectedLead} />}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 2 }}>
          <Button
            startIcon={downloading ? <CircularProgress size={16} /> : <Download />}
            onClick={() => handleDownloadPDF(selectedLead)}
            disabled={downloading}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': { 
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {downloading ? 'Generating...' : 'Download PDF'}
          </Button>
          <Button
            startIcon={<Print />}
            onClick={() => handlePrint(selectedLead)}
            variant="outlined"
          >
            Print
          </Button>
          <Button onClick={() => setViewModalOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Delete Lead</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the lead for{' '}
            <strong>{selectedLead?.customerName}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EnhancedLeadTable;