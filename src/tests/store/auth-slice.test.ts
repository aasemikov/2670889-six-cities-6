import authReducer, { checkAuth, clearError, login, logout, setAuthStatus } from '../../store/slices/auth-slice';
import { AuthInfo } from '../../types/auth';

const mockUser: AuthInfo = {
  name: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'avatar.jpg',
  token: 'token123',
  isPro: false
};

const mockUserWithoutToken = {
  name: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'avatar.jpg',
  isPro: false
};

describe('Auth Slice', () => {
  const initialState = {
    authorizationStatus: 'UNKNOWN' as const,
    user: null,
    loading: false,
    error: null
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe('reducers', () => {
    it('should handle setAuthStatus', () => {
      const action = setAuthStatus('AUTH');
      const state = authReducer(initialState, action);
      expect(state.authorizationStatus).toBe('AUTH');
    });

    it('should handle clearError', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const state = authReducer(stateWithError, clearError());
      expect(state.error).toBeNull();
    });
  });

  describe('checkAuth thunk', () => {
    it('should set loading to true on pending', () => {
      const action = { type: checkAuth.pending.type };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled checkAuth', () => {
      const action = {
        type: checkAuth.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.authorizationStatus).toBe('AUTH');
      expect(state.user).toEqual(mockUserWithoutToken);
      expect(localStorage.getItem('six-cities-token')).toBe('token123');
    });

    it('should handle rejected checkAuth', () => {
      const action = { type: checkAuth.rejected.type };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.authorizationStatus).toBe('NO_AUTH');
      expect(state.user).toBeNull();
      expect(localStorage.getItem('six-cities-token')).toBeNull();
    });
  });

  describe('login thunk', () => {
    it('should set loading to true on pending', () => {
      const action = { type: login.pending.type };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled login', () => {
      const action = {
        type: login.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.authorizationStatus).toBe('AUTH');
      expect(state.user).toEqual(mockUserWithoutToken);
      expect(localStorage.getItem('six-cities-token')).toBe('token123');
    });

    it('should handle rejected login', () => {
      const action = {
        type: login.rejected.type,
        error: { message: 'Login failed' }
      };
      const state = authReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Login failed');
    });
  });

  describe('logout thunk', () => {
    it('should handle fulfilled logout', () => {
      localStorage.setItem('six-cities-token', 'token123');
      const stateWithAuth = {
        ...initialState,
        authorizationStatus: 'AUTH' as const,
        user: mockUserWithoutToken
      };

      const action = { type: logout.fulfilled.type };
      const state = authReducer(stateWithAuth, action);

      expect(state.authorizationStatus).toBe('NO_AUTH');
      expect(state.user).toBeNull();
      expect(localStorage.getItem('six-cities-token')).toBeNull();
    });
  });
});
