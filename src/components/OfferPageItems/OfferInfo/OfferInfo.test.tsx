import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { OfferInfo } from '.';

describe('Компонент OfferInfo', () => {
  const mockProps = {
    rating: 4.5,
    type: 'apartment',
    bedrooms: 2,
    maxAdults: 3,
    price: 120
  };

  it('корректно рендерится с переданными данными', () => {
    render(<OfferInfo {...mockProps} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
    expect(screen.getByText('2 Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Max 3 adults')).toBeInTheDocument();
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('night')).toBeInTheDocument();
  });

  it('правильно отображает рейтинг со звездами', () => {
    render(<OfferInfo {...mockProps} />);

    const ratingValue = screen.getByText('4.5');
    expect(ratingValue).toHaveClass('offer__rating-value');

    const ratingStars = screen.getByText('Rating').parentElement;
    const span = ratingStars?.querySelector('span[style]');
    expect(span).toHaveStyle('width: 90%');
  });

  it('правильно склоняет слова при единственном числе', () => {
    const singleProps = {
      rating: 4,
      type: 'room',
      bedrooms: 1,
      maxAdults: 1,
      price: 80
    };

    render(<OfferInfo {...singleProps} />);

    expect(screen.getByText('1 Bedroom')).toBeInTheDocument();
    expect(screen.getByText('Max 1 adult')).toBeInTheDocument();
  });

  it('правильно склоняет слова при множественном числе', () => {
    const pluralProps = {
      rating: 4,
      type: 'house',
      bedrooms: 3,
      maxAdults: 4,
      price: 200
    };

    render(<OfferInfo {...pluralProps} />);

    expect(screen.getByText('3 Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Max 4 adults')).toBeInTheDocument();
  });

  it('правильно применяет CSS классы', () => {
    render(<OfferInfo {...mockProps} />);
    expect(screen.getByText('4.5').closest('.offer__rating')).toHaveClass('rating');
    const featuresList = screen.getByText('Apartment').closest('ul');
    expect(featuresList).toHaveClass('offer__features');
    expect(screen.getByText('€120').closest('.offer__price')).toBeInTheDocument();
  });

  it('правильно форматирует тип жилья с заглавной буквы', () => {
    render(<OfferInfo {...mockProps} />);

    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });

  it('правильно форматирует цену с символом евро', () => {
    render(<OfferInfo {...mockProps} />);

    const priceElement = screen.getByText('€120');
    expect(priceElement).toHaveClass('offer__price-value');
    expect(priceElement.tagName).toBe('B');
  });

  it('имеет скрытый текст для доступности', () => {
    render(<OfferInfo {...mockProps} />);

    expect(screen.getByText('Rating')).toHaveClass('visually-hidden');
  });

  it('правильно рассчитывает ширину рейтинга для разных значений', () => {
    const testCases = [
      { rating: 5, expectedWidth: '100%' },
      { rating: 3, expectedWidth: '60%' },
      { rating: 0, expectedWidth: '0%' },
      { rating: 2.5, expectedWidth: '50%' },
    ];

    testCases.forEach(({ rating, expectedWidth }) => {
      const { container } = render(
        <OfferInfo
          rating={rating}
          type="apartment"
          bedrooms={2}
          maxAdults={3}
          price={100}
        />
      );

      const ratingSpan = container.querySelector('.offer__stars span[style]');
      expect(ratingSpan).toHaveStyle(`width: ${expectedWidth}`);
    });
  });
});
