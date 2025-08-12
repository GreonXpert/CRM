// src/store/api/reportApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:7736/api/reports',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token || localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery,
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/dashboard',
    }),
    // NEW ENDPOINT for user performance data
    getUserPerformanceStats: builder.query({
      query: () => '/user-performance',
    }),
    downloadCustomReport: builder.mutation({
      query: (params) => ({
        url: '/download',
        method: 'POST',
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useGetDashboardStatsQuery,  useGetUserPerformanceStatsQuery, useDownloadCustomReportMutation } = reportApi;