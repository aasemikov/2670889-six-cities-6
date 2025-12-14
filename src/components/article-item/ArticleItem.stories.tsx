import type { Meta, StoryObj } from '@storybook/react';
import { ArticleItem } from '.';
import type { Offer } from '../../types/offer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const createMockStore = (isAuthorized: boolean = true) =>
  configureStore({
    reducer: {
      auth: () => ({
        authorizationStatus: isAuthorized ? 'AUTH' : 'NO_AUTH'
      }),
      favorites: () => ({ favorites: [] })
    },
  });

const mockOffer: Offer = {
  id: '1',
  title: 'Beautiful & luxurious apartment at great location',
  type: 'apartment',
  price: 120,
  isFavorite: false,
  isPremium: true,
  rating: 4.5,
  previewImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=260&h=200&fit=crop',
  description: 'A quiet cozy and picturesque that hides behind a river by the unique lightness of Amsterdam.',
  bedrooms: 3,
  maxAdults: 4,
  goods: ['Wi-Fi', 'Heating', 'Kitchen', 'Washing machine'],
  host: {
    name: 'John Doe',
    isPro: true,
    avatarUrl: 'https://example.com/avatar.jpg',
  },
  images: ['https://example.com/apartment.jpg'],
  city: {
    name: 'Amsterdam',
    location: {
      latitude: 52.374,
      longitude: 4.889,
      zoom: 12,
    },
  },
  location: {
    latitude: 52.374,
    longitude: 4.889,
    zoom: 12,
  },
};

const withReduxProvider = (isAuthorized: boolean = true) => (Story: React.ComponentType) => (
  <Provider store={createMockStore(isAuthorized)}>
    <div style={{ width: '260px', margin: '20px' }}>
      <Story />
    </div>
  </Provider>
);

const meta: Meta<typeof ArticleItem> = {
  title: 'Components/ArticleItem',
  component: ArticleItem,
  decorators: [withReduxProvider(true)],
  argTypes: {
    offer: {
      control: 'object',
      description: 'Объект предложения (offer)',
    },
    onCardHover: {
      action: 'card hovered',
      description: 'Callback при наведении/уходе курсора с карточки',
    },
    className: {
      control: 'text',
      description: 'Дополнительные CSS классы',
    },
    'data-testid': {
      control: 'text',
      description: 'ID для тестирования',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Карточка предложения для отображения в списке предложений. Использует ссылки React Router и управление избранным через Redux.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArticleItem>;

export const Default: Story = {
  args: {
    offer: mockOffer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Стандартная карточка предложения с премиум статусом',
      },
    },
  },
};

export const Premium: Story = {
  args: {
    offer: {
      ...mockOffer,
      isPremium: true,
      id: 'premium-1',
      title: 'Luxury Apartment with Sea View',
      price: 300,
      rating: 4.8,
    },
  },
};

export const Regular: Story = {
  args: {
    offer: {
      ...mockOffer,
      isPremium: false,
      id: 'regular-1',
      title: 'Cozy Studio in City Center',
      price: 80,
      rating: 4.2,
    },
  },
};

export const Favorite: Story = {
  args: {
    offer: {
      ...mockOffer,
      isFavorite: true,
      id: 'favorite-1',
      title: 'Favorite Apartment Near Park',
      price: 150,
    },
  },
};

export const NotFavorite: Story = {
  args: {
    offer: {
      ...mockOffer,
      isFavorite: false,
      id: 'not-favorite-1',
      title: 'Nice Apartment Available',
    },
  },
};

export const LowRating: Story = {
  args: {
    offer: {
      ...mockOffer,
      rating: 2.3,
      id: 'low-rating-1',
      title: 'Budget Room with Basic Amenities',
      price: 45,
      isPremium: false,
    },
  },
};

export const HighRating: Story = {
  args: {
    offer: {
      ...mockOffer,
      rating: 4.9,
      id: 'high-rating-1',
      title: 'Excellent Apartment with 5-Star Reviews',
      price: 200,
    },
  },
};

export const Expensive: Story = {
  args: {
    offer: {
      ...mockOffer,
      price: 500,
      id: 'expensive-1',
      title: 'Luxury Penthouse with Private Pool',
      rating: 4.7,
    },
  },
};

export const Cheap: Story = {
  args: {
    offer: {
      ...mockOffer,
      price: 40,
      id: 'cheap-1',
      title: 'Economy Room for Solo Travelers',
      isPremium: false,
      rating: 3.5,
    },
  },
};

export const WithHoverHandling: Story = {
  args: {
    offer: mockOffer,
    onCardHover: (id) => console.log(`Card hovered: ${id}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'Карточка с обработчиками наведения мыши. Проверьте консоль браузера при наведении.',
      },
    },
  },
};

export const UnauthorizedUser: Story = {
  decorators: [withReduxProvider(false)],
  args: {
    offer: mockOffer,
  },
  parameters: {
    docs: {
      description: {
        story: 'Поведение при неавторизованном пользователе. При клике на избранное произойдет переход на страницу логина.',
      },
    },
  },
};

export const DifferentTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', maxWidth: '1200px' }}>
      {[
        { type: 'apartment', title: 'Modern Apartment', price: 120 },
        { type: 'room', title: 'Private Room', price: 60 },
        { type: 'house', title: 'Country House', price: 180 },
        { type: 'hotel', title: 'Hotel Suite', price: 220 },
      ].map((item, index) => (
        <ArticleItem
          key={item.type}
          offer={{
            ...mockOffer,
            id: `type-${index}`,
            type: 'apartment',
            title: item.title,
            price: item.price,
            isPremium: index % 2 === 0,
          }}
        />
      ))}
    </div>
  ),
  decorators: [
    (Story) => (
      <Provider store={createMockStore(true)}>
        <div style={{ padding: '20px' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Примеры карточек с разными типами жилья',
      },
    },
  },
};

export const AllVariantsGrid: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px',
        padding: '20px',
      }}
    >
      <ArticleItem
        offer={{
          ...mockOffer,
          id: 'variant-1',
          title: 'Luxury Premium Apartment',
          isPremium: true,
          isFavorite: true,
          price: 300,
          rating: 4.9,
        }}
      />
      <ArticleItem
        offer={{
          ...mockOffer,
          id: 'variant-2',
          isPremium: false,
          isFavorite: false,
          title: 'Budget Room',
          price: 50,
          rating: 3.2,
        }}
      />
      <ArticleItem
        offer={{
          ...mockOffer,
          id: 'variant-3',
          isPremium: true,
          isFavorite: false,
          title: 'Business Class Hotel',
          price: 400,
          rating: 4.7,
        }}
      />
      <ArticleItem
        offer={{
          ...mockOffer,
          id: 'variant-4',
          isPremium: false,
          isFavorite: true,
          title: 'Cozy Cottage',
          price: 120,
          rating: 4.5,
        }}
      />
    </div>
  ),
  decorators: [
    (Story) => (
      <Provider store={createMockStore(true)}>
        <Story />
      </Provider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Все варианты карточек в одной сетке для сравнения',
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    offer: mockOffer,
    className: 'custom-card-class',
  },
  parameters: {
    docs: {
      description: {
        story: 'Карточка с дополнительным CSS классом',
      },
    },
  },
};

export const WithTestId: Story = {
  args: {
    offer: mockOffer,
    'data-testid': 'offer-card-storybook-test',
  },
  parameters: {
    docs: {
      description: {
        story: 'Карточка с кастомным test-id для тестирования',
      },
    },
  },
};