import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NavBar } from '.';
import { useAppSelector } from '../../store/hooks/redux';

const mockDispatch = vi.fn();

vi.mock('../../store/hooks/redux', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/slices/auth-slice', () => ({
  logout: () => ({ type: 'auth/logout' }),
}));

vi.mock('../../store/slices/favorites-slice', () => ({
  fetchFavorites: () => ({ type: 'favorites/fetchFavorites' }),
}));

describe('NavBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит ссылку на логин когда пользователь не авторизован', () => {
    const mockUseAppSelector = vi.mocked(useAppSelector);
    mockUseAppSelector.mockReturnValue({
      auth: {
        user: null,
        authorizationStatus: 'NO_AUTH',
        loading: false,
        error: null,
      },
      favorites: {
        favorites: [],
        loading: false,
        error: null,
      },
    });

    render(
      <MemoryRouter>
        <NavBar isAuthorized={false} />
      </MemoryRouter>
    );

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login');
  });

  it('вызывает logout при клике на Sign out', () => {
    const mockUseAppSelector = vi.mocked(useAppSelector);
    mockUseAppSelector.mockReturnValue({
      auth: {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          avatarUrl: 'avatar.jpg',
          isPro: false,
        },
        authorizationStatus: 'AUTH',
        loading: false,
        error: null,
      },
      favorites: {
        favorites: [],
        loading: false,
        error: null,
      },
    });

    render(
      <MemoryRouter>
        <NavBar isAuthorized />
      </MemoryRouter>
    );

    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/logout' });
  });
});
