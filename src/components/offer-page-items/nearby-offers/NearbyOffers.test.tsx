import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { NearbyOffers } from '.';
import type { ShortOffer } from '../../../types/offer';

vi.mock('../../article-item', () => ({
    ArticleItem: ({ offer }: { offer: ShortOffer }) => (
        <div data-testid={`article-item-${offer.id}`}>
            {offer.title}
        </div>
    )
}));

const mockOffers: ShortOffer[] = [
    {
        id: '1',
        title: 'Nearby Offer 1',
        type: 'apartment',
        price: 100,
        isFavorite: false,
        isPremium: false,
        rating: 4.5,
        previewImage: 'img1.jpg',
        city: {
            name: 'Paris',
            location: { latitude: 0, longitude: 0, zoom: 10 }
        },
        location: { latitude: 0, longitude: 0, zoom: 10 }
    },
    {
        id: '2',
        title: 'Nearby Offer 2',
        type: 'room',
        price: 50,
        isFavorite: true,
        isPremium: true,
        rating: 4.8,
        previewImage: 'img2.jpg',
        city: {
            name: 'Paris',
            location: { latitude: 0, longitude: 0, zoom: 10 }
        },
        location: { latitude: 0, longitude: 0, zoom: 10 }
    }
];

describe('NearbyOffers', () => {
    it('рендерит заголовок', () => {
        render(
            <MemoryRouter>
                <NearbyOffers offers={mockOffers} />
            </MemoryRouter>
        );

        expect(screen.getByText('Other places in the neighbourhood')).toBeInTheDocument();
    });

    it('рендерит предложения из массива', () => {
        render(
            <MemoryRouter>
                <NearbyOffers offers={mockOffers} />
            </MemoryRouter>
        );

        expect(screen.getByText('Nearby Offer 1')).toBeInTheDocument();
        expect(screen.getByText('Nearby Offer 2')).toBeInTheDocument();

        const articleItems = screen.getAllByTestId(/article-item-/);
        expect(articleItems).toHaveLength(2);
    });

    it('обрабатывает пустой массив предложений', () => {
        render(
            <MemoryRouter>
                <NearbyOffers offers={[]} />
            </MemoryRouter>
        );

        expect(screen.getByText('Other places in the neighbourhood')).toBeInTheDocument();

        const articleItems = screen.queryAllByTestId(/article-item-/);
        expect(articleItems).toHaveLength(0);
    });

    it('имеет правильные CSS классы', () => {
        const { container } = render(
            <MemoryRouter>
                <NearbyOffers offers={mockOffers} />
            </MemoryRouter>
        );

        expect(container.querySelector('.container')).toBeInTheDocument();
        expect(container.querySelector('.near-places')).toBeInTheDocument();
        expect(container.querySelector('.places')).toBeInTheDocument();
        expect(container.querySelector('.near-places__title')).toBeInTheDocument();
        expect(container.querySelector('.near-places__list')).toBeInTheDocument();
        expect(container.querySelector('.places__list')).toBeInTheDocument();
    });
});