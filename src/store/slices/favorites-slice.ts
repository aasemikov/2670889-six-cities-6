import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer } from '../../types/offer';

interface FavoritesState {
  favorites: Offer[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk<
  Offer[],
  void,
  { extra: AxiosInstance }
>('favorites/fetchFavorites', async (_, { extra: api }) => {
  const { data } = await api.get<Offer[]>('/favorite');
  return data;
});

export const toggleFavorite = createAsyncThunk<
  Offer,
  { offerId: string; status: boolean },
  { extra: AxiosInstance }
>('favorites/toggleFavorite', async ({ offerId, status }, { extra: api }) => {
  const { data } = await api.post<Offer>(`/favorite/${offerId}/${status ? 1 : 0}`);
  return data;
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
    },
    updateFavoriteLocal: (state, action: PayloadAction<{ offerId: string; isFavorite: boolean }>) => {
      const { offerId, isFavorite } = action.payload;

      if (!isFavorite) {
        state.favorites = state.favorites.filter((offer) => offer.id !== offerId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load favorites';
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const updatedOffer = action.payload;

        if (updatedOffer.isFavorite) {
          const existingIndex = state.favorites.findIndex((offer) => offer.id === updatedOffer.id);
          if (existingIndex >= 0) {
            state.favorites[existingIndex] = updatedOffer;
          } else {
            state.favorites.push(updatedOffer);
          }
        } else {
          state.favorites = state.favorites.filter((offer) => offer.id !== updatedOffer.id);
        }
      })
      .addCase(toggleFavorite.rejected, (state) => {
        state.error = 'Failed to update favorite status';
      });
  },
});

export const { clearFavorites, updateFavoriteLocal } = favoritesSlice.actions;
export default favoritesSlice.reducer;
