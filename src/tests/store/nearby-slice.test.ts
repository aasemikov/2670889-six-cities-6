import { describe, expect, it } from 'vitest';
import nearbyReducer, {
  NearbyState,
  clearNearbyOffers,
  fetchNearbyOffers
} from '../../store/slices/nearby-slice';
import { DetailedOffer, Offer, ShortOffer } from '../../types/offer';

describe('nearby slice', () => {
  const initialState: NearbyState = {
    nearbyOffers: {},
    loading: false,
    error: null
  };

  const mockShortOffer: ShortOffer = {
    id: '1',
    title: 'Nearby Short Offer 1',
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
    title: 'Nearby Short Offer 2',
    type: 'room',
    price: 50,
    city: {
      name: 'Moscow',
      location: { latitude: 55.7558, longitude: 37.6176, zoom: 10 }
    },
    location: { latitude: 55.7558, longitude: 37.6176, zoom: 10 },
    isFavorite: false,
    isPremium: false,
    rating: 4.0,
    previewImage: 'img2.jpg'
  };

  const mockDetailedOffer: DetailedOffer = {
    id: '3',
    title: 'Nearby Detailed Offer 3',
    type: 'house',
    price: 200,
    city: {
      name: 'Moscow',
      location: { latitude: 55.7558, longitude: 37.6176, zoom: 10 }
    },
    location: { latitude: 55.7558, longitude: 37.6176, zoom: 10 },
    isFavorite: true,
    isPremium: true,
    rating: 4.8,
    description: 'Beautiful house near the city center',
    bedrooms: 3,
    goods: ['WiFi', 'Parking', 'Garden'],
    host: {
      name: 'John Doe',
      avatarUrl: 'avatar.jpg',
      isPro: true
    },
    images: ['img3-1.jpg', 'img3-2.jpg'],
    maxAdults: 4,
    previewImage: 'img3.jpg'
  };

  const mockOffersForOffer1: Offer[] = [mockShortOffer, mockShortOffer2];
  const mockOffersForOffer2: Offer[] = [mockDetailedOffer];

  describe('synchronous actions', () => {
    it('должен очищать все nearby предложения', () => {
      const stateWithData: NearbyState = {
        ...initialState,
        nearbyOffers: {
          'offer1': mockOffersForOffer1,
          'offer2': mockOffersForOffer2
        }
      };

      const state = nearbyReducer(stateWithData, clearNearbyOffers());

      expect(state.nearbyOffers).toEqual({});
      expect(state.nearbyOffers['offer1']).toBeUndefined();
      expect(state.nearbyOffers['offer2']).toBeUndefined();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchNearbyOffers thunk', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = fetchNearbyOffers.pending('', 'offer1');
      const state = nearbyReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.nearbyOffers).toEqual({});
    });

    it('должен обрабатывать fulfilled состояние и сохранять nearby предложения по offerId', () => {
      const action = fetchNearbyOffers.fulfilled(mockOffersForOffer1, '', 'offer1');
      const state = nearbyReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.nearbyOffers['offer1']).toEqual(mockOffersForOffer1);
      expect(state.nearbyOffers['offer1']).toHaveLength(2);
      expect(state.nearbyOffers['offer2']).toBeUndefined();
      expect(state.error).toBeNull();
    });

    it('должен перезаписывать nearby предложения для существующего offerId', () => {
      const stateWithExisting: NearbyState = {
        ...initialState,
        nearbyOffers: {
          'offer1': [mockShortOffer]
        }
      };

      const newOffers: Offer[] = [mockShortOffer2, mockDetailedOffer];
      const action = fetchNearbyOffers.fulfilled(newOffers, '', 'offer1');
      const state = nearbyReducer(stateWithExisting, action);

      expect(state.nearbyOffers['offer1']).toEqual(newOffers);
      expect(state.nearbyOffers['offer1']).toHaveLength(2);
    });

    it('должен сохранять nearby предложения для разных offerId независимо', () => {
      let state = nearbyReducer(initialState,
        fetchNearbyOffers.fulfilled(mockOffersForOffer1, '', 'offer1')
      );

      expect(state.nearbyOffers['offer1']).toBeDefined();
      expect(state.nearbyOffers['offer2']).toBeUndefined();

      state = nearbyReducer(state,
        fetchNearbyOffers.fulfilled(mockOffersForOffer2, '', 'offer2')
      );

      expect(state.nearbyOffers['offer1']).toHaveLength(2);
      expect(state.nearbyOffers['offer2']).toHaveLength(1);
      expect(state.nearbyOffers['offer1']).toEqual(mockOffersForOffer1);
      expect(state.nearbyOffers['offer2']).toEqual(mockOffersForOffer2);
    });

    it('должен обрабатывать rejected состояние', () => {
      const error = new Error('Network error');
      const action = fetchNearbyOffers.rejected(error, '', 'offer1');
      const state = nearbyReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.nearbyOffers).toEqual({});
    });

    it('должен использовать дефолтное сообщение об ошибке', () => {
      const action = fetchNearbyOffers.rejected(new Error(), '', 'offer1');
      const state = nearbyReducer(initialState, action);

      expect(state.error).toBe('Failed to load nearby offers');
    });

    it('не должен изменять nearby предложения других offerId при ошибке', () => {
      const stateWithData: NearbyState = {
        ...initialState,
        nearbyOffers: {
          'offer1': mockOffersForOffer1,
          'offer2': mockOffersForOffer2
        }
      };

      const action = fetchNearbyOffers.rejected(new Error('Error'), '', 'offer3');
      const state = nearbyReducer(stateWithData, action);

      expect(state.error).toBe('Error');
      expect(state.nearbyOffers['offer1']).toEqual(mockOffersForOffer1);
      expect(state.nearbyOffers['offer2']).toEqual(mockOffersForOffer2);
      expect(state.nearbyOffers['offer3']).toBeUndefined();
    });
  });

  describe('initial state', () => {
    it('должен возвращать initialState при пустом action', () => {
      const state = nearbyReducer(undefined, { type: '' });

      expect(state).toEqual(initialState);
    });
  });

  describe('edge cases', () => {
    it('должен корректно обрабатывать пустой массив nearby предложений', () => {
      const action = fetchNearbyOffers.fulfilled([], '', 'offer1');
      const state = nearbyReducer(initialState, action);

      expect(state.nearbyOffers['offer1']).toEqual([]);
      expect(state.nearbyOffers['offer1']).toHaveLength(0);
      expect(state.loading).toBe(false);
    });

    it('должен сохранять разные типы предложений (ShortOffer и DetailedOffer)', () => {
      const mixedOffers: Offer[] = [mockShortOffer, mockDetailedOffer];
      const action = fetchNearbyOffers.fulfilled(mixedOffers, '', 'offer1');
      const state = nearbyReducer(initialState, action);

      expect(state.nearbyOffers['offer1']).toHaveLength(2);

      const firstOffer = state.nearbyOffers['offer1'][0];
      const secondOffer = state.nearbyOffers['offer1'][1];

      expect('previewImage' in firstOffer).toBe(true);
      expect('description' in firstOffer).toBe(false);

      expect('description' in secondOffer).toBe(true);
      expect('goods' in secondOffer).toBe(true);
    });

    it('должен корректно работать с большим количеством разных offerId', () => {
      let state = initialState;
      const offerIds = ['offer1', 'offer2', 'offer3', 'offer4'];

      offerIds.forEach((offerId, index) => {
        const offers = [mockShortOffer, { ...mockShortOffer2, id: `${index}` }];
        state = nearbyReducer(state,
          fetchNearbyOffers.fulfilled(offers, '', offerId)
        );
      });

      expect(Object.keys(state.nearbyOffers)).toHaveLength(4);
      expect(state.nearbyOffers['offer1']).toHaveLength(2);
      expect(state.nearbyOffers['offer2']).toHaveLength(2);
      expect(state.nearbyOffers['offer3']).toHaveLength(2);
      expect(state.nearbyOffers['offer4']).toHaveLength(2);
    });
  });
});
