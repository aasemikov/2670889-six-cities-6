import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LoginPage } from '.';

describe('LoginPage', () => {
  vi.mock('../../store/hooks/redux', () => ({
    useAppDispatch: () => vi.fn(),
    useAppSelector: vi.fn((selector: any) =>
      selector({
        auth: {
          authorizationStatus: 'NO_AUTH',
          loading: false,
          error: null,
          user: null,
        },
      })
    ),
  }));

  vi.mock('../../store/slices/auth-slice', () => ({
    login: vi.fn(),
    clearError: vi.fn(),
  }));

  it('показывает форму логина', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('обрабатывает ввод данных', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
  });
});
