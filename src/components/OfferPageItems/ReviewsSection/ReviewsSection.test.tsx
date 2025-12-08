import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ReviewsSection } from '.';
import * as reduxHooks from '../../../store/hooks/redux';
import { AuthStatus } from '../../../types/auth';
import { Review } from '../../../types/review';

jest.mock('../ReviewsList', () => ({
  ReviewsList: ({ reviews }: { reviews: Review[] }) => (
    <div data-testid="reviews-list">
      {reviews.map((r) => r.comment).join(', ')}
    </div>
  ),
}));

jest.mock('../ReviewsForm', () => ({
  ReviewForm: () => <div data-testid="review-form">Review Form Component</div>,
}));

const mockReviews: Review[] = [
  {
    id: '1',
    comment: 'Second latest review comment.',
    date: '2024-01-20T10:00:00.000Z',
    rating: 4,
    user: { email: 'user@mail.ru', isPro: false, name: 'Sophia', avatarUrl: '' },
  },
  {
    id: '2',
    comment: 'Latest review comment.',
    date: '2024-02-15T12:00:00.000Z',
    rating: 5,
    user: { email: 'user@mail.ru', isPro: true, name: 'Oliver', avatarUrl: '' },
  },
  ...Array.from({ length: 9 }).map((_, i) => ({
    id: `3-${i}`,
    comment: `Old review ${i}`,
    date: `2023-01-${i + 1}T10:00:00.000Z`,
    rating: 1,
    user: { email: 'user@mail.ru', isPro: false, name: 'Old User', avatarUrl: '' },
  }))
];

const offerId = 'offer123';

describe('Компонент ReviewsSection', () => {
  const useSelectorMock = jest.spyOn(reduxHooks, 'useAppSelector');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAndRender = (authState: AuthStatus, commentsState: any) => {
    useSelectorMock
      .mockReturnValueOnce(commentsState)
      .mockReturnValueOnce({ authorizationStatus: authState });

    render(<ReviewsSection offerId={offerId} />);
  };

  it('должен отображать состояние загрузки (loading state)', () => {
    const commentsState = {
      comments: {},
      loading: true,
      error: null
    };

    mockAndRender('NO_AUTH', commentsState);
    expect(screen.getByText(/Loading reviews\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('должен отображать состояние ошибки (error state)', () => {
    const errorMessage = 'Failed to fetch reviews';
    const commentsState = {
      comments: {},
      loading: false,
      error: errorMessage
    };

    mockAndRender('NO_AUTH', commentsState);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('должен отображать список отзывов, отсортированных по дате (новее сверху) и ограниченных 10 шт.', () => {
    const commentsState = {
      comments: { [offerId]: mockReviews },
      loading: false,
      error: null,
    };

    mockAndRender('NO_AUTH', commentsState);

    expect(screen.getByText('Reviews ·')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();

    const reviewsList = screen.getByTestId('reviews-list');
    const commentsText = reviewsList.textContent;
    const commentArray = commentsText?.split(', ') || [];

    expect(commentArray.length).toBe(10);
    expect(commentArray[0]).toBe('Latest review comment.');
    expect(commentArray[1]).toBe('Second latest review comment.');
  });

  it('должен отображать форму отзыва для авторизованного пользователя', () => {
    const commentsState = { comments: { [offerId]: [] }, loading: false, error: null };

    mockAndRender('AUTH', commentsState);

    expect(screen.getByTestId('review-form')).toBeInTheDocument();
  });

  it('не должен отображать форму отзыва для неавторизованного пользователя', () => {
    const commentsState = { comments: { [offerId]: [] }, loading: false, error: null };

    mockAndRender('NO_AUTH', commentsState);

    expect(screen.queryByTestId('review-form')).toBeNull();
  });
});
