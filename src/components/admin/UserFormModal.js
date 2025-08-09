// /src/components/admin/UserFormModal.js (Create a new 'admin' folder in components)
import React,
{ useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Stack, DialogActions, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import AppInput from '../common/AppInput';
import AppButton from '../common/AppButton';

// Validation schema
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().when('isEditing', {
        is: false,
        then: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        otherwise: yup.string().optional(),
    }),
    role: yup.string().oneOf(['ADMIN', 'SUPER ADMIN']).required('Role is required'),
});

const UserFormModal = ({ open, onClose, onSubmit, user }) => {
    const isEditing = !!user;

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        context: { isEditing },
    });

    useEffect(() => {
        if (user) {
            reset({ name: user.name, email: user.email, role: user.role });
        } else {
            reset({ name: '', email: '', password: '', role: 'ADMIN' });
        }
    }, [user, open, reset]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle variant="h3">{isEditing ? 'Edit User' : 'Create New User'}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <Controller name="name" control={control} render={({ field }) => <AppInput {...field} label="Full Name" error={!!errors.name} helperText={errors.name?.message} autoFocus />} />
                        <Controller name="email" control={control} render={({ field }) => <AppInput {...field} label="Email Address" type="email" error={!!errors.email} helperText={errors.email?.message} />} />
                        {!isEditing && (
                            <Controller name="password" control={control} render={({ field }) => <AppInput {...field} label="Password" type="password" error={!!errors.password} helperText={errors.password?.message} />} />
                        )}
                        <Controller name="role" control={control} render={({ field }) => <AppInput {...field} label="Role (ADMIN or SUPER ADMIN)" error={!!errors.role} helperText={errors.role?.message} />} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <AppButton onClick={onClose} variant="secondary">Cancel</AppButton>
                    <AppButton type="submit" variant="primary">{isEditing ? 'Save Changes' : 'Create User'}</AppButton>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default UserFormModal;
