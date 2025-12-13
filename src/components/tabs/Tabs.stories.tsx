import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tabs } from '.';
import { City } from '../../types/offer';

const mockCities: City[] = [
  {
    name: 'Paris',
    location: {
      latitude: 48.856613,
      longitude: 2.352222,
      zoom: 13
    }
  },
  {
    name: 'Cologne',
    location: {
      latitude: 50.937531,
      longitude: 6.960279,
      zoom: 13
    }
  },
  {
    name: 'Brussels',
    location: {
      latitude: 50.850346,
      longitude: 4.351721,
      zoom: 13
    }
  },
  {
    name: 'Amsterdam',
    location: {
      latitude: 52.37454,
      longitude: 4.897976,
      zoom: 13
    }
  },
  {
    name: 'Hamburg',
    location: {
      latitude: 53.550341,
      longitude: 10.000654,
      zoom: 13
    }
  },
  {
    name: 'Dusseldorf',
    location: {
      latitude: 51.227741,
      longitude: 6.773456,
      zoom: 13
    }
  }
];

const mockFewCities: City[] = [
  {
    name: 'Paris',
    location: {
      latitude: 48.856613,
      longitude: 2.352222,
      zoom: 13
    }
  },
  {
    name: 'Amsterdam',
    location: {
      latitude: 52.37454,
      longitude: 4.897976,
      zoom: 13
    }
  },
  {
    name: 'Hamburg',
    location: {
      latitude: 53.550341,
      longitude: 10.000654,
      zoom: 13
    }
  }
];

const mockSingleCity: City[] = [
  {
    name: 'Paris',
    location: {
      latitude: 48.856613,
      longitude: 2.352222,
      zoom: 13
    }
  }
];

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    cities: {
      control: 'object',
      description: 'Массив городов для отображения в табах'
    },
    selectedCity: {
      control: 'object',
      description: 'Выбранный город (активная вкладка)'
    },
    onCityChange: {
      action: 'city changed',
      description: 'Callback при изменении города'
    },
    className: {
      control: 'text',
      description: 'Дополнительные CSS классы'
    }
  },
  args: {
    selectedCity: mockCities[0],
  }
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cities: mockCities,
    selectedCity: mockCities[0],
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент со всеми шестью городами, Paris выбран по умолчанию'
      }
    }
  }
};

export const WithActiveAmsterdam: Story = {
  args: {
    cities: mockCities,
    selectedCity: mockCities[3],
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент со всеми шестью городами, Amsterdam выбран активным'
      }
    }
  }
};

export const WithFewCities: Story = {
  args: {
    cities: mockFewCities,
    selectedCity: mockFewCities[1],
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент с тремя городами, Amsterdam активен'
      }
    }
  }
};

export const SingleCity: Story = {
  args: {
    cities: mockSingleCity,
    selectedCity: mockSingleCity[0],
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент с одним городом'
      }
    }
  }
};

export const WithCustomClassName: Story = {
  args: {
    cities: mockCities,
    selectedCity: mockCities[2],
    className: 'my-custom-tabs',
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент с дополнительным CSS классом'
      }
    }
  }
};

export const Interactive: Story = {
  args: {
    cities: mockCities,
    selectedCity: mockCities[0],
  },
  render: (args) => {
    const InteractiveTabs = () => {
      const [activeCity, setActiveCity] = React.useState(args.selectedCity);

      return (
        <div>
          <Tabs
            cities={args.cities}
            selectedCity={activeCity}
            onCityChange={setActiveCity}
            className={args.className}
          />
          <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
            <p>Активный город: <strong>{activeCity.name}</strong></p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => setActiveCity(mockCities[0])}>Выбрать Paris</button>
              <button onClick={() => setActiveCity(mockCities[3])}>Выбрать Amsterdam</button>
              <button onClick={() => setActiveCity(mockCities[5])}>Выбрать Dusseldorf</button>
            </div>
          </div>
        </div>
      );
    };

    return <InteractiveTabs />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Интерактивная демонстрация работы компонента. Можно менять активный город через кнопки.'
      }
    }
  }
};