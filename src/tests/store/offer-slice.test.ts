import { describe, expect, it } from 'vitest';
import { toggleFavorite } from '../../store/slices/favorites-slice';
import offerDetailsReducer, {
    OfferDetailsState,
    clearOfferDetails,
    fetchOfferDetails,
    toggleFavoriteOffer
} from '../../store/slices/offer-slice';
import { DetailedOffer, ShortOffer } from '../../types/offer';

describe('offer details slice', () => {
    const initialState: OfferDetailsState = {
        currentOffer: null,
        loading: false,
        error: null
    };

    const mockShortOffer: ShortOffer = {
        id: '1',
        title: 'Test Short Offer',
        type: 'apartment',
        price: 100,
        city: {
            name: 'Moscow',
            location: { latitude: 55.7558, longitude: 37.6176, zoom: 10 }
        },
        location: { latitude: 55.7558, longitude: 37.6176, zoom: 10 },
        isFavorite: false,
        isPremium: true,
        rating: 4.5,
        previewImage: 'img1.jpg'
    };

    const mockDetailedOffer: DetailedOffer = {
        id: '2',
        title: 'Test Detailed Offer',
        type: 'house',
        price: 200,
        city: {
            name: 'Paris',
            location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 }
        },
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
        isFavorite: true,
        isPremium: true,
        rating: 4.8,
        description: 'Beautiful house in Paris center',
        bedrooms: 3,
        goods: ['WiFi', 'Parking', 'Garden'],
        host: {
            name: 'John Doe',
            avatarUrl: 'avatar.jpg',
            isPro: true
        },
        images: ['img2-1.jpg', 'img2-2.jpg'],
        maxAdults: 4,
        previewImage: 'img2.jpg'
    };

    describe('synchronous actions', () => {
        it('должен очищать текущее предложение', () => {
            const stateWithOffer: OfferDetailsState = {
                ...initialState,
                currentOffer: mockDetailedOffer
            };

            const state = offerDetailsReducer(stateWithOffer, clearOfferDetails());

            expect(state.currentOffer).toBeNull();
            expect(state.loading).toBe(false);
            expect(state.error).toBeNull();
        });

        it('должен переключать isFavorite для текущего предложения если ID совпадает', () => {
            const stateWithOffer: OfferDetailsState = {
                ...initialState,
                currentOffer: { ...mockShortOffer, isFavorite: false }
            };

            // Переключаем isFavorite для offer с id '1'
            const state = offerDetailsReducer(stateWithOffer, toggleFavoriteOffer('1'));

            expect(state.currentOffer?.isFavorite).toBe(true);
            expect(state.currentOffer?.id).toBe('1');
            expect(state.currentOffer?.title).toBe('Test Short Offer'); // остальные поля не изменились
        });

        it('не должен переключать isFavorite если ID не совпадает', () => {
            const stateWithOffer: OfferDetailsState = {
                ...initialState,
                currentOffer: { ...mockShortOffer, isFavorite: false }
            };

            // Пытаемся переключить для другого ID
            const state = offerDetailsReducer(stateWithOffer, toggleFavoriteOffer('999'));

            expect(state.currentOffer?.isFavorite).toBe(false); // не изменилось
        });

        it('не должен делать ничего если currentOffer равен null', () => {
            const state = offerDetailsReducer(initialState, toggleFavoriteOffer('1'));

            expect(state.currentOffer).toBeNull();
            expect(state).toEqual(initialState);
        });
    });

    describe('fetchOfferDetails thunk', () => {
        it('должен обрабатывать pending состояние', () => {
            const action = fetchOfferDetails.pending('', '1');
            const state = offerDetailsReducer(initialState, action);

            expect(state.loading).toBe(true);
            expect(state.error).toBeNull();
            expect(state.currentOffer).toBeNull();
        });

        it('должен обрабатывать fulfilled состояние и сохранять ShortOffer', () => {
            const action = fetchOfferDetails.fulfilled(mockShortOffer, '', '1');
            const state = offerDetailsReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.currentOffer).toEqual(mockShortOffer);
            expect(state.currentOffer?.type).toBe('apartment');
            expect(state.error).toBeNull();
        });

        it('должен обрабатывать fulfilled состояние и сохранять DetailedOffer', () => {
            const action = fetchOfferDetails.fulfilled(mockDetailedOffer, '', '2');
            const state = offerDetailsReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.currentOffer).toEqual(mockDetailedOffer);
            expect(state.currentOffer?.type).toBe('house');
            expect('description' in state.currentOffer!).toBe(true);
            expect('goods' in state.currentOffer!).toBe(true);
        });

        it('должен обрабатывать rejected состояние', () => {
            const error = new Error('Network error');
            const action = fetchOfferDetails.rejected(error, '', '1');
            const state = offerDetailsReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.error).toBe('Network error');
            expect(state.currentOffer).toBeNull();
        });

        it('должен использовать дефолтное сообщение об ошибке', () => {
            const action = fetchOfferDetails.rejected(new Error(), '', '1');
            const state = offerDetailsReducer(initialState, action);

            expect(state.error).toBe('Failed to load offer details');
        });

        it('должен заменять текущее предложение при новой загрузке', () => {
            let state = offerDetailsReducer(initialState,
                fetchOfferDetails.fulfilled(mockShortOffer, '', '1')
            );

            expect(state.currentOffer?.id).toBe('1');

            state = offerDetailsReducer(state,
                fetchOfferDetails.fulfilled(mockDetailedOffer, '', '2')
            );

            expect(state.currentOffer?.id).toBe('2');
            expect(state.currentOffer?.type).toBe('house');
        });
    });

    describe('toggleFavorite thunk (из favorites-slice)', () => {
        it('должен обновлять isFavorite текущего предложения если ID совпадает (true → false)', () => {
            const stateWithOffer: OfferDetailsState = {
                ...initialState,
                currentOffer: { ...mockDetailedOffer, isFavorite: true }
            };

            const updatedOffer = { ...mockDetailedOffer, isFavorite: false };
            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '2', status: false });
            const state = offerDetailsReducer(stateWithOffer, action);

            expect(state.currentOffer?.isFavorite).toBe(false);
            expect(state.currentOffer?.id).toBe('2');
            expect(state.currentOffer?.title).toBe('Test Detailed Offer');
        });

        it('должен обновлять isFavorite текущего предложения если ID совпадает (false → true)', () => {
            const stateWithOffer: OfferDetailsState = {
                ...initialState,
                currentOffer: { ...mockShortOffer, isFavorite: false }
            };

            const updatedOffer = { ...mockShortOffer, isFavorite: true };
            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '1', status: true });
            const state = offerDetailsReducer(stateWithOffer, action);

            expect(state.currentOffer?.isFavorite).toBe(true);
        });

        it('не должен изменять текущее предложение если ID не совпадает', () => {
            const stateWithOffer: OfferDetailsState = {
                ...initialState,
                currentOffer: { ...mockDetailedOffer, isFavorite: true }
            };

            const updatedOffer = { ...mockShortOffer, isFavorite: false };
            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '1', status: false });
            const state = offerDetailsReducer(stateWithOffer, action);

            expect(state.currentOffer?.isFavorite).toBe(true); // не изменилось
            expect(state.currentOffer?.id).toBe('2'); // осталось то же предложение
        });

        it('не должен делать ничего если currentOffer равен null', () => {
            const updatedOffer = { ...mockShortOffer, isFavorite: true };
            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '1', status: true });
            const state = offerDetailsReducer(initialState, action);

            expect(state.currentOffer).toBeNull();
            expect(state).toEqual(initialState);
        });
    });

    describe('initial state', () => {
        it('должен возвращать initialState при пустом action', () => {
            const state = offerDetailsReducer(undefined, { type: '' });

            expect(state).toEqual(initialState);
        });
    });

    describe('edge cases', () => {
        it('должен корректно обрабатывать последовательность действий', () => {
            let state = initialState;

            // Загружаем предложение
            state = offerDetailsReducer(state,
                fetchOfferDetails.fulfilled(mockDetailedOffer, '', '2')
            );
            expect(state.currentOffer?.isFavorite).toBe(true);

            // Переключаем локально
            state = offerDetailsReducer(state, toggleFavoriteOffer('2'));
            expect(state.currentOffer?.isFavorite).toBe(false);

            // Очищаем
            state = offerDetailsReducer(state, clearOfferDetails());
            expect(state.currentOffer).toBeNull();

            // Загружаем другое предложение
            state = offerDetailsReducer(state,
                fetchOfferDetails.fulfilled(mockShortOffer, '', '1')
            );
            expect(state.currentOffer?.id).toBe('1');
        });

        it('должен сохранять все поля предложения при обновлении isFavorite', () => {
            const stateWithOffer: OfferDetailsState = {
                ...initialState,
                currentOffer: mockDetailedOffer
            };

            const updatedOffer = {
                ...mockDetailedOffer,
                isFavorite: false,
                title: 'Updated Title'
            };

            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '2', status: false });
            const state = offerDetailsReducer(stateWithOffer, action);
            expect(state.currentOffer?.isFavorite).toBe(false);
            expect(state.currentOffer?.title).toBe('Test Detailed Offer');
            expect(state.currentOffer?.price).toBe(200);
        });
    });
});