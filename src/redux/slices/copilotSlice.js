import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios.js';

// Query authoritative financial context or submit a natural financial question
export const queryFinancialContext = createAsyncThunk(
  'copilot/queryFinancialContext',
  async ({ question, action, chartType, filters, dashboardContext }, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      // Retrieve recent conversation messages for follow-up conversational awareness
      const conversationHistory = (state.copilot?.messages || []).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'copilot',
        sender: m.sender,
        content: m.text,
        text: m.text
      }));

      // Gather active dashboard scope from Redux analytics filters if not explicitly provided
      const effectiveFilters = filters || state.analytics?.filters || {};
      const effectiveDashboardContext = dashboardContext || {
        dateRange: {
          from: effectiveFilters.from || '',
          to: effectiveFilters.to || '',
          months: effectiveFilters.months || 6
        },
        selectedChart: chartType || 'monthly_comparison',
        activeFilters: effectiveFilters
      };

      const response = await api.post('/copilot/query', {
        question,
        action,
        chartType: chartType || effectiveDashboardContext.selectedChart,
        filters: effectiveFilters,
        dashboardContext: effectiveDashboardContext,
        messages: conversationHistory.slice(-6)
      });

      return {
        question,
        data: response.data.data
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to retrieve verified financial context'
      );
    }
  }
);

// Copilot Redux slice managing conversation thread and loading state per Day 15 specification
const copilotSlice = createSlice({
  name: 'copilot',
  initialState: {
    messages: [],
    loading: false,
    error: null
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        sender: 'user',
        text: action.payload,
        timestamp: new Date().toISOString()
      });
      state.error = null;
    },
    clearCopilotChat: (state) => {
      state.messages = [];
      state.error = null;
    },
    setCopilotError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(queryFinancialContext.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(queryFinancialContext.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Append copilot reply preserving message history for follow-up questions
        state.messages.push({
          id: Date.now() + 1,
          sender: 'copilot',
          text: action.payload.data.answer || action.payload.data.summary,
          context: action.payload.data.context,
          intent: action.payload.data.intent,
          timestamp: new Date().toISOString()
        });
      })
      .addCase(queryFinancialContext.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to communicate with Copilot service';
        state.messages.push({
          id: Date.now() + 1,
          sender: 'copilot',
          text: "I couldn't retrieve your financial context right now. Please verify your connection and try again.",
          isError: true,
          timestamp: new Date().toISOString()
        });
      });
  }
});

export const { addUserMessage, clearCopilotChat, setCopilotError } = copilotSlice.actions;
export default copilotSlice.reducer;
