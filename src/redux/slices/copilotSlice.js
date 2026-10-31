import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios.js';

// Query authoritative financial context or submit a natural financial question
export const queryFinancialContext = createAsyncThunk(
  'copilot/queryFinancialContext',
  async ({ question, action, chartType, filters }, { rejectWithValue }) => {
    try {
      const response = await api.post('/copilot/query', {
        question,
        action,
        chartType,
        filters
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

// Fetch pure financial summary context
export const fetchCopilotSummary = createAsyncThunk(
  'copilot/fetchCopilotSummary',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/copilot/context/summary', { params });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch summary');
    }
  }
);

const copilotSlice = createSlice({
  name: 'copilot',
  initialState: {
    messages: [],
    loading: false,
    error: null,
    lastContext: null
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        sender: 'user',
        text: action.payload,
        timestamp: new Date().toISOString()
      });
    },
    clearCopilotChat: (state) => {
      state.messages = [];
      state.error = null;
      state.lastContext = null;
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
        state.lastContext = action.payload.data;
        // Append copilot reply with structured verified context
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
        state.error = action.payload;
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

export const { addUserMessage, clearCopilotChat } = copilotSlice.actions;
export default copilotSlice.reducer;

