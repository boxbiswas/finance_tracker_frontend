import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios.js';
import { getCurrentMonthString } from '../../utils/formatCurrency.js';

// Async thunk to fetch budgets for a specific month via GET /budgets
export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (month, { getState, rejectWithValue }) => {
    try {
      const targetMonth = month || getState().budgets.selectedMonth || getCurrentMonthString();
      const response = await api.get('/budgets', { params: { month: targetMonth } });
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to load category budgets.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to set a new category monthly budget via POST /budgets
export const createBudget = createAsyncThunk(
  'budgets/createBudget',
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await api.post('/budgets', budgetData);
      return response.data.budget;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to create category budget.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to update budget limit via PATCH /budgets/:id
export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async ({ id, limit }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/budgets/${id}`, { limit });
      return response.data.budget;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to update budget limit.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to delete budget via DELETE /budgets/:id
export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (budgetId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/budgets/${budgetId}`);
      return { id: budgetId, message: response.data.message };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to delete budget.';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  // Category budget items with live spending and overspending calculations
  items: [],
  // Month-level aggregate summary figures
  summary: {
    totalBudgeted: 0,
    totalSpent: 0,
    totalRemaining: 0,
    overallPercentage: 0,
    totalBudgets: 0,
    overBudgetCount: 0
  },
  // Currently viewed month (YYYY-MM)
  selectedMonth: getCurrentMonthString(),
  // UI Loading States
  loading: false,
  submitting: false,
  deletingId: null,
  // Notification and Error states
  error: null,
  successMessage: null
};

export const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    // Select and navigate between different calendar months
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    // Clear notification and error messages
    clearBudgetStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.budgets || [];
        state.summary = action.payload.summary || initialState.summary;
        state.selectedMonth = action.payload.month || state.selectedMonth;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Budget
      .addCase(createBudget.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.submitting = false;
        state.successMessage = 'Budget created';
        // Add new budget and sort
        state.items = [action.payload, ...state.items];
        // Recalculate summary metrics
        state.summary.totalBudgets += 1;
        state.summary.totalBudgeted += action.payload.limit;
        state.summary.totalSpent += action.payload.spent;
        state.summary.totalRemaining = state.summary.totalBudgeted - state.summary.totalSpent;
        if (action.payload.isOverBudget) {
          state.summary.overBudgetCount += 1;
        }
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // Update Budget
      .addCase(updateBudget.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.submitting = false;
        state.successMessage = 'Budget limit updated';
        // Replace updated budget in array
        state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item));
        // Recalculate summary metrics
        let totalBudgeted = 0;
        let totalSpent = 0;
        let overBudgetCount = 0;
        state.items.forEach((b) => {
          totalBudgeted += b.limit;
          totalSpent += b.spent;
          if (b.isOverBudget) overBudgetCount += 1;
        });
        state.summary.totalBudgeted = totalBudgeted;
        state.summary.totalSpent = totalSpent;
        state.summary.totalRemaining = totalBudgeted - totalSpent;
        state.summary.overallPercentage = totalBudgeted > 0 ? Number(((totalSpent / totalBudgeted) * 100).toFixed(1)) : 0;
        state.summary.overBudgetCount = overBudgetCount;
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })

      // Delete Budget
      .addCase(deleteBudget.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.deletingId = null;
        state.successMessage = 'Budget deleted';
        // Remove from list
        state.items = state.items.filter((item) => item.id !== action.payload.id);
        // Recalculate summary metrics
        let totalBudgeted = 0;
        let totalSpent = 0;
        let overBudgetCount = 0;
        state.items.forEach((b) => {
          totalBudgeted += b.limit;
          totalSpent += b.spent;
          if (b.isOverBudget) overBudgetCount += 1;
        });
        state.summary.totalBudgets = state.items.length;
        state.summary.totalBudgeted = totalBudgeted;
        state.summary.totalSpent = totalSpent;
        state.summary.totalRemaining = totalBudgeted - totalSpent;
        state.summary.overallPercentage = totalBudgeted > 0 ? Number(((totalSpent / totalBudgeted) * 100).toFixed(1)) : 0;
        state.summary.overBudgetCount = overBudgetCount;
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload;
      });
  }
});

export const { setSelectedMonth, clearBudgetStatus } = budgetSlice.actions;

export default budgetSlice.reducer;

