import nearbyReducer, { clearNearbyOffers, fetchNearbyOffers } from '../../store/slices/nearby-slice';
import { Offer } from '../../types/offer';

const mockOffers: Offer[] = [
    {
      id: '1',
      title: 'Nearby 1',
      isFavorite: true,
      price: 100,
      rating: 4.5,
      type: 'apartment',
      previewImage: 'img1.jpg'
    } as Offer,
    {
      id: '2',
      title: 'Nearby 2',
      isFavorite: false,
      price: 200,
      rating: 4.8,
      type: 'house',
      previewImage: 'img2.jpg'
    } as Offer
];

describe('Nearby Slice', () => {
  const initialState = {
    nearbyOffers: {},
    loading: false,
    error: null
  };

  describe('reducers', () => {
    it('should handle clearNearbyOffers', () => {
      const stateWithOffers = {
        ...initialState,
        nearbyOffers: { '1': mockOffers }
      };
      const state = nearbyReducer(stateWithOffers, clearNearbyOffers());
      expect(state.nearbyOffers).toEqual({});
    });
  });

  describe('fetchNearbyOffers thunk', () => {
    it('should set loading to true on pending', () => {
      const action = { type: fetchNearbyOffers.pending.type };
      const state = nearbyReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled fetchNearbyOffers', () => {
      const action = {
        type: fetchNearbyOffers.fulfilled.type,
        payload: mockOffers,
        meta: { arg: '1' }
      };
      const state = nearbyReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.nearbyOffers['1']).toEqual(mockOffers);
    });

    it('should handle rejected fetchNearbyOffers', () => {
      const action = {
        type: fetchNearbyOffers.rejected.type,
        error: { message: 'Failed to load' }
      };
      const state = nearbyReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to load');
    });
  });
});
