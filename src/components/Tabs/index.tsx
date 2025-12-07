import { useState, useCallback, useMemo, memo } from 'react';
import { City } from '../../types/offer';

export type Props = {
  cities: City[];
  onCityChange?: (city: City) => void;
  initialActiveIndex?: number;
  className?: string;
};

const TabItem = memo<{
  city: City;
  isActive: boolean;
  onClick: (city: City) => void;
    }>(({ city, isActive, onClick }) => {
      const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onClick(city);
      }, [city, onClick]);

      const linkClass = useMemo(() =>
        `locations__item-link tabs__item ${isActive ? 'tabs__item--active' : ''}`.trim(),
      [isActive]
      );

      return (
        <li className="locations__item">
          <a
            className={linkClass}
            href="#"
            onClick={handleClick}
            aria-current={isActive ? 'page' : undefined}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
          >
            <span>{city.name}</span>
          </a>
        </li>
      );
    });

TabItem.displayName = 'TabItem';

export const Tabs: React.FC<Props> = memo(({
  cities,
  onCityChange,
  initialActiveIndex = 0,
  className = ''
}) => {
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, Math.min(initialActiveIndex, cities.length - 1)));

  const activeCity = useMemo(() => cities[activeIndex], [cities, activeIndex]);

  const cityIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    cities.forEach((city, index) => {
      map.set(city.name, index);
    });
    return map;
  }, [cities]);

  const handleTabClickOptimized = useCallback((city: City) => {
    const newIndex = cityIndexMap.get(city.name);
    if (newIndex !== undefined && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      onCityChange?.(city);
    }
  }, [cityIndexMap, activeIndex, onCityChange]);

  const tabItems = useMemo(() =>
    cities.map((city) => ({
      ...city,
      isActive: city.name === activeCity?.name
    })),
  [cities, activeCity]
  );

  return (
    <div className={`tabs ${className}`.trim()}>
      <section className="locations container">
        <ul
          className="locations__list tabs__list"
          role="tablist"
          aria-label="City selection"
        >
          {tabItems.map(({ name, location }) => (
            <TabItem
              key={name}
              city={{ name, location }}
              isActive={name === activeCity?.name}
              onClick={handleTabClickOptimized}
            />
          ))}
        </ul>
      </section>
    </div>
  );
});

Tabs.displayName = 'Tabs';

export const MemoizedTabs = memo(Tabs, (prevProps, nextProps) => {
  if (prevProps.cities.length !== nextProps.cities.length) {
    return false;
  }

  const citiesChanged = prevProps.cities.some((city, index) =>
    city.name !== nextProps.cities[index]?.name ||
    city.location.latitude !== nextProps.cities[index]?.location.latitude ||
    city.location.longitude !== nextProps.cities[index]?.location.longitude ||
    city.location.zoom !== nextProps.cities[index]?.location.zoom
  );

  return (
    !citiesChanged &&
    prevProps.onCityChange === nextProps.onCityChange &&
    prevProps.initialActiveIndex === nextProps.initialActiveIndex &&
    prevProps.className === nextProps.className
  );
});
