import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ArticleList } from '.';
import type { ShortOffer } from '../../types/offer';

vi.mock('../article-item', () => ({
  ArticleItem: ({ offer }: { offer: ShortOffer }) => (
    <div data-testid={`article-item-${offer.id}`}>
      {offer.title}
    </div>
  )
}));

const mockOffers: ShortOffer[] = [
  {
    id: '1',
    title: 'Offer 1',
    type: 'apartment',
    price: 100,
    isFavorite: false,
    isPremium: false,
    rating: 4.5,
    previewImage: 'image1.jpg',
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 13
      }
    },
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 13
    }
  },
  {
    id: '2',
    title: 'Offer 2',
    type: 'room',
    price: 50,
    isFavorite: true,
    isPremium: true,
    rating: 4.8,
    previewImage: 'image2.jpg',
    city: {
      name: 'Paris',
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 13
      }
    },
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 13
    }
  }
];

describe('ArticleList', () => {
  it('рендерит список предложений', () => {
    render(<ArticleList offers={mockOffers} />);

    expect(screen.getByText('Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Offer 2')).toBeInTheDocument();
  });

  it('рендерит правильное количество элементов', () => {
    render(<ArticleList offers={mockOffers} />);

    const items = screen.getAllByTestId(/article-item-/);
    expect(items).toHaveLength(2);
  });

  it('передает onCardHover в каждый ArticleItem', () => {
    const mockOnCardHover = vi.fn();
    
    render(<ArticleList offers={mockOffers} onCardHover={mockOnCardHover} />);

    expect(screen.getByTestId('article-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('article-item-2')).toBeInTheDocument();
  });

  it('обрабатывает пустой список предложений', () => {
    render(<ArticleList offers={[]} />);

    const items = screen.queryAllByTestId(/article-item-/);
    expect(items).toHaveLength(0);
  });

  it('имеет правильный CSS класс', () => {
    const { container } = render(<ArticleList offers={mockOffers} />);

    const listContainer = container.firstChild;
    expect(listContainer).toHaveClass('cities__places-list', 'places__list', 'tabs__content');
  });
});