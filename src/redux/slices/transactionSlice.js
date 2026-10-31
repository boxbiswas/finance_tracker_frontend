import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios.js';

// Async thunk to fetch paginated and filtered transactions from GET /transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (customFilters, { getState, rejectWithValue }) => {
    try {
      // Merge current slice filter state with any custom overrides
      const currentFilters = getState().transactions.filters;
      const filters = { ...currentFilters, ...(customFilters || {}) };

      // Build clean query object omitting blank or undefined keys
      const params = {};
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.sort) params.sort = filters.sort;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;

      const response = await api.get('/transactions', { params });
      return {
        transactions: response.data.transactions,
        pagination: response.data.pagination,
        appliedFilters: filters
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to load transactions.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to calculate dashboard totals and recent activity
export const fetchDashboardSummary = createAsyncThunk(
  'transactions/fetchDashboardSummary',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch up to 100 recent transactions to aggregate totals
      const response = await api.get('/transactions', {
        params: { limit: 100, sort: 'date_desc' }
      });
      const list = response.data.transactions || [];

      // Calculate total income and expenses in minor units
      let incomeMinor = 0;
      let expenseMinor = 0;

      list.forEach((txn) => {
        if (txn.type === 'income') {
          incomeMinor += txn.amountMinor || 0;
        } else if (txn.type === 'expense') {
          expenseMinor += txn.amountMinor || 0;
        }
      });

      return {
        totalIncome: incomeMinor / 100,
        totalExpense: expenseMinor / 100,
        netCashFlow: (incomeMinor - expenseMinor) / 100,
        recentTransactions: list.slice(0, 5),
        totalCount: response.data.pagination?.total || list.length
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update dashboard statistics.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to create a new transaction via POST /transactions
export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/transactions', transactionData);
      // Refresh dashboard summary figures after successful write
      dispatch(fetchDashboardSummary());
      return response.data.transaction;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to save transaction.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to delete an existing transaction via DELETE /transactions/:id
export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (transactionId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/transactions/${transactionId}`);
      // Refresh dashboard summary figures after successful deletion
      dispatch(fetchDashboardSummary());
      return { id: transactionId, message: response.data.message };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to delete transaction.';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  // Current page transaction items
  items: [],
  // Pagination metadata
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  },
  // Filter settings
  filters: {
    from: '',
    to: '',
    type: '',
    category: '',
    sort: 'date_desc',
    page: 1,
    limit: 10
  },
  // High-level dashboard summary metrics
  summary: {
    totalIncome: 0,
    totalExpense: 0,
    netCashFlow: 0,
    recentTransactions: [],
    totalCount: 0
  },
  // UI Loading States
  loading: false,
  submitting: false,
  deletingId: null,
  summaryLoading: false,
  // Error and Notification feedback
  error: null,
  successMessage: null
};

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Update filter parameters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    // Reset filters to defaults
    resetFilters: (state) => {
      state.filters = {
        from: '',
        to: '',
        type: '',
        category: '',
        sort: 'date_desc',
        page: 1,
        limit: 10
      };
    },
    // Direct page change
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    // Clear notification and error messages
    clearTransactionStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.transactions;
        state.pagination = action.payload.pagination;
        state.filters = action.payload.appliedFilters;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Dashboard Summary
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.summaryLoading = true;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state) => {
        state.summaryLoading = false;
      })

      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.submitting = false;
        state.successMessage = 'Transaction recorded';
        // Prepend created item to the list
        state.items = [action.payload, ...state.items];
        state.pagination.total += 1;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // Delete Transaction
      .addCase(deleteTransaction.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.deletingId = null;
        state.successMessage = 'Transaction deleted';
        // Remove deleted item from active list
        state.items = state.items.filter((item) => (item.id || item._id) !== action.payload.id);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload;
      });
  }
});

export const { setFilters, resetFilters, setPage, clearTransactionStatus } = transactionSlice.actions;

export default transactionSlice.reducer;
