import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { OfferHeader } from '.';

describe('Компонент OfferHeader', () => {
  const mockTitle = 'Beautiful & luxurious apartment at great location';
  const mockOnFavoriteToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('корректно рендерится с базовыми данными', () => {
    render(
      <OfferHeader
        title={mockTitle}
        isPremium={false}
        isFavorite={false}
        onFavoriteToggle={mockOnFavoriteToggle}
      />
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(mockTitle);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('отображает премиум бейдж при isPremium: true', () => {
    render(
      <OfferHeader
        title={mockTitle}
        isPremium
        isFavorite={false}
        onFavoriteToggle={mockOnFavoriteToggle}
      />
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('не отображает премиум бейдж при isPremium: false', () => {
    render(
      <OfferHeader
        title={mockTitle}
        isPremium={false}
        isFavorite={false}
        onFavoriteToggle={mockOnFavoriteToggle}
      />
    );

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('применяет активный класс для кнопки при isFavorite: true', () => {
    render(
      <OfferHeader
        title={mockTitle}
        isPremium={false}
        isFavorite
        onFavoriteToggle={mockOnFavoriteToggle}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('offer__bookmark-button--active');
  });

  it('не применяет активный класс для кнопки при isFavorite: false', () => {
    render(
      <OfferHeader
        title={mockTitle}
        isPremium={false}
        isFavorite={false}
        onFavoriteToggle={mockOnFavoriteToggle}
      />
    );

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('offer__bookmark-button--active');
  });

  it('вызывает onFavoriteToggle при клике на кнопку', () => {
    render(
      <OfferHeader
        title={mockTitle}
        isPremium={false}
        isFavorite={false}
        onFavoriteToggle={mockOnFavoriteToggle}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnFavoriteToggle).toHaveBeenCalledTimes(1);
  });

  it('имеет правильную структуру заголовка', () => {
    render(
      <OfferHeader
        title={mockTitle}
        isPremium={false}
        isFavorite={false}
        onFavoriteToggle={mockOnFavoriteToggle}
      />
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('offer__name');
    expect(heading).toHaveTextContent(mockTitle);
  });

  it('отображает скрытый текст для доступности', () => {
    render(
      <OfferHeader
        title={mockTitle}
        isPremium={false}
        isFavorite={false}
        onFavoriteToggle={mockOnFavoriteToggle}
      />
    );

    expect(screen.getByText('To bookmarks')).toHaveClass('visually-hidden');
  });

  describe('SVG иконка', () => {
    it('имеет правильные размеры', () => {
      render(
        <OfferHeader
          title={mockTitle}
          isPremium={false}
          isFavorite={false}
          onFavoriteToggle={mockOnFavoriteToggle}
        />
      );

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '31');
      expect(svg).toHaveAttribute('height', '33');
    });

    it('имеет правильный класс', () => {
      render(
        <OfferHeader
          title={mockTitle}
          isPremium={false}
          isFavorite={false}
          onFavoriteToggle={mockOnFavoriteToggle}
        />
      );

      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveClass('offer__bookmark-icon');
    });
  });

  describe('Кнопка добавления в избранное', () => {
    it('имеет правильный type="button"', () => {
      render(
        <OfferHeader
          title={mockTitle}
          isPremium={false}
          isFavorite={false}
          onFavoriteToggle={mockOnFavoriteToggle}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('правильно применяет CSS классы', () => {
      render(
        <OfferHeader
          title={mockTitle}
          isPremium={false}
          isFavorite={false}
          onFavoriteToggle={mockOnFavoriteToggle}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('offer__bookmark-button');
      expect(button).toHaveClass('button');
    });
  });

  describe('Wrapper контейнер', () => {
    it('имеет правильный класс', () => {
      render(
        <OfferHeader
          title={mockTitle}
          isPremium={false}
          isFavorite={false}
          onFavoriteToggle={mockOnFavoriteToggle}
        />
      );

      const wrapper = screen.getByRole('heading').parentElement;
      expect(wrapper).toHaveClass('offer__name-wrapper');
    });
  });
});
