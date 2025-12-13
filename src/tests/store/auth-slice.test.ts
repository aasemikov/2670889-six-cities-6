import { beforeEach, describe, expect, it } from 'vitest';
import authReducer, {
  AuthState,
  checkAuth,
  clearError,
  login,
  logout,
  setAuthStatus
} from '../../store/slices/auth-slice';
import { AuthInfo, AuthStatus } from '../../types/auth';

describe('auth slice', () => {
  const initialState: AuthState = {
    authorizationStatus: 'UNKNOWN' as AuthStatus,
    user: null,
    loading: false,
    error: null
  };

  const mockAuthInfo: AuthInfo = {
    token: 'test-token',
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: 'avatar.jpg',
    isPro: false
  };

  const mockUserData = {
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: 'avatar.jpg',
    isPro: false
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe('actions', () => {
    it('должен устанавливать статус авторизации', () => {
      const action = setAuthStatus('AUTH');
      const state = authReducer(initialState, action);

      expect(state.authorizationStatus).toBe('AUTH');
    });

    it('должен очищать ошибку', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Some error'
      };

      const state = authReducer(stateWithError, clearError());

      expect(state.error).toBeNull();
    });
  });

  describe('async thunks', () => {
    describe('checkAuth', () => {
      it('должен обрабатывать pending состояние', () => {
        const action = checkAuth.pending('', undefined);
        const state = authReducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('должен обрабатывать fulfilled состояние', () => {
        const action = checkAuth.fulfilled(mockAuthInfo, '', undefined);
        const state = authReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.authorizationStatus).toBe('AUTH');
        expect(state.user).toEqual(mockUserData);
        expect(localStorage.getItem('six-cities-token')).toBe('test-token');
      });

      it('должен обрабатывать rejected состояние', () => {
        const action = checkAuth.rejected(new Error('Failed'), '', undefined);
        const state = authReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.authorizationStatus).toBe('NO_AUTH');
        expect(state.user).toBeNull();
        expect(localStorage.getItem('six-cities-token')).toBeNull();
      });
    });

    describe('login', () => {
      const loginData = { email: 'test@example.com', password: 'password123' };

      it('должен обрабатывать pending состояние', () => {
        const action = login.pending('', loginData);
        const state = authReducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('должен обрабатывать fulfilled состояние', () => {
        const action = login.fulfilled(mockAuthInfo, '', loginData);
        const state = authReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.authorizationStatus).toBe('AUTH');
        expect(state.user).toEqual(mockUserData);
        expect(localStorage.getItem('six-cities-token')).toBe('test-token');
      });

      it('должен обрабатывать rejected состояние с ошибкой', () => {
        const error = new Error('Login failed');
        const action = login.rejected(error, '', loginData);
        const state = authReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Login failed');
        expect(state.authorizationStatus).toBe('UNKNOWN');
        expect(state.user).toBeNull();
      });

      it('должен обрабатывать rejected состояние без сообщения об ошибке', () => {
        const action = login.rejected(new Error(), '', loginData);
        const state = authReducer(initialState, action);

        expect(state.error).toBe('Failed to login');
      });
    });

    describe('logout', () => {
      it('должен обрабатывать fulfilled состояние', () => {
        const stateWithAuth: AuthState = {
          authorizationStatus: 'AUTH',
          user: mockUserData,
          loading: false,
          error: null
        };

        localStorage.setItem('six-cities-token', 'test-token');

        const action = logout.fulfilled(undefined, '', undefined);
        const state = authReducer(stateWithAuth, action);

        expect(state.authorizationStatus).toBe('NO_AUTH');
        expect(state.user).toBeNull();
        expect(localStorage.getItem('six-cities-token')).toBeNull();
      });
    });
  });

  describe('initial state', () => {
    it('должен возвращать initialState при пустом action', () => {
      const state = authReducer(undefined, { type: '' });

      expect(state).toEqual(initialState);
    });
  });
});
