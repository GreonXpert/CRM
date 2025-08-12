// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import leadReducer from './slices/leadSlice';
import { authApi } from './api/authApi';
import { userApi } from './api/userApi';
import { leadApi } from './api/leadApi';
import { reportApi } from './api/reportApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [leadApi.reducerPath]: leadApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      leadApi.middleware,
      reportApi.middleware
    ),
});

setupListeners(store.dispatch);