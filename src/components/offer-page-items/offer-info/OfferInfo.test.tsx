import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OfferInfo } from '.';

describe('OfferInfo', () => {
    it('рендерит всю информацию о предложении', () => {
        render(
            <OfferInfo
                rating={4.5}
                type="apartment"
                bedrooms={2}
                maxAdults={4}
                price={150}
            />
        );

        expect(screen.getByText('4.5')).toBeInTheDocument();
        expect(screen.getByText('Apartment')).toBeInTheDocument();
        expect(screen.getByText('2 Bedrooms')).toBeInTheDocument();
        expect(screen.getByText('Max 4 adults')).toBeInTheDocument();
        expect(screen.getByText('€150')).toBeInTheDocument();
        expect(screen.getByText('night')).toBeInTheDocument();
    });

    it('правильно форматирует единственное число для bedrooms', () => {
        render(
            <OfferInfo
                rating={4}
                type="room"
                bedrooms={1}
                maxAdults={2}
                price={80}
            />
        );

        expect(screen.getByText('1 Bedroom')).toBeInTheDocument();
        expect(screen.getByText('Max 2 adults')).toBeInTheDocument();
    });

    it('правильно форматирует единственное число для maxAdults', () => {
        render(
            <OfferInfo
                rating={3.5}
                type="house"
                bedrooms={3}
                maxAdults={1}
                price={200}
            />
        );

        expect(screen.getByText('Max 1 adult')).toBeInTheDocument();
    });

    it('правильно капитализирует тип жилья', () => {
        render(
            <OfferInfo
                rating={4}
                type="hotel"
                bedrooms={1}
                maxAdults={2}
                price={120}
            />
        );

        expect(screen.getByText('Hotel')).toBeInTheDocument();
    });

    it('отображает ширину рейтинга в стилях', () => {
        const { container } = render(
            <OfferInfo
                rating={4}
                type="apartment"
                bedrooms={2}
                maxAdults={3}
                price={100}
            />
        );

        const ratingSpan = container.querySelector('.offer__stars span');
        expect(ratingSpan).toHaveStyle('width: 80%');
    });

    it('правильно рассчитывает ширину рейтинга для разных значений', () => {
        const { container, rerender } = render(
            <OfferInfo
                rating={2.5}
                type="apartment"
                bedrooms={2}
                maxAdults={3}
                price={100}
            />
        );

        let ratingSpan = container.querySelector('.offer__stars span');
        expect(ratingSpan).toHaveStyle('width: 50%');

        rerender(
            <OfferInfo
                rating={5}
                type="apartment"
                bedrooms={2}
                maxAdults={3}
                price={100}
            />
        );

        ratingSpan = container.querySelector('.offer__stars span');
        expect(ratingSpan).toHaveStyle('width: 100%');
    });

    it('имеет правильные CSS классы', () => {
        const { container } = render(
            <OfferInfo
                rating={4}
                type="apartment"
                bedrooms={2}
                maxAdults={3}
                price={100}
            />
        );

        expect(container.querySelector('.offer__rating')).toBeInTheDocument();
        expect(container.querySelector('.offer__stars')).toBeInTheDocument();
        expect(container.querySelector('.offer__features')).toBeInTheDocument();
        expect(container.querySelector('.offer__feature--entire')).toBeInTheDocument();
        expect(container.querySelector('.offer__feature--bedrooms')).toBeInTheDocument();
        expect(container.querySelector('.offer__feature--adults')).toBeInTheDocument();
        expect(container.querySelector('.offer__price')).toBeInTheDocument();
        expect(container.querySelector('.offer__price-value')).toBeInTheDocument();
        expect(container.querySelector('.offer__price-text')).toBeInTheDocument();
    });
});