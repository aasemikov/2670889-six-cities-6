import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PublicRoute } from '.';

describe('PublicRoute', () => {
    it('показывает публичный контент для неавторизованных', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route element={<PublicRoute isAuthorized={false} />}>
                        <Route path="login" element={<div>Login</div>} />
                    </Route>
                    <Route path="/" element={<div>Root</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(container.textContent).toContain('Login');
    });

    it('редиректит на главную для авторизованных', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route element={<PublicRoute isAuthorized={true} />}>
                        <Route path="login" element={<div>Login Page</div>} />
                    </Route>
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(container.textContent).toContain('Home Page');
        expect(container.textContent).not.toContain('Login Page');
    });

    it('использует кастомный путь для редиректа', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route element={<PublicRoute isAuthorized={true} redirectPath="/dashboard" />}>
                        <Route path="login" element={<div>Login</div>} />
                    </Route>
                    <Route path="/dashboard" element={<div>Dashboard</div>} />
                    <Route path="/" element={<div>Home</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(container.textContent).toContain('Dashboard');
    });
});