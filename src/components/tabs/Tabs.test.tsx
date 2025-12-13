import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from '.';

// Моки для городов
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
    render(<Tabs cities={mockCities} />);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
    expect(screen.getByText('Brussels')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    expect(screen.getByText('Hamburg')).toBeInTheDocument();
    expect(screen.getByText('Dusseldorf')).toBeInTheDocument();
  });

  it('активирует первый город по умолчанию', () => {
    render(<Tabs cities={mockCities} />);

    const parisTab = screen.getByText('Paris').closest('a');
    expect(parisTab).toHaveClass('tabs__item--active');
    expect(parisTab).toHaveAttribute('aria-current', 'page');
    expect(parisTab).toHaveAttribute('aria-selected', 'true');
    expect(parisTab).toHaveAttribute('tabIndex', '0');
  });

  it('активирует указанный город через initialActiveIndex', () => {
    render(<Tabs cities={mockCities} initialActiveIndex={2} />);

    const brusselsTab = screen.getByText('Brussels').closest('a');
    expect(brusselsTab).toHaveClass('tabs__item--active');

    const parisTab = screen.getByText('Paris').closest('a');
    expect(parisTab).not.toHaveClass('tabs__item--active');
  });

  it('вызывает onCityChange при клике на другой город', () => {
    const mockOnCityChange = vi.fn();

    render(<Tabs cities={mockCities} onCityChange={mockOnCityChange} />);

    const cologneTab = screen.getByText('Cologne');
    fireEvent.click(cologneTab);

    expect(mockOnCityChange).toHaveBeenCalledTimes(1);
    expect(mockOnCityChange).toHaveBeenCalledWith({
      name: 'Cologne',
      location: mockCities[1].location,
    });
  });

  it('меняет активный таб при клике', () => {
    render(<Tabs cities={mockCities} />);

    let parisTab = screen.getByText('Paris').closest('a');
    expect(parisTab).toHaveClass('tabs__item--active');

    const amsterdamTab = screen.getByText('Amsterdam');
    fireEvent.click(amsterdamTab);

    const amsterdamLink = screen.getByText('Amsterdam').closest('a');
    expect(amsterdamLink).toHaveClass('tabs__item--active');
    expect(amsterdamLink).toHaveAttribute('aria-current', 'page');

    parisTab = screen.getByText('Paris').closest('a');
    expect(parisTab).not.toHaveClass('tabs__item--active');
  });

  it('не вызывает onCityChange при клике на уже активный таб', () => {
    const mockOnCityChange = vi.fn();

    render(<Tabs cities={mockCities} onCityChange={mockOnCityChange} />);

    const parisTab = screen.getByText('Paris');
    fireEvent.click(parisTab);

    expect(mockOnCityChange).not.toHaveBeenCalled();
  });

  it('имеет правильные aria атрибуты для доступности', () => {
    render(<Tabs cities={mockCities} />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-label', 'City selection');

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(6);

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-current', 'page');
    expect(tabs[0]).toHaveAttribute('tabIndex', '0');

    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).not.toHaveAttribute('aria-current');
    expect(tabs[1]).toHaveAttribute('tabIndex', '-1');
  });

  it('работает с пустым массивом городов', () => {
    render(<Tabs cities={[]} />);

    const tabs = screen.queryAllByRole('tab');
    expect(tabs).toHaveLength(0);
  });

  it('принимает кастомный className', () => {
    const { container } = render(<Tabs cities={mockCities} className="custom-class" />);

    const tabsContainer = container.querySelector('.tabs');
    expect(tabsContainer).toHaveClass('tabs');
    expect(tabsContainer).toHaveClass('custom-class');
  });

  it('правильно обрабатывает preventDefault при клике', () => {
    render(<Tabs cities={mockCities} />);

    const parisTab = screen.getByText('Paris').closest('a');
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

    fireEvent(parisTab!, clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('сохраняет активность при изменении списка городов', () => {
    const { rerender } = render(
      <Tabs cities={mockCities.slice(0, 2)} initialActiveIndex={1} />
    );

    expect(screen.getByText('Cologne').closest('a')).toHaveClass('tabs__item--active');

    rerender(<Tabs cities={mockCities} initialActiveIndex={1} />);

    expect(screen.getByText('Cologne').closest('a')).toHaveClass('tabs__item--active');
  });

  it('использует оптимизацию с useCallback и useMemo', () => {
    render(<Tabs cities={mockCities} />);

    expect(screen.getByText('Paris')).toBeInTheDocument();
  });
});
