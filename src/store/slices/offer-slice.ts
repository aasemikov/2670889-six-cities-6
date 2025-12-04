import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer } from '../../types/offer';
import { toggleFavorite } from './favorites-slice';

interface OfferDetailsState {
  currentOffer: Offer | null;
  loading: boolean;
  error: string | null;
}

const initialState: OfferDetailsState = {
  currentOffer: null,
  loading: false,
  error: null,
};

export const fetchOfferDetails = createAsyncThunk<
  Offer,
  string,
  { extra: AxiosInstance }
>('offerDetails/fetchOfferDetails', async (offerId, { extra: api }) => {
  const { data } = await api.get<Offer>(`/offers/${offerId}`);
  return data;
});

const offerDetailsSlice = createSlice({
  name: 'offerDetails',
  initialState,
  reducers: {
    clearOfferDetails: (state) => {
      state.currentOffer = null;
    },
    toggleFavoriteOffer: (state, action: PayloadAction<string>) => {
      if (state.currentOffer && state.currentOffer.id === action.payload) {
        state.currentOffer.isFavorite = !state.currentOffer.isFavorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfferDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfferDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOffer = action.payload;
      })
      .addCase(fetchOfferDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load offer details';
        state.currentOffer = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (state.currentOffer?.id === action.payload.id) {
          state.currentOffer.isFavorite = action.payload.isFavorite;
        }
      });
  },
});

export const { clearOfferDetails, toggleFavoriteOffer } = offerDetailsSlice.actions;
export default offerDetailsSlice.reducer;
