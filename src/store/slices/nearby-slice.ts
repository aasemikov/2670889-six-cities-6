import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer } from '../../types/offer';

export interface NearbyState {
    nearbyOffers: Record<string, Offer[]>;
    loading: boolean;
    error: string | null;
}

const initialState: NearbyState = {
  nearbyOffers: {},
  loading: false,
  error: null,
};

export const fetchNearbyOffers = createAsyncThunk<
    Offer[],
    string,
    { extra: AxiosInstance }
>('nearby/fetchNearbyOffers', async (offerId, { extra: api }) => {
  const { data } = await api.get<Offer[]>(`/offers/${offerId}/nearby`);
  return data;
});

const nearbySlice = createSlice({
  name: 'nearby',
  initialState,
  reducers: {
    clearNearbyOffers: (state) => {
      state.nearbyOffers = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.loading = false;
        const offerId = action.meta.arg;
        state.nearbyOffers[offerId] = action.payload;
      })
      .addCase(fetchNearbyOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load nearby offers';
      });
  },
});

export const { clearNearbyOffers } = nearbySlice.actions;
export default nearbySlice.reducer;
