import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavBar } from '.';

jest.mock('../../store/hooks/redux', () => ({
  useAppDispatch: jest.fn(() => jest.fn()),
  useAppSelector: jest.fn(),
}));

jest.mock('../../store/slices/favorites-slice', () => ({
  fetchFavorites: jest.fn(),
}));

describe('Компонент NavBar', () => {
  const mockUseAppSelector = jest.requireMock('../../store/hooks/redux').useAppSelector;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Для неавторизованного пользователя', () => {
    beforeEach(() => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        const mockState = {
          auth: { user: null },
          favorites: { favorites: [] },
        };
        return selector(mockState);
      });
    });

    it('показывает кнопку входа для неавторизованного пользователя', () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <NavBar isAuthorized={false} />
        </MemoryRouter>
      );

      expect(screen.getByText('Sign in')).toBeInTheDocument();
      expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
    });
  });

  describe('Для авторизованного пользователя', () => {
    beforeEach(() => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        const mockState = {
          auth: {
            user: {
              name: 'John',
              email: 'john@test.com',
              avatarUrl: '/avatar.jpg'
            }
          },
          favorites: { favorites: [{ id: '1' }, { id: '2' }] },
        };
        return selector(mockState);
      });
    });

    it('показывает аватар и кнопку выхода', () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <NavBar isAuthorized />
        </MemoryRouter>
      );

      // Проверяем аватар
      const avatarImg = screen.getByAltText('John');
      expect(avatarImg).toBeInTheDocument();
      expect(avatarImg).toHaveAttribute('src', '/avatar.jpg');

      // Проверяем email
      expect(screen.getByText('john@test.com')).toBeInTheDocument();

      // Проверяем счетчик избранного
      expect(screen.getByText('2')).toBeInTheDocument();

      // Проверяем кнопку выхода
      expect(screen.getByText('Sign out')).toBeInTheDocument();
    });
  });

  describe('Для авторизованного пользователя без аватара', () => {
    beforeEach(() => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        const mockState = {
          auth: {
            user: {
              name: 'John',
              email: 'john@test.com',
              avatarUrl: undefined
            }
          },
          favorites: { favorites: [] },
        };
        return selector(mockState);
      });
    });

    it('показывает email вместо "User"', () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <NavBar isAuthorized />
        </MemoryRouter>
      );

      expect(screen.getByText('john@test.com')).toBeInTheDocument();
      expect(screen.queryByAltText('John')).not.toBeInTheDocument();
    });
  });

  describe('Проверка CSS классов', () => {
    beforeEach(() => {
      mockUseAppSelector.mockImplementation((selector: any) => {
        const mockState = {
          auth: { user: null },
          favorites: { favorites: [] },
        };
        return selector(mockState);
      });
    });

    it('применяет правильные CSS классы', () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <NavBar isAuthorized={false} />
        </MemoryRouter>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('header__nav');
    });
  });
});
