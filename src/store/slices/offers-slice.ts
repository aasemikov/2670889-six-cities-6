import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { cities } from '../../mocks/cities';
import { City, Offer } from '../../types/offer';
import { toggleFavorite } from './favorites-slice';

export interface OffersState {
  offers: Offer[];
  cities: City[];
  selectedCity: City;
  selectedSort: string;
  activeOfferId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: OffersState = {
  offers: [],
  cities: cities,
  selectedCity: cities[0],
  selectedSort: 'popular',
  activeOfferId: null,
  loading: false,
  error: null,
};

export const fetchOffers = createAsyncThunk<
  Offer[],
  void,
  { extra: AxiosInstance }
>('offers/fetchOffers', async (_, { extra: api }) => {
  const { data } = await api.get<Offer[]>('/offers');
  return data;
});

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setSelectedCity: (state, action: PayloadAction<(typeof cities)[0]>) => {
      state.selectedCity = action.payload;
      state.activeOfferId = null;
    },
    setSelectedSort: (state, action: PayloadAction<string>) => {
      state.selectedSort = action.payload;
    },
    setActiveOfferId: (state, action: PayloadAction<string | null>) => {
      state.activeOfferId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load offers';
        state.offers = [];
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        const index = state.offers.findIndex((offer) => offer.id === updatedOffer.id);
        if (index >= 0) {
          state.offers[index].isFavorite = updatedOffer.isFavorite;
        }
      });
  },
});

export const {
  setSelectedCity,
  setSelectedSort,
  setActiveOfferId,
} = offersSlice.actions;

export default offersSlice.reducer;
