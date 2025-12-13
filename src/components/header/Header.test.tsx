import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { Header } from '.';
import { useAppSelector } from '../../store/hooks/redux';

vi.mock('../../store/hooks/redux', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('../container', () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
}));

vi.mock('../navbar', () => ({
  NavBar: ({ isAuthorized }: { isAuthorized: boolean }) => (
    <nav data-testid="navbar" data-authorized={isAuthorized}>
      NavBar
    </nav>
  ),
}));

describe('Header', () => {
  it('рендерит логотип со ссылкой на главную', () => {
    const mockUseAppSelector = vi.mocked(useAppSelector);
    mockUseAppSelector.mockReturnValue({ authorizationStatus: 'NO_AUTH' });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logoLink = screen.getByRole('link', { name: /6 cities logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');

    const logoImage = screen.getByAltText('6 cities logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('width', '81');
    expect(logoImage).toHaveAttribute('height', '41');
  });

  it('передает isAuthorized=false в NavBar когда пользователь не авторизован', () => {
    const mockUseAppSelector = vi.mocked(useAppSelector);
    mockUseAppSelector.mockReturnValue({ authorizationStatus: 'NO_AUTH' });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const navBar = screen.getByTestId('navbar');
    expect(navBar).toHaveAttribute('data-authorized', 'false');
  });

  it('передает isAuthorized=true в NavBar когда пользователь авторизован', () => {
    const mockUseAppSelector = vi.mocked(useAppSelector);
    mockUseAppSelector.mockReturnValue({ authorizationStatus: 'AUTH' });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const navBar = screen.getByTestId('navbar');
    expect(navBar).toHaveAttribute('data-authorized', 'true');
  });

  it('имеет правильные CSS классы', () => {
    const mockUseAppSelector = vi.mocked(useAppSelector);
    mockUseAppSelector.mockReturnValue({ authorizationStatus: 'NO_AUTH' });

    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const headerElement = container.querySelector('header');
    expect(headerElement).toHaveClass('header');
  });

  it('использует Container для обертки содержимого', () => {
    const mockUseAppSelector = vi.mocked(useAppSelector);
    mockUseAppSelector.mockReturnValue({ authorizationStatus: 'NO_AUTH' });

    const { container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(container.innerHTML).toContain('class="container"');
  });
});
