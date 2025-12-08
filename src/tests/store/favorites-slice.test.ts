// __tests__/favorites-slice.test.ts
import favoritesReducer, {
  clearFavorites,
  fetchFavorites,
  toggleFavorite,
  updateFavoriteLocal
} from '../../store/slices/favorites-slice';
import { Offer } from '../../types/offer';

const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Offer 1',
    isFavorite: true,
    price: 100,
    rating: 4.5,
    type: 'apartment',
    previewImage: 'img1.jpg'
  } as Offer,
  {
    id: '2',
    title: 'Offer 2',
    isFavorite: true,
    price: 200,
    rating: 4.8,
    type: 'house',
    previewImage: 'img2.jpg'
  } as Offer
];

describe('Favorites Slice', () => {
  const initialState = {
    favorites: [],
    loading: false,
    error: null
  };

  describe('reducers', () => {
    it('should handle clearFavorites', () => {
      const stateWithFavorites = { ...initialState, favorites: mockOffers };
      const state = favoritesReducer(stateWithFavorites, clearFavorites());
      expect(state.favorites).toEqual([]);
    });

    it('should handle updateFavoriteLocal when removing favorite', () => {
      const stateWithFavorites = { ...initialState, favorites: mockOffers };
      const action = updateFavoriteLocal({ offerId: '1', isFavorite: false });
      const state = favoritesReducer(stateWithFavorites, action);

      expect(state.favorites).toHaveLength(1);
      expect(state.favorites[0].id).toBe('2');
    });

    it('should not remove when isFavorite is true in updateFavoriteLocal', () => {
      const stateWithFavorites = { ...initialState, favorites: mockOffers };
      const action = updateFavoriteLocal({ offerId: '1', isFavorite: true });
      const state = favoritesReducer(stateWithFavorites, action);

      expect(state.favorites).toHaveLength(2);
    });
  });

  describe('fetchFavorites thunk', () => {
    it('should set loading to true on pending', () => {
      const action = { type: fetchFavorites.pending.type };
      const state = favoritesReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled fetchFavorites', () => {
      const action = {
        type: fetchFavorites.fulfilled.type,
        payload: mockOffers
      };
      const state = favoritesReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.favorites).toEqual(mockOffers);
    });

    it('should handle rejected fetchFavorites', () => {
      const action = {
        type: fetchFavorites.rejected.type,
        error: { message: 'Failed to load' }
      };
      const state = favoritesReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to load');
    });
  });

  describe('toggleFavorite thunk', () => {
    const updatedOffer: Offer = {
      id: '1',
      title: 'Offer 1 Updated',
      isFavorite: false,
      price: 100,
      rating: 4.5,
      type: 'apartment',
      previewImage: 'img1.jpg'
    } as Offer;

    it('should handle fulfilled toggleFavorite when removing from favorites', () => {
      const stateWithFavorites = { ...initialState, favorites: mockOffers };
      const action = {
        type: toggleFavorite.fulfilled.type,
        payload: updatedOffer
      };

      const state = favoritesReducer(stateWithFavorites, action);

      expect(state.favorites).toHaveLength(1);
      expect(state.favorites[0].id).toBe('2');
    });

    it('should handle fulfilled toggleFavorite when adding to favorites', () => {
      const newOffer: Offer = {
        id: '3',
        title: 'Offer 3',
        isFavorite: true,
        price: 300,
        rating: 4.9,
        type: 'apartment',
        previewImage: 'img3.jpg'
      } as Offer;

      const stateWithFavorites = { ...initialState, favorites: mockOffers };
      const action = {
        type: toggleFavorite.fulfilled.type,
        payload: newOffer
      };

      const state = favoritesReducer(stateWithFavorites, action);

      expect(state.favorites).toHaveLength(3);
      expect(state.favorites[2].id).toBe('3');
    });

    it('should handle fulfilled toggleFavorite when updating existing favorite', () => {
      const updatedExisting: Offer = {
        ...mockOffers[0],
        title: 'Updated Title'
      };

      const stateWithFavorites = { ...initialState, favorites: mockOffers };
      const action = {
        type: toggleFavorite.fulfilled.type,
        payload: updatedExisting
      };

      const state = favoritesReducer(stateWithFavorites, action);

      expect(state.favorites[0].title).toBe('Updated Title');
    });

    it('should handle rejected toggleFavorite', () => {
      const action = { type: toggleFavorite.rejected.type };
      const state = favoritesReducer(initialState, action);

      expect(state.error).toBe('Failed to update favorite status');
    });
  });
});
