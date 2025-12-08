import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ReviewsList } from '.';
import { Review } from '../../../types/review';

const mockReviews: Review[] = [
  {
    id: '1',
    comment: 'A quiet cozy and picturesque place. Perfect for your holiday away from home.',
    date: '2023-11-15T12:00:00.000Z',
    rating: 4.8,
    user: {
      email: 'user@mail.ru',
      isPro: true,
      name: 'Oliver',
      avatarUrl: 'img/avatar-angelina.jpg',
    },
  },
  {
    id: '2',
    comment: 'Another great stay. The host was amazing and the location was perfect.',
    date: '2024-01-20T10:00:00.000Z',
    rating: 3.5,
    user: {
      email: 'user@mail.ru',
      isPro: false,
      name: 'Sophia',
      avatarUrl: 'img/avatar-max.jpg',
    },
  },
];

describe('Компонент ReviewsList', () => {
  it('должен отрендерить список отзывов с информацией о пользователях', () => {
    render(<ReviewsList reviews={mockReviews} />);
    const reviewItems = screen.getAllByRole('listitem');
    expect(reviewItems).toHaveLength(mockReviews.length);
    expect(screen.getByText(/A quiet cozy and picturesque place/i)).toBeInTheDocument();
    expect(screen.getByText(/Oliver/i)).toBeInTheDocument();
    const avatars = screen.getAllByAltText('Reviews avatar');
    expect(avatars).toHaveLength(2);

    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText(/Another great stay/i)).toBeInTheDocument();
    expect(screen.getByText(/Sophia/i)).toBeInTheDocument();
  });

  it('должен корректно форматировать дату в формат "Месяц Год"', () => {
    render(<ReviewsList reviews={mockReviews} />);
    expect(screen.getByText('November 2023')).toBeInTheDocument();
    expect(screen.getByText('January 2024')).toBeInTheDocument();
  });

  it('не должен показывать статус "Pro" для обычного пользователя', () => {
    render(<ReviewsList reviews={mockReviews} />);
    const proStatusElements = screen.getAllByText('Pro');
    expect(proStatusElements).toHaveLength(1);
  });

  it('должен корректно рассчитывать ширину рейтинга', () => {
    render(<ReviewsList reviews={mockReviews} />);
    const starElements = document.querySelectorAll('.reviews__stars span:first-child');

    expect(starElements[0]).toHaveStyle('width: 96%');
    expect(starElements[1]).toHaveStyle('width: 70%');
  });

  it('должен отрендерить пустой список, если отзывы не предоставлены', () => {
    render(<ReviewsList reviews={[]} />);

    const reviewItems = screen.queryAllByRole('listitem');
    expect(reviewItems).toHaveLength(0);

    const listElement = screen.getByRole('list');
    expect(listElement).toBeEmptyDOMElement();
  });
});
