import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { NearbyOffers } from '.';
import { Offer } from '../../../types/offer';

jest.mock('../../ArticleItem', () => ({
  ArticleItem: ({ offer }: { offer: Offer }) => (
    <div data-testid={`article-item-${offer.id}`}>
      {offer.title}
    </div>
  ),
}));

describe('Компонент NearbyOffers', () => {
  const mockOffers: Offer[] = [
    {
      id: '1',
      title: 'Beautiful apartment',
      type: 'apartment',
      price: 120,
      rating: 4.8,
      isPremium: true,
      isFavorite: false,
      previewImage: 'img1.jpg',
      city: { name: 'Amsterdam', location: { latitude: 0, longitude: 0, zoom: 0 } },
      location: { latitude: 0, longitude: 0, zoom: 0 },
    },
    {
      id: '2',
      title: 'Cozy room',
      type: 'room',
      price: 80,
      rating: 4.3,
      isPremium: false,
      isFavorite: true,
      previewImage: 'img2.jpg',
      city: { name: 'Paris', location: { latitude: 0, longitude: 0, zoom: 0 } },
      location: { latitude: 0, longitude: 0, zoom: 0 },
    },
    {
      id: '3',
      title: 'Modern house',
      type: 'house',
      price: 200,
      rating: 4.9,
      isPremium: true,
      isFavorite: false,
      previewImage: 'img3.jpg',
      city: { name: 'Berlin', location: { latitude: 0, longitude: 0, zoom: 0 } },
      location: { latitude: 0, longitude: 0, zoom: 0 },
    },
  ];

  it('корректно рендерится с переданными предложениями', () => {
    render(<NearbyOffers offers={mockOffers} />);

    expect(screen.getByText('Other places in the neighbourhood')).toBeInTheDocument();
    expect(screen.getByText('Beautiful apartment')).toBeInTheDocument();
    expect(screen.getByText('Cozy room')).toBeInTheDocument();
  });

  it('отображает правильное количество ArticleItem', () => {
    render(<NearbyOffers offers={mockOffers} />);

    const articleItems = screen.getAllByTestId(/article-item-/);
    expect(articleItems).toHaveLength(mockOffers.length);
  });

  it('правильно применяет CSS классы', () => {
    render(<NearbyOffers offers={mockOffers} />);

    expect(screen.getByText('Other places in the neighbourhood').closest('.container')).toBeInTheDocument();

    const section = screen.getByText('Other places in the neighbourhood').closest('section');
    expect(section).toHaveClass('near-places');
    expect(section).toHaveClass('places');

    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveClass('near-places__title');

    const list = screen.getByText('Beautiful apartment').closest('.near-places__list');
    expect(list).toHaveClass('places__list');
  });

  it('отображает заголовок h2 с правильным текстом', () => {
    render(<NearbyOffers offers={mockOffers} />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Other places in the neighbourhood');
  });

  it('работает с пустым массивом предложений', () => {
    render(<NearbyOffers offers={[]} />);

    expect(screen.getByText('Other places in the neighbourhood')).toBeInTheDocument();

    expect(screen.queryAllByTestId(/article-item-/)).toHaveLength(0);
    const list = screen.getByRole('heading', { level: 2 }).nextElementSibling;
    expect(list).toBeEmptyDOMElement();
  });

  it('работает с одним предложением', () => {
    const singleOffer = [mockOffers[0]];
    render(<NearbyOffers offers={singleOffer} />);

    const articleItems = screen.getAllByTestId(/article-item-/);
    expect(articleItems).toHaveLength(1);
    expect(articleItems[0]).toHaveTextContent('Beautiful apartment');
  });

  it('передает правильные данные в ArticleItem', () => {
    render(<NearbyOffers offers={mockOffers} />);

    mockOffers.forEach((offer) => {
      expect(screen.getByTestId(`article-item-${offer.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`article-item-${offer.id}`)).toHaveTextContent(offer.title);
    });
  });

  it('имеет правильную HTML структуру', () => {
    const { container } = render(<NearbyOffers offers={mockOffers} />);

    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();

    const section = containerDiv?.querySelector('section');
    expect(section).toBeInTheDocument();

    const children = section?.children;
    expect(children?.[0].tagName).toBe('H2');
    expect(children?.[1].tagName).toBe('DIV');
  });
});
