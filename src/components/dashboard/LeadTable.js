// /src/components/dashboard/LeadTable.js
import React, { useState, useRef } from 'react';
import { Box, IconButton, Tooltip, Dialog, DialogContent, Typography, Stack, Avatar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled, useTheme } from '@mui/material/styles';
import { Edit, Delete, Visibility, Print, FileDownload } from '@mui/icons-material';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useReactToPrint } from 'react-to-print';

// Import your custom components
import AppButton from '../common/AppButton';
import ConfirmationModal from '../common/ConfirmationModal';

// --- Styled DataGrid ---
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: `${theme.palette.primary.main}10`, // Light blue on hover
  },
  // Disable cell focus outline
  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
}));

// --- Lead View Modal Component ---
const LeadViewModal = ({ open, onClose, lead }) => {
  const theme = useTheme();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Lead Details", 14, 22);
    
    const leadData = [
        ["Customer Name", lead.customerName],
        ["Mobile Number", lead.mobileNumber],
        ["PAN Card", lead.panCard],
        ["Aadhar Number", lead.aadharNumber],
        ["Status", lead.status],
        ["Preferred Bank", lead.preferredBank],
        ["Created By", lead.createdBy.name],
        ["Created On", format(new Date(lead.createdAt), 'PPpp')],
    ];
    
    doc.autoTable({
      startY: 30,
      head: [['Field', 'Value']],
      body: leadData,
      theme: 'grid',
      headStyles: { fillColor: [theme.palette.primary.main] },
    });

    doc.save(`Lead_${lead.customerName}.pdf`);
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogContent>
        <Box ref={componentRef} sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>{lead.customerName.charAt(0)}</Avatar>
            <Box>
              <Typography variant="h2" component="div">{lead.customerName}</Typography>
              <Typography variant="body2" color="text.secondary">{lead.status}</Typography>
            </Box>
          </Stack>
          
          <Stack spacing={1.5}>
            <Typography><strong>Mobile:</strong> {lead.mobileNumber}</Typography>
            <Typography><strong>PAN:</strong> {lead.panCard}</Typography>
            <Typography><strong>Aadhar:</strong> {lead.aadharNumber}</Typography>
            <Typography><strong>Bank:</strong> {lead.preferredBank}</Typography>
            <Typography><strong>Created By:</strong> {lead.createdBy.name} ({lead.createdBy.email})</Typography>
            <Typography><strong>Date Added:</strong> {format(new Date(lead.createdAt), 'PPpp')}</Typography>
          </Stack>
        </Box>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <AppButton variant="secondary" onClick={handlePrint} startIcon={<Print />}>Print</AppButton>
            <AppButton variant="primary" onClick={handleDownloadPdf} startIcon={<FileDownload />}>Download PDF</AppButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};


/**
 * An attractive and innovative table for displaying leads.
 * @param {array} leads - The array of lead data.
 * @param {func} onEdit - Function to call when edit button is clicked.
 * @param {func} onDelete - Function to call when delete button is clicked.
 */
const LeadTable = ({ leads, onEdit, onDelete }) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

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
      onDelete(selectedLead.id);
    }
    setDeleteModalOpen(false);
  };

  const columns = [
    { field: 'customerName', headerName: 'Customer Name', flex: 1.5, minWidth: 180 },
    { field: 'mobileNumber', headerName: 'Mobile', flex: 1, minWidth: 120 },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 100 },
    { 
      field: 'createdAt', 
      headerName: 'Date Added', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => format(new Date(params.value), 'MMM d, yyyy')
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      flex: 1.5,
      minWidth: 180,
      valueGetter: (params) => params.row.createdBy?.name || 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton onClick={() => handleViewOpen(params.row)} size="small" color="primary">
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Lead">
            <IconButton onClick={() => onEdit(params.row)} size="small" color="secondary">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Lead">
            <IconButton onClick={() => handleDeleteOpen(params.row)} size="small" color="error">
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  // The DataGrid component requires a unique 'id' field for each row
  const rows = leads.map(lead => ({ ...lead, id: lead._id }));

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        getRowId={(row) => row._id}
      />
      <LeadViewModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} lead={selectedLead} />
      <ConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Lead?"
        message={`Are you sure you want to permanently delete the lead for ${selectedLead?.customerName}? This action cannot be undone.`}
        variant="danger"
        confirmText="Delete"
      />
    </Box>
  );
};

export default LeadTable;
