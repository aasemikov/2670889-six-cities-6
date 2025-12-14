import type { Meta, StoryObj } from '@storybook/react';
import { Sorting } from '.';
import { SortOption } from '../../types/sort';

const mockOptions: SortOption[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'price-low-to-high', label: 'Price: low to high' },
  { value: 'price-high-to-low', label: 'Price: high to low' },
  { value: 'top-rated', label: 'Top rated first' },
];

const mockExtendedOptions: SortOption[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'price-low-to-high', label: 'Price: low to high' },
  { value: 'price-high-to-low', label: 'Price: high to low' },
  { value: 'top-rated', label: 'Top rated first' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
];

const meta = {
  title: 'Components/Sorting',
  component: Sorting,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'Массив опций для сортировки'
    },
    defaultOption: {
      control: 'text',
      description: 'Опция по умолчанию'
    },
    onSortChange: {
      action: 'sort changed',
      description: 'Callback при изменении сортировки'
    }
  },
} satisfies Meta<typeof Sorting>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: mockOptions,
    defaultOption: 'popular',
  },
};

export const WithPriceSelected: Story = {
  args: {
    options: mockOptions,
    defaultOption: 'price-low-to-high',
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент с выбранной сортировкой по цене (от низкой к высокой)'
      }
    }
  }
};

export const WithTopRatedSelected: Story = {
  args: {
    options: mockOptions,
    defaultOption: 'top-rated',
  },
};

export const WithExtendedOptions: Story = {
  args: {
    options: mockExtendedOptions,
    defaultOption: 'newest',
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент с расширенным списком опций сортировки'
      }
    }
  }
};

export const SingleOption: Story = {
  args: {
    options: [{ value: 'popular', label: 'Popular' }],
    defaultOption: 'popular',
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент с одной опцией сортировки'
      }
    }
  }
};

export const WithSortHandler: Story = {
  args: {
    options: mockOptions,
    defaultOption: 'popular',
    onSortChange: (option: string) => option,
  },
};

export const Interactive: Story = {
  args: {
    options: mockOptions,
    defaultOption: 'popular',
  },
  parameters: {
    docs: {
      description: {
        story: 'Интерактивный компонент - можно открывать/закрывать и выбирать опции'
      }
    }
  }
};

export const DropdownStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4>Закрытый dropdown </h4>
        < Sorting options={mockOptions} defaultOption="popular" />
      </div>
      < div >
        <h4>Открытый dropdown(имитация) </h4>
        <div style={{ position: 'relative' }}>
          <Sorting options={mockOptions} defaultOption="popular" />
          <ul
            className="places__options places__options--custom places__options--opened"
            style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10 }}
          >
            {
              mockOptions.map((option) => (
                <li
                  key={option.value}
                  className={`places__option ${option.value === 'popular' ? 'places__option--active' : ''}`}
                >
                  {option.label}
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  ),
};

export const AllOptions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {
        mockOptions.map((option) => (
          <div key={option.value} >
            <h4>{option.label} </h4>
            < Sorting options={mockOptions} defaultOption={option.value} />
          </div>
        ))
      }
    </div>
  ),
};
