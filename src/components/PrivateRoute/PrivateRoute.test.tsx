import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { PrivateRoute } from '.';

const ProtectedComponent = () => <div>Protected Content</div>;

const PublicComponent = () => <div>Public Login Page</div>;

const LocationReporter = () => {
  const location = useLocation();
  return (
    <div data-testid="location-reporter">
            Path: {location.pathname}
      {location.state && location.state.from && ` From: ${location.state.from.pathname}`}
    </div>
  );
};

describe('Компонент PrivateRoute', () => {
  it('должен рендерить дочерний Outlet, если пользователь авторизован', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route element={<PrivateRoute isAuthorized />}>
            <Route path="/profile" element={<ProtectedComponent />} />
          </Route>
          <Route path="/login" element={<PublicComponent />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
    expect(screen.queryByText(/Public Login Page/i)).toBeNull();
  });
  it('должен перенаправить на страницу логина, если пользователь не авторизован', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route element={<PrivateRoute isAuthorized={false} />}>
            <Route path="/profile" element={<ProtectedComponent />} />
          </Route>
          <Route path="/login" element={<PublicComponent />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Public Login Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Protected Content/i)).toBeNull();
  });
  it('должен передавать текущий location state при перенаправлении на страницу входа', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<PrivateRoute isAuthorized={false} />}>
            <Route path="/dashboard" element={<ProtectedComponent />} />
          </Route>
          <Route path="/login" element={<LocationReporter />} />
        </Routes>
      </MemoryRouter>
    );

    const locationReporter = screen.getByTestId('location-reporter');
    expect(locationReporter).toHaveTextContent('Path: /login');
    expect(locationReporter).toHaveTextContent('From: /dashboard');
  });
  it('должен перенаправить на customRedirectPath, если он указан и пользователь не авторизован', () => {
    const customRedirect = '/landing';
    const LandingPage = () => <div>Landing Page Content</div>;

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<PrivateRoute isAuthorized={false} redirectPath={customRedirect} />}>
            <Route path="/admin" element={<ProtectedComponent />} />
          </Route>
          <Route path={customRedirect} element={<LandingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Landing Page Content/i)).toBeInTheDocument();
    expect(screen.queryByText(/Protected Content/i)).toBeNull();
  });
});
