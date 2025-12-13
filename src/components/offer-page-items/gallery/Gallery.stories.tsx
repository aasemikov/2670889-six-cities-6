import type { Meta, StoryObj } from '@storybook/react';
import { GalleryProps, OfferGallery } from '.';

const meta: Meta<typeof OfferGallery> = {
  title: 'Components/OfferGallery',
  component: OfferGallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Галерея изображений для карточки предложения. Отображает до 6 первых изображений из массива.',
      },
    },
  },
  argTypes: {
    images: {
      control: 'object',
      description: 'Массив URL-адресов изображений',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' },
      },
    },
  },
  args: {
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558036117-15e82a2c9a9a?w-800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595526051245-4506e0005bd0?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
    ],
  },
} satisfies Meta<typeof OfferGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Стандартная галерея с 6 разными изображениями.',
      },
    },
  },
};

export const FewImages: Story = {
  args: {
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558036117-15e82a2c9a9a?w-800&auto=format&fit=crop',
    ],
  },
  name: 'Мало изображений',
  parameters: {
    docs: {
      description: {
        story: 'Галерея с 3 изображениями.',
      },
    },
  },
};

export const ManyImages: Story = {
  args: {
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558036117-15e82a2c9a9a?w-800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595526051245-4506e0005bd0?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519710889408-a67e1c7e0452?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
    ],
  },
  name: 'Много изображений',
  parameters: {
    docs: {
      description: {
        story: 'Галерея с более чем 6 изображениями. Отображаются только первые 6.',
      },
    },
  },
};

export const SingleImage: Story = {
  args: {
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop',
    ],
  },
  name: 'Одно изображение',
  parameters: {
    docs: {
      description: {
        story: 'Галерея с одним изображением.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    images: [],
  },
  name: 'Без изображений',
  parameters: {
    docs: {
      description: {
        story: 'Пустая галерея. Компонент не отобразит никаких изображений.',
      },
    },
  },
};

export const BrokenImages: Story = {
  args: {
    images: [
      'https://example.com/broken-image-1.jpg',
      'https://example.com/broken-image-2.jpg',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop',
    ],
  },
  name: 'С битыми ссылками',
  parameters: {
    docs: {
      description: {
        story: 'Галерея с частично битыми ссылками на изображения.',
      },
    },
  },
};

export const SameImages: Story = {
  args: {
    images: Array(4).fill('https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop'),
  },
  name: 'Одинаковые изображения',
  parameters: {
    docs: {
      description: {
        story: 'Галерея с одинаковыми изображениями (тестирование ключей).',
      },
    },
  },
};

