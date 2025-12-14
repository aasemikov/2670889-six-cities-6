import { memo, useCallback, useMemo } from 'react';
import { City } from '../../types/offer';

export type Props = {
  cities: City[];
  selectedCity: City;
  onCityChange: (city: City) => void;
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
  selectedCity,
  onCityChange,
  className = ''
}) => {
  const handleTabClick = useCallback((city: City) => {
    if (city.name !== selectedCity.name) {
      onCityChange(city);
    }
  }, [selectedCity, onCityChange]);

  const tabItems = useMemo(() =>
    cities.map((city) => ({
      ...city,
      isActive: city.name === selectedCity.name
    })),
  [cities, selectedCity]
  );

  return (
    <div className={`tabs ${className}`.trim()}>
      <section className="locations container">
        <ul
          className="locations__list tabs__list"
          role="tablist"
          aria-label="City selection"
        >
          {tabItems.map((city) => (
            <TabItem
              key={city.name}
              city={city}
              isActive={city.isActive}
              onClick={handleTabClick}
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

  const selectedCityChanged =
    prevProps.selectedCity?.name !== nextProps.selectedCity?.name ||
    prevProps.selectedCity?.location.latitude !== nextProps.selectedCity?.location.latitude ||
    prevProps.selectedCity?.location.longitude !== nextProps.selectedCity?.location.longitude ||
    prevProps.selectedCity?.location.zoom !== nextProps.selectedCity?.location.zoom;

  return (
    !citiesChanged &&
    !selectedCityChanged &&
    prevProps.onCityChange === nextProps.onCityChange &&
    prevProps.className === nextProps.className
  );
});
