import type { Meta, StoryObj } from '@storybook/react';
import { OfferHeader } from '.';

const meta: Meta<typeof OfferHeader> = {
  title: 'Components/OfferHeader',
  component: OfferHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Заголовок предложения с премиум-меткой и кнопкой добавления в избранное.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Название предложения',
      table: {
        type: { summary: 'string' },
      },
    },
    isPremium: {
      control: 'boolean',
      description: 'Является ли предложение премиальным',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isFavorite: {
      control: 'boolean',
      description: 'Добавлено ли предложение в избранное',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onFavoriteToggle: {
      action: 'favorite toggled',
      description: 'Обработчик клика по кнопке избранного',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
  args: {
    title: 'Beautiful & luxurious apartment at great location',
    isPremium: true,
    isFavorite: true
  },
} satisfies Meta<typeof OfferHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PremiumFavorite: Story = {
  name: 'Премиум в избранном',
  parameters: {
    docs: {
      description: {
        story: 'Премиальное предложение, добавленное в избранное.',
      },
    },
  },
};

export const PremiumNotFavorite: Story = {
  args: {
    isFavorite: false,
  },
  name: 'Премиум не в избранном',
  parameters: {
    docs: {
      description: {
        story: 'Премиальное предложение, не добавленное в избранное.',
      },
    },
  },
};

export const StandardFavorite: Story = {
  args: {
    title: 'Nice, cozy, warm big bed apartment',
    isPremium: false,
    isFavorite: true,
  },
  name: 'Стандарт в избранном',
  parameters: {
    docs: {
      description: {
        story: 'Стандартное предложение, добавленное в избранное.',
      },
    },
  },
};

export const StandardNotFavorite: Story = {
  args: {
    title: 'Wood and stone place',
    isPremium: false,
    isFavorite: false,
  },
  name: 'Стандарт не в избранном',
  parameters: {
    docs: {
      description: {
        story: 'Стандартное предложение, не добавленное в избранное.',
      },
    },
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Absolutely stunning modern loft with panoramic city views and luxury amenities in the heart of downtown',
    isPremium: true,
    isFavorite: false,
  },
  name: 'Длинный заголовок',
  parameters: {
    docs: {
      description: {
        story: 'Предложение с очень длинным названием.',
      },
    },
  },
};

export const ShortTitle: Story = {
  args: {
    title: 'Cozy Room',
    isPremium: false,
    isFavorite: true,
  },
  name: 'Короткий заголовок',
  parameters: {
    docs: {
      description: {
        story: 'Предложение с коротким названием.',
      },
    },
  },
};

export const WithoutPremiumMark: Story = {
  args: {
    title: 'Simple Apartment',
    isPremium: false,
    isFavorite: false,
  },
  name: 'Без премиум-метки',
  parameters: {
    docs: {
      description: {
        story: 'Стандартное предложение без премиум-метки.',
      },
    },
  },
};