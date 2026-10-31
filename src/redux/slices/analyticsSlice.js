import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios.js';

// Async thunk to fetch financial summary metrics via GET /analytics/summary
export const fetchAnalyticsSummary = createAsyncThunk(
  'analytics/fetchSummary',
  async (customFilters, { getState, rejectWithValue }) => {
    try {
      const activeFilters = { ...getState().analytics.filters, ...(customFilters || {}) };
      const params = {};
      if (activeFilters.from) params.from = activeFilters.from;
      if (activeFilters.to) params.to = activeFilters.to;

      const response = await api.get('/analytics/summary', { params });
      return response.data.summary;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load analytics summary.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to fetch category breakdown via GET /analytics/category-breakdown
export const fetchCategoryBreakdown = createAsyncThunk(
  'analytics/fetchCategoryBreakdown',
  async (customFilters, { getState, rejectWithValue }) => {
    try {
      const activeFilters = { ...getState().analytics.filters, ...(customFilters || {}) };
      const params = { type: activeFilters.type || 'expense' };
      if (activeFilters.from) params.from = activeFilters.from;
      if (activeFilters.to) params.to = activeFilters.to;

      const response = await api.get('/analytics/category-breakdown', { params });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load category breakdown.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to fetch monthly trend data via GET /analytics/monthly-trends
export const fetchMonthlyTrends = createAsyncThunk(
  'analytics/fetchMonthlyTrends',
  async (customFilters, { getState, rejectWithValue }) => {
    try {
      const activeFilters = { ...getState().analytics.filters, ...(customFilters || {}) };
      const params = { months: activeFilters.months || 6 };
      if (activeFilters.from) params.from = activeFilters.from;
      if (activeFilters.to) params.to = activeFilters.to;

      const response = await api.get('/analytics/monthly-trends', { params });
      return response.data.trends || [];
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load monthly trends.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to batch fetch all analytics concurrently
export const fetchAllAnalytics = createAsyncThunk(
  'analytics/fetchAll',
  async (customFilters, { dispatch }) => {
    return Promise.all([
      dispatch(fetchAnalyticsSummary(customFilters)),
      dispatch(fetchCategoryBreakdown(customFilters)),
      dispatch(fetchMonthlyTrends(customFilters))
    ]);
  }
);

const initialState = {
  // Financial summary metrics
  summary: {
    totalIncome: 0,
    totalExpense: 0,
    netCashFlow: 0,
    balance: 0,
    totalIncomeMinor: 0,
    totalExpenseMinor: 0,
    transactionCount: 0,
    incomeCount: 0,
    expenseCount: 0
  },
  // Category breakdown distribution
  categoryData: {
    type: 'expense',
    total: 0,
    totalMinor: 0,
    categories: []
  },
  // Monthly time-series trend points
  trends: [],
  // Filter settings
  filters: {
    from: '',
    to: '',
    type: 'expense',
    months: 6
  },
  // Loading and Error flags
  loading: false,
  error: null
};

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    // Update analytics filter settings
    setAnalyticsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Reset analytics filters to defaults
    resetAnalyticsFilters: (state) => {
      state.filters = {
        from: '',
        to: '',
        type: 'expense',
        months: 6
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Summary Reducers
      .addCase(fetchAnalyticsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchAnalyticsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Category Breakdown Reducers
      .addCase(fetchCategoryBreakdown.fulfilled, (state, action) => {
        state.categoryData = action.payload;
      })

      // Monthly Trends Reducers
      .addCase(fetchMonthlyTrends.fulfilled, (state, action) => {
        state.trends = action.payload;
      });
  }
});

export const { setAnalyticsFilters, resetAnalyticsFilters } = analyticsSlice.actions;

export default analyticsSlice.reducer;
