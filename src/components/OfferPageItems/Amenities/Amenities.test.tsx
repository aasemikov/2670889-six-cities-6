import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { AmenitiesList } from '.';

describe('Компонент AmenitiesList', () => {
  const mockAmenities = ['Wi-Fi', 'Kitchen', 'Washing machine', 'Towels', 'Heating'];

  it('корректно рендерится с переданными удобствами', () => {
    render(<AmenitiesList amenities={mockAmenities} />);

    expect(screen.getByText('What\'s inside')).toBeInTheDocument();
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
  });

  it('отображает правильное количество элементов в списке', () => {
    render(<AmenitiesList amenities={mockAmenities} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(mockAmenities.length);
  });

  it('каждый элемент списка имеет уникальный ключ', () => {
    const { container } = render(<AmenitiesList amenities={mockAmenities} />);

    const listItems = container.querySelectorAll('.offer__inside-item');
    listItems.forEach((item, index) => {
      expect(item).toHaveTextContent(mockAmenities[index]);
    });
  });

  it('правильно применяет CSS классы', () => {
    render(<AmenitiesList amenities={mockAmenities} />);

    const container = screen.getByText('What\'s inside').parentElement;
    expect(container).toHaveClass('offer__inside');
    expect(screen.getByRole('list')).toHaveClass('offer__inside-list');
  });

  it('отображает заголовок h2', () => {
    render(<AmenitiesList amenities={mockAmenities} />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('What\'s inside');
    expect(heading).toHaveClass('offer__inside-title');
  });

  it('работает с пустым массивом удобств', () => {
    render(<AmenitiesList amenities={[]} />);

    expect(screen.getByText('What\'s inside')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('работает с одним удобством', () => {
    const singleAmenity = ['Parking'];
    render(<AmenitiesList amenities={singleAmenity} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent('Parking');
  });

  it('сохраняет порядок удобств', () => {
    render(<AmenitiesList amenities={mockAmenities} />);

    const listItems = screen.getAllByRole('listitem');
    listItems.forEach((item, index) => {
      expect(item).toHaveTextContent(mockAmenities[index]);
    });
  });
});
