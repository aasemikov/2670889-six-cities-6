import { fireEvent, render, screen } from '@testing-library/react';
import { City } from '../../types/offer';
import { MemoizedTabs, Tabs } from '.';

const mockCities: City[] = [
  { name: 'Москва', location: { latitude: 55.7558, longitude: 37.6173, zoom: 10 } },
  { name: 'Санкт-Петербург', location: { latitude: 59.9343, longitude: 30.3351, zoom: 10 } },
  { name: 'Сочи', location: { latitude: 43.5855, longitude: 39.7231, zoom: 10 } },
];

describe('Компонент Tabs', () => {
  test('Показывает все города из списка', () => {
    render(<Tabs cities={mockCities} />);

    mockCities.forEach((city) => {
      expect(screen.getByText(city.name)).toBeInTheDocument();
    });
  });

  test('Первый город активен по умолчанию', () => {
    render(<Tabs cities={mockCities} />);

    const firstCityTab = screen.getByText(mockCities[0].name).closest('a');
    expect(firstCityTab).toHaveClass('tabs__item--active');
  });

  test('Можно задать начальный активный город', () => {
    render(<Tabs cities={mockCities} initialActiveIndex={1} />);

    const secondCityTab = screen.getByText(mockCities[1].name).closest('a');
    expect(secondCityTab).toHaveClass('tabs__item--active');
  });

  test('Вызывает onCityChange при клике на город', () => {
    const handleCityChange = jest.fn();

    render(<Tabs cities={mockCities} onCityChange={handleCityChange} />);

    const secondCity = screen.getByText(mockCities[1].name);
    fireEvent.click(secondCity);

    expect(handleCityChange).toHaveBeenCalledWith(mockCities[1]);
    expect(handleCityChange).toHaveBeenCalledTimes(1);
  });

  test('Активный город меняется при клике', () => {
    render(<Tabs cities={mockCities} />);

    const secondCity = screen.getByText(mockCities[1].name);
    fireEvent.click(secondCity);

    const secondCityTab = screen.getByText(mockCities[1].name).closest('a');
    expect(secondCityTab).toHaveClass('tabs__item--active');
  });

  test('Не вызывает onCityChange при клике на уже активный город', () => {
    const handleCityChange = jest.fn();

    render(<Tabs cities={mockCities} onCityChange={handleCityChange} />);

    const firstCity = screen.getByText(mockCities[0].name);
    fireEvent.click(firstCity);

    expect(handleCityChange).not.toHaveBeenCalled();
  });

  test('Добавляет правильные ARIA атрибуты', () => {
    render(<Tabs cities={mockCities} />);

    const firstCityTab = screen.getByText(mockCities[0].name).closest('a');
    expect(firstCityTab).toHaveAttribute('aria-current', 'page');
    expect(firstCityTab).toHaveAttribute('aria-selected', 'true');
  });

  test('Принимает дополнительный className', () => {
    render(<Tabs cities={mockCities} className="test-class" />);

    const tabsContainer = screen.getByRole('tablist').closest('.tabs');
    expect(tabsContainer).toHaveClass('test-class');
  });
});

describe('MemoizedTabs', () => {
  test('Не перерисовывается при тех же пропсах', () => {
    const handleCityChange = jest.fn();
    const { rerender } = render(
      <MemoizedTabs
        cities={mockCities}
        onCityChange={handleCityChange}
        initialActiveIndex={0}
        className="test"
      />
    );

    rerender(
      <MemoizedTabs
        cities={mockCities}
        onCityChange={handleCityChange}
        initialActiveIndex={0}
        className="test"
      />
    );
    mockCities.forEach((city) => {
      expect(screen.getByText(city.name)).toBeInTheDocument();
    });
  });

  test('Перерисовывается при изменении городов', () => {
    const { rerender } = render(
      <MemoizedTabs cities={mockCities.slice(0, 2)} />
    );

    const newCities = [...mockCities.slice(0, 2),
      { name: 'Казань', location: { latitude: 55.7964, longitude: 49.1089, zoom: 10 } }
    ];

    rerender(<MemoizedTabs cities={newCities} />);

    expect(screen.getByText('Казань')).toBeInTheDocument();
  });
});
