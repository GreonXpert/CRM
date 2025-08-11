// src/store/api/userApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:7736/api/users',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token || localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, role } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (role) params.append('role', role);
        return `/?${params}`;
      },
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/changepassword',
        method: 'PUT',
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
} = userApi;