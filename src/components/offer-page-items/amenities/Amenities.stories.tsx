import type { Meta, StoryObj } from '@storybook/react';
import { AmenitiesList } from '.';

const meta: Meta<typeof AmenitiesList> = {
  title: 'Components/AmenitiesList',
  component: AmenitiesList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Компонент для отображения списка удобств/услуг в предложении аренды.',
      },
    },
  },
  argTypes: {
    amenities: {
      control: 'object',
      description: 'Массив строк с названиями удобств',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' },
      },
    },
  },
  args: {
    amenities: ['Wi-Fi', 'Heating', 'Kitchen', 'Fridge', 'Washing machine'],
  },
} satisfies Meta<typeof AmenitiesList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Стандартный список удобств для квартиры/дома.',
      },
    },
  },
};

export const FewAmenities: Story = {
  args: {
    amenities: ['Wi-Fi', 'Kitchen', 'TV'],
  },
  parameters: {
    docs: {
      description: {
        story: 'Минимальный набор удобств (3 элемента).',
      },
    },
  },
};

export const ManyAmenities: Story = {
  args: {
    amenities: [
      'Wi-Fi',
      'Heating',
      'Kitchen',
      'Fridge',
      'Washing machine',
      'Towels',
      'Coffee machine',
      'Dishwasher',
      'TV',
      'Air conditioning',
      'Parking',
      'Elevator',
      'Balcony',
      'Gym',
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Расширенный список удобств (более 10 элементов).',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    amenities: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Пустой список удобств. Компонент будет отображать только заголовок.',
      },
    },
  },
};

export const LuxuryAmenities: Story = {
  args: {
    amenities: [
      'Swimming pool',
      'Jacuzzi',
      'Sauna',
      'Home cinema',
      'Wine cellar',
      'Smart home system',
      'Concierge service',
      'Private gym',
    ],
  },
  name: 'Люкс удобства',
  parameters: {
    docs: {
      description: {
        story: 'Список премиальных удобств для люксового жилья.',
      },
    },
  },
};

export const SingleAmenity: Story = {
  args: {
    amenities: ['Free parking'],
  },
  name: 'Одно удобство',
  parameters: {
    docs: {
      description: {
        story: 'Всего одно удобство в списке.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    amenities: ['Wi-Fi', 'Kitchen', 'TV'],
  },
  parameters: {
    controls: { expanded: true },
  },
};