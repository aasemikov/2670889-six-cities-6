import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PrivateRoute } from '.';

const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;
const LoginPage = () => <div data-testid="login-page">Login Page</div>;

describe('PrivateRoute', () => {
    it('рендерит дочерний маршрут когда пользователь авторизован', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/" element={<PrivateRoute isAuthorized={true} />}>
                        <Route path="protected" element={<TestComponent />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(container.querySelector('[data-testid="protected-content"]')).toBeInTheDocument();
        expect(container.textContent).toContain('Protected Content');
    });

    it('перенаправляет на страницу логина когда пользователь не авторизован', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/" element={<PrivateRoute isAuthorized={false} />}>
                        <Route path="protected" element={<TestComponent />} />
                    </Route>
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(container.querySelector('[data-testid="login-page"]')).toBeInTheDocument();
        expect(container.textContent).toContain('Login Page');
    });

    it('использует кастомный путь для редиректа', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/" element={<PrivateRoute isAuthorized={false} redirectPath="/custom-login" />}>
                        <Route path="protected" element={<TestComponent />} />
                    </Route>
                    <Route path="/custom-login" element={<div data-testid="custom-login">Custom Login</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(container.querySelector('[data-testid="custom-login"]')).toBeInTheDocument();
        expect(container.textContent).toContain('Custom Login');
    });

    it('передает location state при редиректе', () => {
        let capturedLocationState: any = null;

        const StateChecker = () => {
            const location = useLocation();
            capturedLocationState = location.state;
            return <div>State Checker</div>;
        };

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/" element={<PrivateRoute isAuthorized={false} />}>
                        <Route path="protected" element={<TestComponent />} />
                    </Route>
                    <Route path="/login" element={<StateChecker />} />
                </Routes>
            </MemoryRouter>
        );

        expect(capturedLocationState).toBeDefined();
        expect(capturedLocationState).toHaveProperty('from');
        expect(capturedLocationState.from.pathname).toBe('/protected');
    });
});