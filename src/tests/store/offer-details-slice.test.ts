import { toggleFavorite } from '../../store/slices/favorites-slice';
import offerDetailsReducer, {
  clearOfferDetails,
  fetchOfferDetails,
  toggleFavoriteOffer
} from '../../store/slices/offer-slice';
import { Offer } from '../../types/offer';

const mockOffer: Offer = {
  id: '1',
  title: 'Test Offer',
  isFavorite: true,
  price: 100,
  rating: 4.5,
  type: 'apartment',
  previewImage: 'img1.jpg'
} as Offer;

describe('Offer Details Slice', () => {
  const initialState = {
    currentOffer: null,
    loading: false,
    error: null
  };

  describe('reducers', () => {
    it('should handle clearOfferDetails', () => {
      const stateWithOffer = { ...initialState, currentOffer: mockOffer };
      const state = offerDetailsReducer(stateWithOffer, clearOfferDetails());
      expect(state.currentOffer).toBeNull();
    });

    it('should handle toggleFavoriteOffer when offer matches', () => {
      const stateWithOffer = { ...initialState, currentOffer: mockOffer };
      const action = toggleFavoriteOffer('1');
      const state = offerDetailsReducer(stateWithOffer, action);

      expect(state.currentOffer?.isFavorite).toBe(false);
    });

    it('should not toggle favorite when offer id does not match', () => {
      const stateWithOffer = { ...initialState, currentOffer: mockOffer };
      const action = toggleFavoriteOffer('2');
      const state = offerDetailsReducer(stateWithOffer, action);

      expect(state.currentOffer?.isFavorite).toBe(true);
    });
  });

  describe('fetchOfferDetails thunk', () => {
    it('should set loading to true on pending', () => {
      const action = { type: fetchOfferDetails.pending.type };
      const state = offerDetailsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled fetchOfferDetails', () => {
      const action = {
        type: fetchOfferDetails.fulfilled.type,
        payload: mockOffer
      };
      const state = offerDetailsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.currentOffer).toEqual(mockOffer);
    });

    it('should handle rejected fetchOfferDetails', () => {
      const action = {
        type: fetchOfferDetails.rejected.type,
        error: { message: 'Failed to load' }
      };
      const state = offerDetailsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to load');
      expect(state.currentOffer).toBeNull();
    });
  });

  describe('toggleFavorite effect from favorites slice', () => {
    it('should update current offer when toggleFavorite is fulfilled and ids match', () => {
      const stateWithOffer = { ...initialState, currentOffer: mockOffer };
      const updatedOffer = { ...mockOffer, isFavorite: false };

      const action = {
        type: toggleFavorite.fulfilled.type,
        payload: updatedOffer
      };

      const state = offerDetailsReducer(stateWithOffer, action);

      expect(state.currentOffer?.isFavorite).toBe(false);
    });

    it('should not update current offer when toggleFavorite is fulfilled and ids do not match', () => {
      const stateWithOffer = { ...initialState, currentOffer: mockOffer };
      const otherOffer = { ...mockOffer, id: '2', isFavorite: false };

      const action = {
        type: toggleFavorite.fulfilled.type,
        payload: otherOffer
      };

      const state = offerDetailsReducer(stateWithOffer, action);

      expect(state.currentOffer?.isFavorite).toBe(true);
    });
  });
});
