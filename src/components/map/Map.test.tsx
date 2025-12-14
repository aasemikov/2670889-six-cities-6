import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Map from '.';
import type { OfferType, ShortOffer } from '../../types/offer';

const mockMap = {
  setView: vi.fn(),
  remove: vi.fn(),
};

const mockLayerGroup = {
  clearLayers: vi.fn(),
  addTo: vi.fn(),
};

const mockTileLayer = {
  addTo: vi.fn(),
};

const mockControlZoom = {
  addTo: vi.fn(),
};

const mockMarker = {
  addTo: vi.fn(),
  bindPopup: vi.fn(),
};

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => mockMap),
    tileLayer: vi.fn(() => mockTileLayer),
    layerGroup: vi.fn(() => mockLayerGroup),
    control: {
      zoom: vi.fn(() => mockControlZoom),
    },
    marker: vi.fn(() => mockMarker),
    icon: vi.fn(() => ({})),
  },
}));

const mockCity = {
  latitude: 52.5200,
  longitude: 13.4050,
  zoom: 10,
};

const mockOffers: ShortOffer[] = [
  {
    id: '1',
    title: 'Offer 1',
    type: 'apartment' as OfferType,
    price: 100,
    isFavorite: false,
    isPremium: false,
    rating: 4.5,
    previewImage: 'img1.jpg',
    city: {
      name: 'Berlin',
      location: mockCity,
    },
    location: mockCity,
  },
  {
    id: '2',
    title: 'Offer 2',
    type: 'room' as OfferType,
    price: 50,
    isFavorite: true,
    isPremium: true,
    rating: 4.8,
    previewImage: 'img2.jpg',
    city: {
      name: 'Berlin',
      location: mockCity,
    },
    location: {
      latitude: 52.5300,
      longitude: 13.4150,
      zoom: 10,
    },
  },
];

describe('Map', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит контейнер для карты с правильным классом', () => {
    const { container } = render(
      <Map city={mockCity} offers={mockOffers} />
    );

    const mapElement = container.querySelector('.cities__map');
    expect(mapElement).toBeInTheDocument();
    expect(mapElement).toHaveClass('map');
  });

  it('создает карту при первом рендере', () => {
    const { container } = render(
      <Map city={mockCity} offers={mockOffers} />
    );

    expect(container.querySelector('.cities__map')).toBeInTheDocument();
  });
});
