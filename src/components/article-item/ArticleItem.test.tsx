import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ArticleItem } from '.';
import type { ShortOffer } from '../../types/offer';

vi.mock('../../store/hooks/redux', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: vi.fn((selector) => selector({
    auth: { authorizationStatus: 'NO_AUTH' }
  }))
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const mockOffer: ShortOffer = {
  id: '1',
  title: 'Test Offer',
  type: 'apartment',
  price: 100,
  isFavorite: false,
  isPremium: false,
  rating: 4.5,
  previewImage: 'test-image.jpg',
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
};

describe('ArticleItem', () => {
  it('рендерит основную информацию о предложении', () => {
    render(
      <MemoryRouter>
        <ArticleItem offer={mockOffer} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Offer')).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.getByText('€100')).toBeInTheDocument();
    expect(screen.getByText('/ night')).toBeInTheDocument();
  });

  it('отображает рейтинг', () => {
    render(
      <MemoryRouter>
        <ArticleItem offer={mockOffer} />
      </MemoryRouter>
    );

    const ratingElement = screen.getByRole('img', { name: /Rating:/i });
    expect(ratingElement).toBeInTheDocument();
  });

  it('отображает кнопку добавления в избранное', () => {
    render(
      <MemoryRouter>
        <ArticleItem offer={mockOffer} />
      </MemoryRouter>
    );

    const favoriteButton = screen.getByTestId('favorite-button-1');
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton).toHaveAttribute('aria-label', 'Add to bookmarks');
  });

  it('отображает премиум метку когда isPremium = true', () => {
    const premiumOffer: ShortOffer = {
      ...mockOffer,
      isPremium: true
    };

    render(
      <MemoryRouter>
        <ArticleItem offer={premiumOffer} />
      </MemoryRouter>
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('отображает активное состояние избранного когда isFavorite = true', () => {
    const favoriteOffer: ShortOffer = {
      ...mockOffer,
      isFavorite: true
    };

    render(
      <MemoryRouter>
        <ArticleItem offer={favoriteOffer} />
      </MemoryRouter>
    );

    const favoriteButton = screen.getByTestId('favorite-button-1');
    expect(favoriteButton).toHaveAttribute('aria-label', 'Remove from bookmarks');
  });

  it('рендерит ссылку на детальную страницу', () => {
    render(
      <MemoryRouter>
        <ArticleItem offer={mockOffer} />
      </MemoryRouter>
    );

    const offerLink = screen.getByTestId('offer-link-1');
    expect(offerLink).toBeInTheDocument();
    expect(offerLink).toHaveAttribute('href', '/offer/1');
  });

  it('отображает изображение предложения', () => {
    render(
      <MemoryRouter>
        <ArticleItem offer={mockOffer} />
      </MemoryRouter>
    );

    const image = screen.getByAltText('Test Offer - apartment');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });

  it('принимает кастомный className', () => {
    const { container } = render(
      <MemoryRouter>
        <ArticleItem offer={mockOffer} className="custom-class" />
      </MemoryRouter>
    );

    const article = container.querySelector('article');
    expect(article).toHaveClass('custom-class');
  });

  it('вызывает onCardHover при наведении', () => {
    const mockOnCardHover = vi.fn();

    render(
      <MemoryRouter>
        <ArticleItem
          offer={mockOffer}
          onCardHover={mockOnCardHover}
        />
      </MemoryRouter>
    );

    const article = screen.getByRole('article');
    fireEvent.mouseEnter(article);

    expect(mockOnCardHover).toHaveBeenCalledWith('1');
  });

  it('вызывает onCardHover с null при уходе мыши', () => {
    const mockOnCardHover = vi.fn();

    render(
      <MemoryRouter>
        <ArticleItem
          offer={mockOffer}
          onCardHover={mockOnCardHover}
        />
      </MemoryRouter>
    );

    const article = screen.getByRole('article');
    fireEvent.mouseEnter(article);
    fireEvent.mouseLeave(article);

    expect(mockOnCardHover).toHaveBeenCalledWith(null);
  });

  it('имеет правильный data-testid', () => {
    render(
      <MemoryRouter>
        <ArticleItem
          offer={mockOffer}
          data-testid="custom-test-id"
        />
      </MemoryRouter>
    );

    const article = screen.getByTestId('custom-test-id');
    expect(article).toBeInTheDocument();
  });

  it('использует дефолтный data-testid если не указан', () => {
    render(
      <MemoryRouter>
        <ArticleItem offer={mockOffer} />
      </MemoryRouter>
    );

    const article = screen.getByTestId('offer-card-1');
    expect(article).toBeInTheDocument();
  });

  it('обрабатывает ошибку загрузки изображения', () => {
    render(
      <MemoryRouter>
        <ArticleItem offer={mockOffer} />
      </MemoryRouter>
    );

    const image = screen.getByAltText('Test Offer - apartment');
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', '/img/placeholder.jpg');
  });
});
