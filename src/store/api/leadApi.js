import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:7736/api/leads',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token || localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const leadApi = createApi({
  reducerPath: 'leadApi',
  baseQuery,
  tagTypes: ['Lead'],
  endpoints: (builder) => ({
    createLead: builder.mutation({
      query: (leadData) => ({
        url: '/',
        method: 'POST',
        body: leadData,
      }),
      invalidatesTags: ['Lead'],
    }),
    createLeadFromLink: builder.mutation({
      query: ({ userId, leadData }) => ({
        url: `/link/${userId}`,
        method: 'POST',
        body: leadData,
      }),
    }),
    getAllLeads: builder.query({
      query: () => '/',
      providesTags: ['Lead'],
    }),
    updateLead: builder.mutation({
      query: ({ id, ...leadData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: leadData,
      }),
      invalidatesTags: ['Lead'],
    }),
    deleteLead: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lead'],
    }),
  }),
});

export const {
  useCreateLeadMutation,
  useCreateLeadFromLinkMutation,
  useGetAllLeadsQuery,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} = leadApi;