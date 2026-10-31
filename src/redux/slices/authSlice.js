import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios.js';

// Safe user restoration from localStorage
const storedUser = localStorage.getItem('clarivo_user');
let initialUser = null;
try {
  initialUser = storedUser ? JSON.parse(storedUser) : null;
} catch (e) {
  localStorage.removeItem('clarivo_user');
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Registration failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Invalid email or password.';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      return true;
    } catch (err) {
      // Even if network fails, client-side session should be cleared
      return true;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    isAuthenticated: !!initialUser,
    loading: false,
    error: null
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('clarivo_user');
    },
    setAuthenticatedUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('clarivo_user', JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
      // Register (creates account without logging in)
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
        localStorage.setItem('clarivo_user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem('clarivo_user');
      });
  }
});

export const { clearAuthError, clearAuth, setAuthenticatedUser } = authSlice.actions;
export default authSlice.reducer;
