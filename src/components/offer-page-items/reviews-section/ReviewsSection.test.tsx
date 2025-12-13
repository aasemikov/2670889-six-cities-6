import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { useAppSelector } from '../../../store/hooks/redux';
import { ReviewsSection } from '.';

vi.mock('../../../store/hooks/redux', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('../reviews-form', () => ({
    ReviewForm: () => <div data-testid="review-form">Review Form</div>,
}));

vi.mock('../reviews-list', () => ({
    ReviewsList: ({ reviews }: { reviews: any[] }) => (
        <div data-testid="reviews-list">
            {reviews.length} reviews
        </div>
    ),
}));

describe('ReviewsSection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('не показывает ReviewForm когда пользователь не авторизован', () => {
        const mockUseAppSelector = vi.mocked(useAppSelector);
        mockUseAppSelector.mockReturnValue({
            comments: {
                loading: false,
                error: null,
                comments: {},
            },
            auth: { authorizationStatus: 'NO_AUTH' },
        });

        render(
            <MemoryRouter>
                <ReviewsSection offerId="123" />
            </MemoryRouter>
        );

        expect(screen.queryByTestId('review-form')).not.toBeInTheDocument();
    });
});