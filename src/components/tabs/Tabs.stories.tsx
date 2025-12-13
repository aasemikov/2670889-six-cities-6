import type { Meta, StoryObj } from '@storybook/react';
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
    onCityChange: {
      action: 'city changed',
      description: 'Callback при изменении города'
    }
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cities: mockCities,
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент со всеми шестью городами по умолчанию'
      }
    }
  }
};

export const WithFewCities: Story = {
  args: {
    cities: mockFewCities,
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент с тремя городами'
      }
    }
  }
};

export const SingleCity: Story = {
  args: {
    cities: mockSingleCity,
  },
  parameters: {
    docs: {
      description: {
        story: 'Компонент с одним городом'
      }
    }
  }
};
