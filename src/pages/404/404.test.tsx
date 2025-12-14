import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import NotFound from '.';

vi.mock('./index.module.css', () => ({
  default: {
    notFound: 'not-found-class',
    notFoundStatusWrapper: 'status-wrapper-class',
    notFoundStatus: 'status-class',
    notFoundStatusDescription: 'description-class',
    notFoundButtons: 'buttons-class',
    notFoundButton: 'button-class',
    notFoundButtonSecondary: 'button-secondary-class',
  },
}));

const mockWindowLocation = { href: '' };
const mockWindowHistory = { back: vi.fn() };

Object.defineProperty(window, 'location', {
  value: mockWindowLocation,
  writable: true,
});

Object.defineProperty(window, 'history', {
  value: mockWindowHistory,
  writable: true,
});

describe('NotFound', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWindowLocation.href = '';
  });

  it('рендерит страницу 404 с сообщением об ошибке', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Страница не найдена')).toBeInTheDocument();
  });

  it('содержит кнопку "На главную"', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const homeButton = screen.getByText('На главную');
    expect(homeButton).toBeInTheDocument();
    expect(homeButton).toHaveClass('button-class');
    expect(homeButton).toHaveClass('form__submit');
  });

  it('содержит кнопку "Назад"', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const backButton = screen.getByText('Назад');
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveClass('button-class');
    expect(backButton).toHaveClass('form__submit');
    expect(backButton).toHaveClass('button-secondary-class');
  });

  it('при клике на "На главную" перенаправляет на главную страницу', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const homeButton = screen.getByText('На главную');
    fireEvent.click(homeButton);

    expect(mockWindowLocation.href).toBe('/');
  });

  it('при клике на "Назад" вызывает window.history.back()', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const backButton = screen.getByText('Назад');
    fireEvent.click(backButton);

    expect(mockWindowHistory.back).toHaveBeenCalledTimes(1);
  });

  it('имеет правильные CSS классы', () => {
    const { container } = render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(container.querySelector('.page')).toBeInTheDocument();
    expect(container.querySelector('.page--gray')).toBeInTheDocument();
    expect(container.querySelector('.page--favorites-empty')).toBeInTheDocument();
    expect(container.querySelector('.page__main')).toBeInTheDocument();
    expect(container.querySelector('.page__main--favorites-empty')).toBeInTheDocument();
    expect(container.querySelector('.page__favorites-container')).toBeInTheDocument();
    expect(container.querySelector('.container')).toBeInTheDocument();
  });
});
