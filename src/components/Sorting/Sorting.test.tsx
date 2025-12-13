import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sorting } from '.';

const mockOptions = [
    { value: 'popular', label: 'Popular' },
    { value: 'price-low-to-high', label: 'Price: low to high' },
    { value: 'price-high-to-low', label: 'Price: high to low' },
    { value: 'top-rated', label: 'Top rated first' },
];

describe('Sorting', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('рендерит компонент с выбранной опцией по умолчанию', () => {
        render(<Sorting options={mockOptions} defaultOption="popular" />);

        expect(screen.getByText('Sort by')).toBeInTheDocument();
        expect(screen.getByText('Popular')).toBeInTheDocument();
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('открывает и закрывает выпадающий список при клике', () => {
        render(<Sorting options={mockOptions} />);

        const trigger = screen.getByText('Popular');
        fireEvent.click(trigger);

        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(4);

        fireEvent.click(trigger);
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('выбирает опцию при клике и закрывает список', () => {
        const mockOnSortChange = vi.fn();

        render(
            <Sorting
                options={mockOptions}
                defaultOption="popular"
                onSortChange={mockOnSortChange}
            />
        );

        const trigger = screen.getByText('Popular');
        fireEvent.click(trigger);

        const priceLowOption = screen.getByText('Price: low to high');
        fireEvent.click(priceLowOption);

        expect(screen.getByText('Price: low to high')).toBeInTheDocument();
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
        expect(mockOnSortChange).toHaveBeenCalledWith('price-low-to-high');
    });

    it('закрывает список при клике вне компонента', () => {
        render(
            <div>
                <Sorting options={mockOptions} />
                <button data-testid="outside-button">Outside</button>
            </div>
        );

        const trigger = screen.getByText('Popular');
        fireEvent.click(trigger);
        expect(screen.getByRole('list')).toBeInTheDocument();

        const outsideButton = screen.getByTestId('outside-button');
        fireEvent.mouseDown(outsideButton);
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('работает с клавиатурной навигацией', () => {
        const mockOnSortChange = vi.fn();

        render(
            <Sorting
                options={mockOptions}
                onSortChange={mockOnSortChange}
            />
        );

        const trigger = screen.getByRole('button');

        fireEvent.keyDown(trigger, { key: 'Enter' });
        expect(screen.getByRole('list')).toBeInTheDocument();

        const firstOption = screen.getAllByRole('listitem')[0];
        fireEvent.keyDown(firstOption, { key: 'Enter' });
        expect(mockOnSortChange).toHaveBeenCalledWith('popular');
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('работает с клавишей Space для навигации', () => {
        const mockOnSortChange = vi.fn();

        render(
            <Sorting
                options={mockOptions}
                onSortChange={mockOnSortChange}
            />
        );

        const trigger = screen.getByRole('button');

        fireEvent.keyDown(trigger, { key: ' ' });
        expect(screen.getByRole('list')).toBeInTheDocument();
        const secondOption = screen.getAllByRole('listitem')[1];
        fireEvent.keyDown(secondOption, { key: ' ' });
        expect(mockOnSortChange).toHaveBeenCalledWith('price-low-to-high');
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('добавляет активный класс для выбранной опции', () => {
        render(<Sorting options={mockOptions} defaultOption="price-high-to-low" />);

        const trigger = screen.getByText('Price: high to low');
        fireEvent.click(trigger);
        const listItems = screen.getAllByRole('listitem');
        expect(listItems[2]).toHaveClass('places__option--active');

        expect(listItems[0]).not.toHaveClass('places__option--active');
        expect(listItems[1]).not.toHaveClass('places__option--active');
        expect(listItems[3]).not.toHaveClass('places__option--active');
    });

    it('меняет класс стрелки при открытии/закрытии', () => {
        const { container } = render(<Sorting options={mockOptions} />);

        const arrowSvg = container.querySelector('.places__sorting-arrow');
        expect(arrowSvg).not.toHaveClass('places__sorting-arrow--open');

        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);
        expect(arrowSvg).toHaveClass('places__sorting-arrow--open');

        fireEvent.click(trigger);
        expect(arrowSvg).not.toHaveClass('places__sorting-arrow--open');
    });

    it('использует дефолтные опции если options не переданы', () => {
        render(<Sorting />);

        expect(screen.getByText(/Popular/)).toBeInTheDocument();
    });

    it('принимает кастомный className', () => {
        const { container } = render(
            <Sorting options={mockOptions} className="custom-class" />
        );

        const form = container.querySelector('form');
        expect(form).toHaveClass('places__sorting');
        expect(form).toHaveClass('custom-class');
    });

    it('корректно отображает aria-expanded атрибут', () => {
        render(<Sorting options={mockOptions} />);

        const trigger = screen.getByRole('button');
        expect(trigger).toHaveAttribute('aria-expanded', 'false');

        fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'true');

        fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
});