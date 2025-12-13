import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { FavoritesPage } from '.';

describe('FavoritesPage', () => {
    vi.mock('../../store/hooks/redux', () => ({
        useAppSelector: vi.fn((selector: any) =>
            selector({
                offers: {
                    offers: [] as any[],
                    cities: [] as any[],
                    selectedCity: {} as any,
                    selectedSort: 'Popular',
                    activeOfferId: null,
                    loading: false,
                    error: null
                },
                nearby: { offers: [], loading: false, error: null } as any,
                detail: { offer: null, loading: false, error: null } as any,
                auth: { user: null, authorizationStatus: 'NO_AUTH', loading: false, error: null } as any,
                favorites: { favorites: [], loading: false, error: null } as any,
                comments: { comments: [], loading: false, error: null } as any,
            })
        ),
    }));

    vi.mock('../../components/article-item', () => ({
        ArticleItem: () => null,
    }));

    it('показывает Saved listing и пустое состояние', () => {
        render(
            <MemoryRouter>
                <FavoritesPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Saved listing')).toBeInTheDocument();
        expect(screen.getByText('No favorites yet')).toBeInTheDocument();
    });
});