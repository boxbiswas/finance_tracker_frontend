import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import transactionReducer from './slices/transactionSlice.js';
import analyticsReducer from './slices/analyticsSlice.js';
import budgetReducer from './slices/budgetSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    analytics: analyticsReducer,
    budgets: budgetReducer
  },
});

export default store;