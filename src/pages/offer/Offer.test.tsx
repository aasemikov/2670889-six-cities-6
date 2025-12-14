import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import mockConfigureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { OfferPage } from '.';
import { fetchComments } from '../../store/slices/comment-slice';
import { fetchNearbyOffers } from '../../store/slices/nearby-slice';
import { fetchOfferDetails } from '../../store/slices/offer-slice';

vi.mock('../../components/offer-page-items/gallery', () => ({
  OfferGallery: () => <div>OfferGallery Mock</div>
}));
vi.mock('../../components/offer-page-items/offer-header', () => ({
  OfferHeader: () => <div>OfferHeader Mock</div>
}));
vi.mock('../../components/offer-page-items/offer-info', () => ({
  OfferInfo: () => <div>OfferInfo Mock</div>
}));
vi.mock('../../components/offer-page-items/amenities', () => ({
  AmenitiesList: () => <div>AmenitiesList Mock</div>
}));
vi.mock('../../components/offer-page-items/host-info', () => ({
  HostInfo: () => <div>HostInfo Mock</div>
}));
vi.mock('../../components/offer-page-items/reviews-section', () => ({
  ReviewsSection: () => <div>ReviewsSection Mock</div>
}));
vi.mock('../../components/offer-page-items/nearby-offers', () => ({
  NearbyOffers: () => <div>NearbyOffers Mock</div>
}));
vi.mock('../../components/spinner', () => ({
  __esModule: true,
  default: () => <div>Spinner Mock</div>
}));

const middlewares = [thunk];

const mockStore = mockConfigureStore<any>(middlewares);
const offerId = '123';

const initialState = {
  auth: {
    authorizationStatus: 'NO_AUTH',
    user: null,
    loading: false,
    error: null,
  },
  detail: {
    currentOffer: null,
    loading: true,
    error: null,
  },
  nearby: {
    nearbyOffers: {},
    loading: false,
    error: null,
  },
  comments: {
    comments: {},
    loading: false,
    error: null,
  },
  offers: {
    offers: [], city: 'Paris', sortType: 'Popular', loading: false, error: null,
  },
  favorites: {
    favorites: [], loading: false, error: null, count: 0,
  }
};

describe('Страница предложения (OfferPage)', () => {

  it('должна отображать спиннер загрузки, когда данные еще не получены', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Spinner Mock')).toBeInTheDocument();
  });

  it('должна отправить экшены загрузки данных (offer, nearby, comments) при монтировании компонента', () => {
    const readyState = { ...initialState, detail: { ...initialState.detail, loading: false } };
    const store = mockStore(readyState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${offerId}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(actions).toHaveLength(3);
    expect(actions[0].type).toEqual(fetchOfferDetails.pending.type);
    expect(actions[0].meta.arg).toEqual(offerId);

    expect(actions[1].type).toEqual(fetchNearbyOffers.pending.type);
    expect(actions[1].meta.arg).toEqual(offerId);

    expect(actions[2].type).toEqual(fetchComments.pending.type);
    expect(actions[2].meta.arg).toEqual(offerId);
  });
});
