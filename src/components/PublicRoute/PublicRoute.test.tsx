import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { PublicRoute } from '.';

const TestComponent = () => {
  const location = useLocation();
  return (
    <div>
      <div>Публичная страница</div>
      <div data-testid="location-state">{JSON.stringify(location.state)}</div>
    </div>
  );
};

const HomePage = () => <div>Домашняя страница</div>;

describe('PublicRoute', () => {
  test('Показывает дочерние роуты когда пользователь НЕ авторизован', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute isAuthorized={false} />}>
            <Route path="/login" element={<TestComponent />} />
          </Route>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Публичная страница')).toBeInTheDocument();
  });

  test('Редиректит на главную когда пользователь авторизован', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute isAuthorized />}>
            <Route path="/login" element={<TestComponent />} />
          </Route>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Домашняя страница')).toBeInTheDocument();
    expect(screen.queryByText('Публичная страница')).not.toBeInTheDocument();
  });

  test('Редиректит на кастомный путь когда пользователь авторизован', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute isAuthorized redirectPath="/dashboard" />}>
            <Route path="/login" element={<TestComponent />} />
          </Route>
          <Route path="/dashboard" element={<div>Панель управления</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Панель управления')).toBeInTheDocument();
  });

  test('Передает состояние location при редиректе', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute isAuthorized />}>
            <Route path="/login" element={<TestComponent />} />
          </Route>
          <Route path="/" element={<TestComponent />} />
        </Routes>
      </MemoryRouter>
    );

    const locationState = screen.getByTestId('location-state');
    expect(locationState.textContent).toContain('from');
  });
});
