import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { Layout } from '.';

vi.mock('../header', () => ({
    Header: () => <header data-testid="header">Header</header>,
}));

describe('Layout', () => {
    it('рендерит Header и Outlet', () => {
        render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        );

        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('рендерит дочерние компоненты через Outlet', () => {
        const TestComponent = () => <div data-testid="test-content">Test Content</div>;

        render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<TestComponent />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('test-content')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('имеет правильный CSS класс', () => {
        const { container } = render(
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        );

        const layoutElement = container.firstChild;
        expect(layoutElement).toHaveClass('page');
    });

    it('сохраняет структуру с Header выше контента', () => {
        const TestComponent = () => <div>Main Content</div>;

        const { container } = render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<TestComponent />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        const layoutElement = container.firstChild;
        expect(layoutElement).toHaveClass('page');

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Main Content')).toBeInTheDocument();
    });

    it('работает с разными дочерними маршрутами', () => {
        const HomePage = () => <div data-testid="home">Home Page</div>;
        const AboutPage = () => <div data-testid="about">About Page</div>;

        render(
            <MemoryRouter initialEntries={['/about']}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="about" element={<AboutPage />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('about')).toBeInTheDocument();
        expect(screen.getByText('About Page')).toBeInTheDocument();
        expect(screen.queryByTestId('home')).not.toBeInTheDocument();
    });
});