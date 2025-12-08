import { cities } from '../../mocks/cities';
import { toggleFavorite } from '../../store/slices/favorites-slice';
import offersReducer, {
  fetchOffers,
  setActiveOfferId,
  setSelectedCity,
  setSelectedSort
} from '../../store/slices/offers-slice';
import { Offer } from '../../types/offer';

const mockOffers: Offer[] = [
    {
      id: '1',
      title: 'Offer 1',
      isFavorite: true,
      price: 100,
      rating: 4.5,
      type: 'apartment',
      city: cities[0],
      previewImage: 'img1.jpg'
    } as Offer,
    {
      id: '2',
      title: 'Offer 2',
      isFavorite: false,
      price: 200,
      rating: 4.8,
      type: 'house',
      city: cities[0],
      previewImage: 'img2.jpg'
    } as Offer
];

describe('Offers Slice', () => {
  const initialState = {
    offers: [],
    cities: cities,
    selectedCity: cities[0],
    selectedSort: 'popular',
    activeOfferId: null,
    loading: false,
    error: null
  };

  describe('reducers', () => {
    it('should handle setSelectedCity', () => {
      const action = setSelectedCity(cities[1]);
      const state = offersReducer(initialState, action);

      expect(state.selectedCity).toBe(cities[1]);
      expect(state.activeOfferId).toBeNull();
    });

    it('should handle setSelectedSort', () => {
      const action = setSelectedSort('price_high_to_low');
      const state = offersReducer(initialState, action);

      expect(state.selectedSort).toBe('price_high_to_low');
    });

    it('should handle setActiveOfferId', () => {
      const action = setActiveOfferId('1');
      const state = offersReducer(initialState, action);

      expect(state.activeOfferId).toBe('1');
    });

    it('should handle setActiveOfferId with null', () => {
      const stateWithActiveId = { ...initialState, activeOfferId: '1' };
      const action = setActiveOfferId(null);
      const state = offersReducer(stateWithActiveId, action);

      expect(state.activeOfferId).toBeNull();
    });
  });

  describe('fetchOffers thunk', () => {
    it('should set loading to true on pending', () => {
      const action = { type: fetchOffers.pending.type };
      const state = offersReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled fetchOffers', () => {
      const action = {
        type: fetchOffers.fulfilled.type,
        payload: mockOffers
      };
      const state = offersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.offers).toEqual(mockOffers);
    });

    it('should handle rejected fetchOffers', () => {
      const action = {
        type: fetchOffers.rejected.type,
        error: { message: 'Failed to load' }
      };
      const state = offersReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to load');
      expect(state.offers).toEqual([]);
    });
  });

  describe('toggleFavorite effect from favorites slice', () => {
    it('should update offer favorite status when toggleFavorite is fulfilled', () => {
      const stateWithOffers = { ...initialState, offers: mockOffers };
      const updatedOffer = { ...mockOffers[1], isFavorite: true };

      const action = {
        type: toggleFavorite.fulfilled.type,
        payload: updatedOffer
      };

      const state = offersReducer(stateWithOffers, action);

      expect(state.offers[1].isFavorite).toBe(true);
    });

    it('should not update anything when offer not found', () => {
      const stateWithOffers = { ...initialState, offers: mockOffers };
      const otherOffer = { ...mockOffers[0], id: '3', isFavorite: false };

      const action = {
        type: toggleFavorite.fulfilled.type,
        payload: otherOffer
      };

      const state = offersReducer(stateWithOffers, action);

      expect(state.offers).toEqual(mockOffers);
    });
  });
});
