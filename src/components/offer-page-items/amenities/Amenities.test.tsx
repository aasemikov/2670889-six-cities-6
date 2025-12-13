import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmenitiesList } from '.';

describe('AmenitiesList', () => {
  it('рендерит заголовок', () => {
    render(<AmenitiesList amenities={['WiFi', 'Kitchen']} />);

    expect(screen.getByText('What\'s inside')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('What\'s inside');
  });

  it('рендерит список удобств', () => {
    const amenities = ['WiFi', 'Kitchen', 'Washing machine', 'Parking'];

    render(<AmenitiesList amenities={amenities} />);

    amenities.forEach((amenity) => {
      expect(screen.getByText(amenity)).toBeInTheDocument();
    });

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(amenities.length);
  });

  it('рендерит правильное количество элементов', () => {
    const amenities = ['WiFi', 'Kitchen', 'TV'];

    render(<AmenitiesList amenities={amenities} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('обрабатывает пустой массив удобств', () => {
    render(<AmenitiesList amenities={[]} />);

    expect(screen.getByText('What\'s inside')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('имеет правильные CSS классы', () => {
    const { container } = render(<AmenitiesList amenities={['WiFi']} />);

    expect(container.querySelector('.offer__inside')).toBeInTheDocument();
    expect(container.querySelector('.offer__inside-title')).toBeInTheDocument();
    expect(container.querySelector('.offer__inside-list')).toBeInTheDocument();
    expect(container.querySelector('.offer__inside-item')).toBeInTheDocument();
  });

  it('использует amenity как key для элементов списка', () => {
    const amenities = ['WiFi', 'Kitchen'];
    const { container } = render(<AmenitiesList amenities={amenities} />);
    const listItems = container.querySelectorAll('.offer__inside-item');
    expect(listItems[0].textContent).toBe('WiFi');
    expect(listItems[1].textContent).toBe('Kitchen');
  });

  it('рендерит один элемент списка', () => {
    render(<AmenitiesList amenities={['WiFi']} />);

    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('сохраняет порядок удобств', () => {
    const amenities = ['Kitchen', 'WiFi', 'TV'];

    render(<AmenitiesList amenities={amenities} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveTextContent('Kitchen');
    expect(listItems[1]).toHaveTextContent('WiFi');
    expect(listItems[2]).toHaveTextContent('TV');
  });
});
