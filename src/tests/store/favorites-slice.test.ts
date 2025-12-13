import { describe, expect, it } from 'vitest';
import favoritesReducer, {
    clearFavorites,
    FavoritesState,
    fetchFavorites,
    toggleFavorite,
    updateFavoriteLocal
} from '../../store/slices/favorites-slice';
import { DetailedOffer, Offer, ShortOffer } from '../../types/offer';

describe('favorites slice', () => {
    const initialState: FavoritesState = {
        favorites: [],
        loading: false,
        error: null
    };

    const mockShortOffer: ShortOffer = {
        id: '1',
        title: 'Test Short Offer 1',
        type: 'apartment',
        price: 100,
        city: {
            name: 'Moscow',
            location: { latitude: 55.7558, longitude: 37.6176, zoom: 10 }
        },
        location: { latitude: 55.7558, longitude: 37.6176, zoom: 10 },
        isFavorite: true,
        isPremium: true,
        rating: 4.5,
        previewImage: 'img1.jpg'
    };

    const mockShortOffer2: ShortOffer = {
        id: '2',
        title: 'Test Short Offer 2',
        type: 'house',
        price: 200,
        city: {
            name: 'Paris',
            location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 }
        },
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
        isFavorite: true,
        isPremium: false,
        rating: 4.0,
        previewImage: 'img2.jpg'
    };

    const mockDetailedOffer: DetailedOffer = {
        id: '3',
        title: 'Test Detailed Offer 3',
        type: 'room',
        price: 50,
        city: {
            name: 'Berlin',
            location: { latitude: 52.5200, longitude: 13.4050, zoom: 10 }
        },
        location: { latitude: 52.5200, longitude: 13.4050, zoom: 10 },
        isFavorite: false,
        isPremium: false,
        rating: 3.5,
        description: 'A nice room in Berlin center',
        bedrooms: 1,
        goods: ['WiFi', 'Heating', 'Kitchen'],
        host: {
            name: 'John Doe',
            avatarUrl: 'avatar.jpg',
            isPro: true
        },
        images: ['img3-1.jpg', 'img3-2.jpg'],
        maxAdults: 2,
        previewImage: 'img3.jpg'
    };

    const mockDetailedOffer2: DetailedOffer = {
        id: '4',
        title: 'Test Detailed Offer 4',
        type: 'hotel',
        price: 300,
        city: {
            name: 'London',
            location: { latitude: 51.5074, longitude: -0.1278, zoom: 10 }
        },
        location: { latitude: 51.5074, longitude: -0.1278, zoom: 10 },
        isFavorite: true,
        isPremium: true,
        rating: 4.8,
        description: 'Luxury hotel in London',
        bedrooms: 3,
        goods: ['WiFi', 'Pool', 'Spa', 'Parking', 'Breakfast'],
        host: {
            name: 'Jane Smith',
            avatarUrl: 'avatar2.jpg',
            isPro: true
        },
        images: ['img4-1.jpg', 'img4-2.jpg', 'img4-3.jpg'],
        maxAdults: 4,
        previewImage: 'img4.jpg'
    };

    // Для типизации можем использовать как Offer
    const mockOffers: Offer[] = [mockShortOffer, mockShortOffer2, mockDetailedOffer2];
    const mockDetailedOfferAsOffer: Offer = mockDetailedOffer;

    describe('synchronous actions', () => {
        it('должен очищать все избранные предложения', () => {
            const stateWithFavorites: FavoritesState = {
                ...initialState,
                favorites: mockOffers
            };

            const state = favoritesReducer(stateWithFavorites, clearFavorites());

            expect(state.favorites).toEqual([]);
            expect(state.favorites).toHaveLength(0);
            expect(state.loading).toBe(false);
            expect(state.error).toBeNull();
        });

        it('должен удалять предложение из избранного локально при updateFavoriteLocal с isFavorite = false', () => {
            const stateWithFavorites: FavoritesState = {
                ...initialState,
                favorites: [...mockOffers, mockDetailedOfferAsOffer]
            };

            // Удаляем offer с id '2'
            const state = favoritesReducer(
                stateWithFavorites,
                updateFavoriteLocal({ offerId: '2', isFavorite: false })
            );

            expect(state.favorites).toHaveLength(3);
            expect(state.favorites.find(offer => offer.id === '2')).toBeUndefined();
            expect(state.favorites.find(offer => offer.id === '1')).toBeDefined();
            expect(state.favorites.find(offer => offer.id === '3')).toBeDefined();
            expect(state.favorites.find(offer => offer.id === '4')).toBeDefined();
        });

        it('не должен добавлять предложение при updateFavoriteLocal с isFavorite = true', () => {
            const state = favoritesReducer(
                initialState,
                updateFavoriteLocal({ offerId: '1', isFavorite: true })
            );

            expect(state.favorites).toHaveLength(0);
            // updateFavoriteLocal только удаляет, не добавляет
        });
    });

    describe('fetchFavorites thunk', () => {
        it('должен обрабатывать pending состояние', () => {
            const action = fetchFavorites.pending('', undefined);
            const state = favoritesReducer(initialState, action);

            expect(state.loading).toBe(true);
            expect(state.error).toBeNull();
            expect(state.favorites).toEqual([]);
        });

        it('должен обрабатывать fulfilled состояние и сохранять избранные предложения', () => {
            const favorites: Offer[] = [mockShortOffer, mockDetailedOffer2];
            const action = fetchFavorites.fulfilled(favorites, '', undefined);
            const state = favoritesReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.favorites).toEqual(favorites);
            expect(state.favorites).toHaveLength(2);
            expect(state.favorites[0].isFavorite).toBe(true);
            expect(state.favorites[1].isFavorite).toBe(true);
        });

        it('должен обрабатывать rejected состояние', () => {
            const error = new Error('Network error');
            const action = fetchFavorites.rejected(error, '', undefined);
            const state = favoritesReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.error).toBe('Network error');
            expect(state.favorites).toEqual([]);
        });

        it('должен использовать дефолтное сообщение об ошибке', () => {
            const action = fetchFavorites.rejected(new Error(), '', undefined);
            const state = favoritesReducer(initialState, action);

            expect(state.error).toBe('Failed to load favorites');
        });
    });

    describe('toggleFavorite thunk', () => {
        it('должен обрабатывать fulfilled состояние и добавлять ShortOffer в избранное если isFavorite = true', () => {
            const updatedOffer: ShortOffer = {
                ...mockShortOffer,
                id: '5',
                isFavorite: true
            };
            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '5', status: true });
            const state = favoritesReducer(initialState, action);

            expect(state.favorites).toHaveLength(1);
            expect(state.favorites[0]).toEqual(updatedOffer);
            expect(state.favorites[0].isFavorite).toBe(true);
            expect(state.error).toBeNull();
        });

        it('должен обрабатывать fulfilled состояние и добавлять DetailedOffer в избранное если isFavorite = true', () => {
            const updatedOffer: DetailedOffer = {
                ...mockDetailedOffer,
                isFavorite: true
            };
            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '3', status: true });
            const state = favoritesReducer(initialState, action);

            expect(state.favorites).toHaveLength(1);
            expect(state.favorites[0]).toEqual(updatedOffer);
            expect(state.favorites[0].isFavorite).toBe(true);
            // Проверяем что это DetailedOffer
            expect('description' in state.favorites[0]).toBe(true);
            expect('goods' in state.favorites[0]).toBe(true);
        });

        it('должен обрабатывать fulfilled состояние и удалять предложение из избранного если isFavorite = false', () => {
            const stateWithFavorites: FavoritesState = {
                ...initialState,
                favorites: [mockShortOffer, mockDetailedOffer2]
            };

            const updatedOffer = { ...mockShortOffer, isFavorite: false };
            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '1', status: false });
            const state = favoritesReducer(stateWithFavorites, action);

            expect(state.favorites).toHaveLength(1);
            expect(state.favorites[0]).toEqual(mockDetailedOffer2);
            expect(state.favorites.find(offer => offer.id === '1')).toBeUndefined();
        });

        it('должен обновлять существующее предложение в избранном если оно уже есть', () => {
            const stateWithFavorites: FavoritesState = {
                ...initialState,
                favorites: [mockShortOffer]
            };

            const updatedOffer = {
                ...mockShortOffer,
                title: 'Updated Title',
                price: 150,
                rating: 4.8
            };
            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '1', status: true });
            const state = favoritesReducer(stateWithFavorites, action);

            expect(state.favorites).toHaveLength(1);
            expect(state.favorites[0]).toEqual(updatedOffer);
            expect(state.favorites[0].title).toBe('Updated Title');
            expect(state.favorites[0].price).toBe(150);
            expect(state.favorites[0].rating).toBe(4.8);
        });

        it('должен обрабатывать rejected состояние', () => {
            const action = toggleFavorite.rejected(new Error(), '', { offerId: '1', status: true });
            const state = favoritesReducer(initialState, action);

            expect(state.error).toBe('Failed to update favorite status');
            expect(state.favorites).toEqual([]);
        });
    });

    describe('initial state', () => {
        it('должен возвращать initialState при пустом action', () => {
            const state = favoritesReducer(undefined, { type: '' });

            expect(state).toEqual(initialState);
        });
    });

    describe('edge cases', () => {
        it('должен корректно работать с пустым массивом избранных', () => {
            const updatedOffer = { ...mockShortOffer, isFavorite: false };
            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '1', status: false });
            const state = favoritesReducer(initialState, action);

            expect(state.favorites).toEqual([]);
        });

        it('не должен добавлять предложение если isFavorite = false при toggleFavorite', () => {
            const stateWithFavorites: FavoritesState = {
                ...initialState,
                favorites: [mockShortOffer]
            };

            const newOffer: ShortOffer = {
                ...mockShortOffer2,
                id: '6',
                isFavorite: false
            };
            const action = toggleFavorite.fulfilled(newOffer, '', { offerId: '6', status: false });
            const state = favoritesReducer(stateWithFavorites, action);

            expect(state.favorites).toHaveLength(1);
            expect(state.favorites[0]).toEqual(mockShortOffer);
        });

        it('должен корректно обрабатывать несколько операций toggleFavorite с разными типами предложений', () => {
            let state = favoritesReducer(initialState,
                toggleFavorite.fulfilled(mockShortOffer, '', { offerId: '1', status: true })
            );

            expect(state.favorites).toHaveLength(1);

            state = favoritesReducer(state,
                toggleFavorite.fulfilled(mockDetailedOffer2, '', { offerId: '4', status: true })
            );

            expect(state.favorites).toHaveLength(2);
            expect(state.favorites[0].type).toBe('apartment');
            expect(state.favorites[1].type).toBe('hotel');

            state = favoritesReducer(state,
                toggleFavorite.fulfilled({ ...mockShortOffer, isFavorite: false }, '', {
                    offerId: '1',
                    status: false
                })
            );

            expect(state.favorites).toHaveLength(1);
            expect(state.favorites[0].id).toBe('4');
            expect(state.favorites[0].type).toBe('hotel');
        });
    });
});