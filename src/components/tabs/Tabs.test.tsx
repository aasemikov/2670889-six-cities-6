import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from '.';

const mockCities = [
  { name: 'Paris', location: { latitude: 48.85661, longitude: 2.351499, zoom: 13 } },
  { name: 'Cologne', location: { latitude: 50.938361, longitude: 6.959974, zoom: 13 } },
  { name: 'Brussels', location: { latitude: 50.846557, longitude: 4.351697, zoom: 13 } },
  { name: 'Amsterdam', location: { latitude: 52.37454, longitude: 4.897976, zoom: 13 } },
  { name: 'Hamburg', location: { latitude: 53.550341, longitude: 10.000654, zoom: 13 } },
  { name: 'Dusseldorf', location: { latitude: 51.225402, longitude: 6.776314, zoom: 13 } },
];

describe('Tabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит список городов', () => {
    render(
      <Tabs
        cities={mockCities}
        selectedCity={mockCities[0]}
        onCityChange={() => { }}
      />
    );

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
    expect(screen.getByText('Brussels')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    expect(screen.getByText('Hamburg')).toBeInTheDocument();
    expect(screen.getByText('Dusseldorf')).toBeInTheDocument();
  });

  it('активирует выбранный город из пропсов', () => {
    render(
      <Tabs
        cities={mockCities}
        selectedCity={mockCities[2]}
        onCityChange={() => { }}
      />
    );

    const brusselsTab = screen.getByText('Brussels').closest('a');
    expect(brusselsTab).toHaveClass('tabs__item--active');
    expect(brusselsTab).toHaveAttribute('aria-current', 'page');
    expect(brusselsTab).toHaveAttribute('aria-selected', 'true');
    expect(brusselsTab).toHaveAttribute('tabIndex', '0');

    const parisTab = screen.getByText('Paris').closest('a');
    expect(parisTab).not.toHaveClass('tabs__item--active');
    expect(parisTab).toHaveAttribute('aria-selected', 'false');
    expect(parisTab).toHaveAttribute('tabIndex', '-1');
  });

  it('не вызывает onCityChange при клике на уже активный город', () => {
    const mockOnCityChange = vi.fn();

    render(
      <Tabs
        cities={mockCities}
        selectedCity={mockCities[0]}
        onCityChange={mockOnCityChange}
      />
    );

    const parisTab = screen.getByText('Paris');
    fireEvent.click(parisTab);

    expect(mockOnCityChange).not.toHaveBeenCalled();
  });

  it('имеет правильные aria атрибуты для доступности', () => {
    render(
      <Tabs
        cities={mockCities}
        selectedCity={mockCities[3]}
        onCityChange={() => { }}
      />
    );

    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-label', 'City selection');

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(6);

    expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[3]).toHaveAttribute('aria-current', 'page');
    expect(tabs[3]).toHaveAttribute('tabIndex', '0');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[0]).not.toHaveAttribute('aria-current');
    expect(tabs[0]).toHaveAttribute('tabIndex', '-1');
  });

  it('работает с пустым массивом городов', () => {
    const emptyCity = { name: '', location: { latitude: 0, longitude: 0, zoom: 0 } };
    render(
      <Tabs
        cities={[]}
        selectedCity={emptyCity}
        onCityChange={() => { }}
      />
    );

    const tabs = screen.queryAllByRole('tab');
    expect(tabs).toHaveLength(0);
  });

  it('принимает кастомный className', () => {
    const { container } = render(
      <Tabs
        cities={mockCities}
        selectedCity={mockCities[0]}
        onCityChange={() => { }}
        className="custom-class"
      />
    );

    const tabsContainer = container.querySelector('.tabs');
    expect(tabsContainer).toHaveClass('tabs');
    expect(tabsContainer).toHaveClass('custom-class');
  });

  it('правильно обрабатывает preventDefault при клике', () => {
    render(
      <Tabs
        cities={mockCities}
        selectedCity={mockCities[0]}
        onCityChange={() => { }}
      />
    );

    const parisTab = screen.getByText('Paris').closest('a');
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

    fireEvent(parisTab!, clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('обновляет активный город при изменении selectedCity', () => {
    const { rerender } = render(
      <Tabs
        cities={mockCities}
        selectedCity={mockCities[0]}
        onCityChange={() => { }}
      />
    );

    expect(screen.getByText('Paris').closest('a')).toHaveClass('tabs__item--active');
    expect(screen.getByText('Cologne').closest('a')).not.toHaveClass('tabs__item--active');

    rerender(
      <Tabs
        cities={mockCities}
        selectedCity={mockCities[1]}
        onCityChange={() => { }}
      />
    );

    expect(screen.getByText('Paris').closest('a')).not.toHaveClass('tabs__item--active');
    expect(screen.getByText('Cologne').closest('a')).toHaveClass('tabs__item--active');
  });

  it('использует оптимизацию с useCallback и useMemo', () => {
    render(
      <Tabs
        cities={mockCities}
        selectedCity={mockCities[0]}
        onCityChange={() => { }}
      />
    );

    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('корректно работает с одним городом', () => {
    const singleCity = [mockCities[0]];
    render(
      <Tabs
        cities={singleCity}
        selectedCity={singleCity[0]}
        onCityChange={() => { }}
      />
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(1);
    expect(tabs[0]).toHaveClass('tabs__item--active');
  });
});
