import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { AuthInfo, AuthStatus, LoginData } from '../../types/auth';

export interface AuthState {
    authorizationStatus: AuthStatus;
    user: Omit<AuthInfo, 'token'> | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
  authorizationStatus: 'UNKNOWN',
  user: null,
  loading: false,
  error: null,
};

export const checkAuth = createAsyncThunk<
    AuthInfo,
    void,
    { extra: AxiosInstance }
>('auth/checkAuth', async (_, { extra: api }) => {
  const { data } = await api.get<AuthInfo>('/login');
  return data;
});

export const login = createAsyncThunk<
    AuthInfo,
    LoginData,
    { extra: AxiosInstance }
>('auth/login', async ({ email, password }, { extra: api }) => {
  const { data } = await api.post<AuthInfo>('/login', { email, password });
  return data;
});

export const logout = createAsyncThunk<
    void,
    void,
    { extra: AxiosInstance }
>('auth/logout', async (_, { extra: api }) => {
  await api.delete('/logout');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.authorizationStatus = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.authorizationStatus = 'AUTH';
        const { token, ...userData } = action.payload;
        state.user = userData;
        localStorage.setItem('six-cities-token', token);
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.authorizationStatus = 'NO_AUTH';
        state.user = null;
        localStorage.removeItem('six-cities-token');
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.authorizationStatus = 'AUTH';
        const { token, ...userData } = action.payload;
        state.user = userData;
        localStorage.setItem('six-cities-token', token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(logout.fulfilled, (state) => {
        state.authorizationStatus = 'NO_AUTH';
        state.user = null;
        localStorage.removeItem('six-cities-token');
      });
  },
});

export const { setAuthStatus, clearError } = authSlice.actions;
export default authSlice.reducer;
