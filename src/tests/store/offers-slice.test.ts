import { describe, expect, it } from 'vitest';
import { toggleFavorite } from '../../store/slices/favorites-slice';
import offersReducer, {
    OffersState,
    fetchOffers,
    setActiveOfferId,
    setSelectedCity,
    setSelectedSort
} from '../../store/slices/offers-slice';
import { City, DetailedOffer, Offer, ShortOffer } from '../../types/offer';

const mockCities: City[] = [
    {
        name: 'Paris',
        location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 }
    },
    {
        name: 'Cologne',
        location: { latitude: 50.9375, longitude: 6.9603, zoom: 10 }
    },
    {
        name: 'Brussels',
        location: { latitude: 50.8503, longitude: 4.3517, zoom: 10 }
    },
    {
        name: 'Amsterdam',
        location: { latitude: 52.3676, longitude: 4.9041, zoom: 10 }
    },
    {
        name: 'Hamburg',
        location: { latitude: 53.5511, longitude: 9.9937, zoom: 10 }
    },
    {
        name: 'Dusseldorf',
        location: { latitude: 51.2277, longitude: 6.7735, zoom: 10 }
    }
];

describe('offers slice', () => {
    const initialState: OffersState = {
        offers: [],
        cities: mockCities,
        selectedCity: mockCities[0],
        selectedSort: 'popular',
        activeOfferId: null,
        loading: false,
        error: null
    };

    const mockShortOffer: ShortOffer = {
        id: '1',
        title: 'Paris Apartment',
        type: 'apartment',
        price: 100,
        city: mockCities[0], 
        location: { latitude: 48.86, longitude: 2.35, zoom: 12 },
        isFavorite: true,
        isPremium: true,
        rating: 4.5,
        previewImage: 'img1.jpg'
    };

    const mockDetailedOffer: DetailedOffer = {
        id: '2',
        title: 'Cologne House',
        type: 'house',
        price: 200,
        city: mockCities[1],
        location: { latitude: 50.94, longitude: 6.96, zoom: 12 },
        isFavorite: false,
        isPremium: false,
        rating: 4.0,
        description: 'Nice house in Cologne',
        bedrooms: 3,
        goods: ['WiFi', 'Parking'],
        host: {
            name: 'John Doe',
            avatarUrl: 'avatar.jpg',
            isPro: true
        },
        images: ['img2-1.jpg', 'img2-2.jpg'],
        maxAdults: 4,
        previewImage: 'img2.jpg'
    };

    const mockShortOffer2: ShortOffer = {
        id: '3',
        title: 'Amsterdam Room',
        type: 'room',
        price: 50,
        city: mockCities[3],
        location: { latitude: 52.37, longitude: 4.90, zoom: 12 },
        isFavorite: true,
        isPremium: true,
        rating: 4.8,
        previewImage: 'img3.jpg'
    };

    const mockOffers: Offer[] = [mockShortOffer, mockDetailedOffer, mockShortOffer2];

    describe('synchronous actions', () => {
        it('должен устанавливать выбранный город и сбрасывать activeOfferId', () => {
            const newCity = mockCities[2];
            const stateWithActiveOffer: OffersState = {
                ...initialState,
                activeOfferId: '1'
            };

            const state = offersReducer(stateWithActiveOffer, setSelectedCity(newCity));

            expect(state.selectedCity).toEqual(newCity);
            expect(state.selectedCity.name).toBe('Brussels');
            expect(state.activeOfferId).toBeNull();
            expect(state.offers).toEqual([]);
            expect(state.cities).toEqual(mockCities);
        });

        it('должен устанавливать выбранную сортировку', () => {
            const newSort = 'price: high to low';
            const state = offersReducer(initialState, setSelectedSort(newSort));

            expect(state.selectedSort).toBe(newSort);
            expect(state.selectedCity).toEqual(mockCities[0]);
            expect(state.activeOfferId).toBeNull();
        });

        it('должен устанавливать activeOfferId', () => {
            const state = offersReducer(initialState, setActiveOfferId('123'));

            expect(state.activeOfferId).toBe('123');
            expect(state.selectedCity).toEqual(mockCities[0]); 
            expect(state.selectedSort).toBe('popular');
        });

        it('должен сбрасывать activeOfferId в null', () => {
            const stateWithActiveOffer: OffersState = {
                ...initialState,
                activeOfferId: '123'
            };

            const state = offersReducer(stateWithActiveOffer, setActiveOfferId(null));

            expect(state.activeOfferId).toBeNull();
        });
    });

    describe('fetchOffers thunk', () => {
        it('должен обрабатывать pending состояние', () => {
            const action = fetchOffers.pending('', undefined);
            const state = offersReducer(initialState, action);

            expect(state.loading).toBe(true);
            expect(state.error).toBeNull();
            expect(state.offers).toEqual([]);
            expect(state.selectedCity).toEqual(mockCities[0]);
        });

        it('должен обрабатывать fulfilled состояние и сохранять предложения', () => {
            const action = fetchOffers.fulfilled(mockOffers, '', undefined);
            const state = offersReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.offers).toEqual(mockOffers);
            expect(state.offers).toHaveLength(3);
            expect(state.error).toBeNull();
            expect(state.selectedCity).toEqual(mockCities[0]); // не изменилось
        });

        it('должен обрабатывать fulfilled состояние с пустым массивом', () => {
            const action = fetchOffers.fulfilled([], '', undefined);
            const state = offersReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.offers).toEqual([]);
            expect(state.offers).toHaveLength(0);
        });

        it('должен обрабатывать rejected состояние', () => {
            const error = new Error('Network error');
            const action = fetchOffers.rejected(error, '', undefined);
            const state = offersReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.error).toBe('Network error');
            expect(state.offers).toEqual([]);
        });

        it('должен использовать дефолтное сообщение об ошибке', () => {
            const action = fetchOffers.rejected(new Error(), '', undefined);
            const state = offersReducer(initialState, action);

            expect(state.error).toBe('Failed to load offers');
        });

        it('должен заменять существующие предложения при новой загрузке', () => {
            const stateWithOffers: OffersState = {
                ...initialState,
                offers: [mockShortOffer]
            };

            const newOffers: Offer[] = [mockDetailedOffer, mockShortOffer2];
            const action = fetchOffers.fulfilled(newOffers, '', undefined);
            const state = offersReducer(stateWithOffers, action);

            expect(state.offers).toEqual(newOffers);
            expect(state.offers).toHaveLength(2);
            expect(state.offers[0].id).toBe('2');
        });
    });

    describe('toggleFavorite thunk (из favorites-slice)', () => {
        it('должен обновлять isFavorite в предложении если оно есть в списке', () => {
            const stateWithOffers: OffersState = {
                ...initialState,
                offers: mockOffers
            };

            const updatedOffer = { ...mockDetailedOffer, isFavorite: true };
            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '2', status: true });
            const state = offersReducer(stateWithOffers, action);

            const updatedIndex = state.offers.findIndex(offer => offer.id === '2');
            expect(state.offers[updatedIndex].isFavorite).toBe(true);
            expect(state.offers).toHaveLength(3);
        });

        it('должен обновлять isFavorite с true на false', () => {
            const stateWithOffers: OffersState = {
                ...initialState,
                offers: mockOffers
            };

            const updatedOffer = { ...mockShortOffer, isFavorite: false };
            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '1', status: false });
            const state = offersReducer(stateWithOffers, action);

            const updatedIndex = state.offers.findIndex(offer => offer.id === '1');
            expect(state.offers[updatedIndex].isFavorite).toBe(false);
        });

        it('не должен изменять предложения если ID не найден', () => {
            const stateWithOffers: OffersState = {
                ...initialState,
                offers: mockOffers
            };

            const nonExistentOffer = { ...mockShortOffer, id: '999', isFavorite: true };
            const action = toggleFavorite.fulfilled(nonExistentOffer, '', { offerId: '999', status: true });
            const state = offersReducer(stateWithOffers, action);

            expect(state.offers[0].isFavorite).toBe(true);
            expect(state.offers[1].isFavorite).toBe(false);
            expect(state.offers[2].isFavorite).toBe(true);
        });

        it('не должен изменять другие поля предложения кроме isFavorite', () => {
            const stateWithOffers: OffersState = {
                ...initialState,
                offers: [mockDetailedOffer]
            };

            const updatedOffer = {
                ...mockDetailedOffer,
                isFavorite: true,
                title: 'Updated Title',
                price: 999
            };

            const action = toggleFavorite.fulfilled(updatedOffer, '', { offerId: '2', status: true });
            const state = offersReducer(stateWithOffers, action);

            expect(state.offers[0].isFavorite).toBe(true);
            expect(state.offers[0].title).toBe('Cologne House');
            expect(state.offers[0].price).toBe(200);
            expect(state.offers[0].rating).toBe(4.0);
        });
    });

    describe('edge cases', () => {
        it('должен корректно работать с пустым списком предложений', () => {
            const state = offersReducer(initialState,
                toggleFavorite.fulfilled(mockShortOffer, '', { offerId: '1', status: true })
            );

            expect(state.offers).toEqual([]); 
        });

        it('должен сохранять состояние при последовательных действиях', () => {
            let state = initialState;

            state = offersReducer(state, setSelectedCity(mockCities[1]));
            expect(state.selectedCity.name).toBe('Cologne');
            expect(state.activeOfferId).toBeNull();

            state = offersReducer(state, setSelectedSort('price: low to high'));
            expect(state.selectedSort).toBe('price: low to high');

            state = offersReducer(state, setActiveOfferId('123'));
            expect(state.activeOfferId).toBe('123');
            state = offersReducer(state, fetchOffers.fulfilled(mockOffers, '', undefined));
            expect(state.offers).toHaveLength(3);
            expect(state.loading).toBe(false);
            expect(state.selectedCity.name).toBe('Cologne');

            state = offersReducer(state, setSelectedCity(mockCities[3]));
            expect(state.selectedCity.name).toBe('Amsterdam');
            expect(state.activeOfferId).toBeNull();
        });

        it('должен обрабатывать toggleFavorite для разных типов предложений', () => {
            const stateWithMixedOffers: OffersState = {
                ...initialState,
                offers: mockOffers
            };

            let state = offersReducer(stateWithMixedOffers,
                toggleFavorite.fulfilled({ ...mockShortOffer, isFavorite: false }, '', {
                    offerId: '1',
                    status: false
                })
            );

            expect(state.offers[0].isFavorite).toBe(false);

            state = offersReducer(state,
                toggleFavorite.fulfilled({ ...mockDetailedOffer, isFavorite: true }, '', {
                    offerId: '2',
                    status: true
                })
            );

            expect(state.offers[1].isFavorite).toBe(true);
            state = offersReducer(state,
                toggleFavorite.fulfilled({ ...mockShortOffer2, isFavorite: false }, '', {
                    offerId: '3',
                    status: false
                })
            );

            expect(state.offers[2].isFavorite).toBe(false);
        });
    });
});