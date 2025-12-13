import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OfferHeader } from '.';

describe('OfferHeader', () => {
    const mockTitle = 'Beautiful Apartment in City Center';
    const mockOnFavoriteToggle = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('рендерит заголовок предложения', () => {
        render(
            <OfferHeader
                title={mockTitle}
                isPremium={false}
                isFavorite={false}
                onFavoriteToggle={mockOnFavoriteToggle}
            />
        );

        expect(screen.getByText(mockTitle)).toBeInTheDocument();
        expect(screen.getByRole('heading')).toHaveTextContent(mockTitle);
    });

    it('показывает Premium метку когда isPremium = true', () => {
        render(
            <OfferHeader
                title={mockTitle}
                isPremium={true}
                isFavorite={false}
                onFavoriteToggle={mockOnFavoriteToggle}
            />
        );

        expect(screen.getByText('Premium')).toBeInTheDocument();
    });

    it('не показывает Premium метку когда isPremium = false', () => {
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

    it('отображает активную кнопку избранного когда isFavorite = true', () => {
        render(
            <OfferHeader
                title={mockTitle}
                isPremium={false}
                isFavorite={true}
                onFavoriteToggle={mockOnFavoriteToggle}
            />
        );

        const favoriteButton = screen.getByRole('button');
        expect(favoriteButton).toHaveClass('offer__bookmark-button--active');
    });

    it('отображает неактивную кнопку избранного когда isFavorite = false', () => {
        render(
            <OfferHeader
                title={mockTitle}
                isPremium={false}
                isFavorite={false}
                onFavoriteToggle={mockOnFavoriteToggle}
            />
        );

        const favoriteButton = screen.getByRole('button');
        expect(favoriteButton).not.toHaveClass('offer__bookmark-button--active');
    });

    it('вызывает onFavoriteToggle при клике на кнопку избранного', () => {
        render(
            <OfferHeader
                title={mockTitle}
                isPremium={false}
                isFavorite={false}
                onFavoriteToggle={mockOnFavoriteToggle}
            />
        );

        const favoriteButton = screen.getByRole('button');
        fireEvent.click(favoriteButton);

        expect(mockOnFavoriteToggle).toHaveBeenCalledTimes(1);
    });

    it('имеет правильные CSS классы', () => {
        const { container } = render(
            <OfferHeader
                title={mockTitle}
                isPremium={false}
                isFavorite={false}
                onFavoriteToggle={mockOnFavoriteToggle}
            />
        );

        expect(container.querySelector('.offer__name-wrapper')).toBeInTheDocument();
        expect(container.querySelector('.offer__name')).toBeInTheDocument();
        expect(container.querySelector('.offer__bookmark-button')).toBeInTheDocument();
        expect(container.querySelector('.offer__bookmark-icon')).toBeInTheDocument();
    });

    it('кнопка имеет скрытый текст для доступности', () => {
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
});