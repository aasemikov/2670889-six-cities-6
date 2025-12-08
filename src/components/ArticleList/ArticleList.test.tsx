import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ArticleList } from '.';
import { Offer } from '../../types/offer';

const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Test Offer 1',
    type: 'apartment',
    price: 100,
    rating: 4.5,
    isPremium: false,
    isFavorite: false,
    previewImage: 'img/test.jpg',
    city: { name: 'Test City', location: { latitude: 0, longitude: 0, zoom: 0 } },
    location: { latitude: 0, longitude: 0, zoom: 0 },
  },
];

jest.mock('../ArticleItem', () => ({
  ArticleItem: () => <div data-testid="article-item">Article Item</div>,
}));

describe('ArticleList', () => {
  it('Отображение с правильными классами', () => {
    render(<ArticleList offers={mockOffers} />);

    const container = screen.getByText('', { selector: '.cities__places-list' });
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('cities__places-list');
    expect(container).toHaveClass('places__list');
    expect(container).toHaveClass('tabs__content');
  });

  it('Отображение правильного количества предложений', () => {
    const multipleOffers = [...mockOffers, { ...mockOffers[0], id: '2' }];
    render(<ArticleList offers={multipleOffers} />);

    const items = screen.getAllByTestId('article-item');
    expect(items).toHaveLength(multipleOffers.length);
  });

  it('Отображение пустого списка', () => {
    render(<ArticleList offers={[]} />);

    const container = screen.getByText('', { selector: '.cities__places-list' });
    expect(container).toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
