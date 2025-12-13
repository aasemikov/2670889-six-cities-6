import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Main from '.';
import { useAppSelector } from '../../store/hooks/redux';

vi.mock('../../store/hooks/redux', () => ({
    useAppDispatch: () => vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('../../store/slices/offers-slice', () => ({
    fetchOffers: vi.fn(),
    setActiveOfferId: vi.fn(),
    setSelectedCity: vi.fn(),
    setSelectedSort: vi.fn(),
}));

vi.mock('../../components/spinner', () => ({
    default: () => <div>Loading...</div>,
}));

vi.mock('../../components/main-empty', () => ({
    MainEmpty: () => <div>No offers</div>,
}));

describe('Main', () => {
    it('показывает спиннер при загрузке', () => {
        const mockUseAppSelector = vi.mocked(useAppSelector);
        mockUseAppSelector.mockImplementation((selector) =>
            selector({
                offers: {
                    offers: [],
                    cities: [],
                    selectedCity: { name: 'Paris', location: { latitude: 0, longitude: 0, zoom: 13 } },
                    selectedSort: 'popular',
                    activeOfferId: null,
                    loading: true,
                    error: null,
                },
                nearby: {
                    nearbyOffers: {},
                    loading: false,
                    error: null
                },
                detail: {
                    currentOffer: null,
                    loading: false,
                    error: null
                },
                auth: { user: null, authorizationStatus: 'NO_AUTH', loading: false, error: null },
                comments: {
                    comments: {},
                    loading: false,
                    error: null,
                    posting: true,
                    postError: '',
                },
                favorites: {
                    favorites: [],
                    loading: false,
                    error: null,
                }
            })
        );

        render(
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('показывает пустое состояние когда нет предложений', () => {
        const mockUseAppSelector = vi.mocked(useAppSelector);
        mockUseAppSelector.mockImplementation((selector) =>
            selector({
                offers: {
                    offers: [],
                    cities: [{ name: 'Paris', location: { latitude: 0, longitude: 0, zoom: 13 } }],
                    selectedCity: { name: 'Paris', location: { latitude: 0, longitude: 0, zoom: 13 } },
                    selectedSort: 'popular',
                    activeOfferId: null,
                    loading: false,
                    error: null,
                },
                nearby: { nearbyOffers: {}, loading: false, error: null },
                detail: { currentOffer: null, loading: false, error: null },
                auth: { user: null, authorizationStatus: 'NO_AUTH', loading: false, error: null },
                comments: { comments: {}, loading: false, error: null, postError: '', posting: true },
                favorites: {
                    favorites: [],
                    loading: false,
                    error: null,
                }
            })
        );

        render(
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        );

        expect(screen.getByText('No offers')).toBeInTheDocument();
    });

    it('показывает ошибку при неудачной загрузке', () => {
        const mockUseAppSelector = vi.mocked(useAppSelector);
        mockUseAppSelector.mockImplementation((selector) =>
            selector({
                offers: {
                    offers: [],
                    cities: [],
                    selectedCity: { name: 'Paris', location: { latitude: 0, longitude: 0, zoom: 13 } },
                    selectedSort: 'popular',
                    activeOfferId: null,
                    loading: false,
                    error: 'Failed to load',
                },
                nearby: { nearbyOffers: {}, loading: false, error: null },
                detail: { currentOffer: null, loading: false, error: null },
                auth: { user: null, authorizationStatus: 'NO_AUTH', loading: false, error: null },
                comments: { comments: {}, loading: false, error: null, postError: '', posting: true },
                favorites: { favorites: [], loading: false, error: null }
            })
        );

        render(
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        );

        expect(screen.getByText('Не удалось загрузить предложения')).toBeInTheDocument();
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });
});
