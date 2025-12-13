import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReviewsList } from '.';
import type { Review } from '../../../types/review';

const mockReviews: Review[] = [
  {
    id: '1',
    comment: 'Great place to stay!',
    rating: 4.5,
    date: '2024-03-15T10:00:00.000Z',
    user: {
      name: 'John Doe',
      email: 'user@mail.ru',
      avatarUrl: 'avatar1.jpg',
      isPro: true,
    },
  },
  {
    id: '2',
    comment: 'Nice apartment, good location.',
    rating: 4.0,
    date: '2024-03-10T14:30:00.000Z',
    user: {
      name: 'Jane Smith',
      email: 'user@mail.ru',
      avatarUrl: 'avatar2.jpg',
      isPro: false,
    },
  },
];

describe('ReviewsList', () => {
  it('рендерит список отзывов', () => {
    render(<ReviewsList reviews={mockReviews} />);

    expect(screen.getByText('Great place to stay!')).toBeInTheDocument();
    expect(screen.getByText('Nice apartment, good location.')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('отображает Pro статус когда user.isPro = true', () => {
    render(<ReviewsList reviews={mockReviews} />);

    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getAllByText('Pro')).toHaveLength(1);
  });

  it('отображает аватар пользователя', () => {
    render(<ReviewsList reviews={mockReviews} />);

    const avatarImages = screen.getAllByAltText('Reviews avatar');
    expect(avatarImages).toHaveLength(2);
    expect(avatarImages[0]).toHaveAttribute('src', 'avatar1.jpg');
    expect(avatarImages[1]).toHaveAttribute('src', 'avatar2.jpg');

    expect(avatarImages[0]).toHaveAttribute('width', '54');
    expect(avatarImages[0]).toHaveAttribute('height', '54');
  });

  it('обрабатывает пустой список отзывов', () => {
    render(<ReviewsList reviews={[]} />);

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  it('имеет правильные CSS классы', () => {
    const { container } = render(<ReviewsList reviews={mockReviews} />);

    expect(container.querySelector('.reviews__list')).toBeInTheDocument();
    expect(container.querySelector('.reviews__item')).toBeInTheDocument();
    expect(container.querySelector('.reviews__user')).toBeInTheDocument();
    expect(container.querySelector('.reviews__avatar-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.reviews__rating')).toBeInTheDocument();
    expect(container.querySelector('.reviews__text')).toBeInTheDocument();
    expect(container.querySelector('.reviews__time')).toBeInTheDocument();
  });
});
