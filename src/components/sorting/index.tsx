import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { defaultOptions } from '../../mocks/sorting';
import { SortOption } from '../../types/sort';

type Props = {
  options?: SortOption[];
  defaultOption?: string;
  onSortChange?: (option: string) => void;
  className?: string;
};

export const Sorting: React.FC<Props> = React.memo(({
  options = defaultOptions,
  defaultOption = 'popular',
  onSortChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const dropdownRef = useRef<HTMLFormElement>(null);

  const currentOption = useMemo(() =>
    options.find((option) => option.value === selectedOption) || options[0],
  [options, selectedOption]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = useCallback((option: SortOption) => {
    setSelectedOption(option.value);
    setIsOpen(false);
    onSortChange?.(option.value);
  }, [onSortChange]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleTriggerKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    }
  }, [toggleDropdown]);
  const arrowClass = useMemo(() =>
    `places__sorting-arrow ${isOpen ? 'places__sorting-arrow--open' : ''}`.trim(),
  [isOpen]
  );

  const listClass = useMemo(() =>
    `places__options places__options--custom ${isOpen ? 'places__options--opened' : ''}`.trim(),
  [isOpen]
  );

  const getItemClass = useCallback((optionValue: string) =>
    `places__option ${selectedOption === optionValue ? 'places__option--active' : ''}`.trim(),
  [selectedOption]
  );

  return (
    <form
      className={`places__sorting ${className}`.trim()}
      ref={dropdownRef}
    >
      <span className="places__sorting-caption">Sort by </span>

      <span
        className="places__sorting-type"
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        onKeyDown={handleTriggerKeyDown}
      >
        {currentOption.label}
        <svg
          className={arrowClass}
          width="7"
          height="4"
          aria-hidden="true"
        >
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>

      {isOpen && (
        <ul className={listClass}>
          {options.map((option) => (
            <li
              key={option.value}
              className={getItemClass(option.value)}
              tabIndex={0}
              onClick={() => handleOptionClick(option)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOptionClick(option);
                }
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
});

Sorting.displayName = 'Sorting';
