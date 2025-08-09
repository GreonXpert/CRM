// /src/components/admin/UserTable.js
import React from 'react';
import { Box, IconButton, Tooltip, Stack, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { Edit, Delete } from '@mui/icons-material';
import { format } from 'date-fns';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.background.default,
  },
  // ... other styles from LeadTable
}));

const UserTable = ({ users, onEdit, onDelete }) => {
    const columns = [
        { field: 'name', headerName: 'Name', flex: 1.5 },
        { field: 'email', headerName: 'Email', flex: 2 },
        { 
            field: 'role', 
            headerName: 'Role', 
            flex: 1,
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    color={params.value === 'SUPER ADMIN' ? 'primary' : 'secondary'}
                    size="small" 
                />
            )
        },
        { 
            field: 'createdAt', 
            headerName: 'Date Joined', 
            flex: 1,
            renderCell: (params) => format(new Date(params.value), 'MMM d, yyyy')
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 120,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit User">
                        <IconButton onClick={() => onEdit(params.row)} size="small" color="secondary"><Edit /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                        <IconButton onClick={() => onDelete(params.row)} size="small" color="error"><Delete /></IconButton>
                    </Tooltip>
                </Stack>
            ),
        },
    ];

    const rows = users.map(user => ({ ...user, id: user._id }));

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <StyledDataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
            />
        </Box>
    );
};

export default UserTable;
