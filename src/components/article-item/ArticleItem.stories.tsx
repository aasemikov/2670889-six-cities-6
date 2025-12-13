import type { Meta, StoryObj } from '@storybook/react';
import { ArticleItem } from '.';
import { Offer } from '../../types/offer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

const MockStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockStore = configureStore({
    reducer: {
      auth: () => ({ authorizationStatus: 'AUTH' }),
      favorites: () => ({})
    }
  });

  return (
    <MemoryRouter>
      <Provider store={mockStore}>
        {children}
      </Provider>
    </MemoryRouter>
  );
};

const mockOffer: Offer = {
  id: '1',
  title: 'Beautiful & luxurious apartment at great location',
  type: 'apartment',
  price: 120,
  city: {
    name: 'Amsterdam',
    location: {
      latitude: 52.3909553943508,
      longitude: 4.85309666406198,
      zoom: 16
    }
  },
  location: {
    latitude: 52.3909553943508,
    longitude: 4.85309666406198,
    zoom: 16
  },
  isFavorite: false,
  isPremium: true,
  rating: 4.5,
  previewImage: 'https://hotel-spb.ru/assets/components/phpthumbof/cache/predstavitelskiy_3rooms2.788c4c20502cae038e66e118c369e7b7.jpg',
  bedrooms: 3,
  maxAdults: 4,
  goods: ['Wi-Fi', 'Heating', 'Kitchen', 'Fridge', 'Washing machine', 'Towels'],
  images: [
    'https://hotel-spb.ru/assets/components/phpthumbof/cache/predstavitelskiy_3rooms2.788c4c20502cae038e66e118c369e7b7.jpg',
  ],
  host: {
    name: 'Oliver Conner',
    avatarUrl: 'https://hotel-spb.ru/assets/components/phpthumbof/cache/predstavitelskiy_3rooms2.788c4c20502cae038e66e118c369e7b7.jpg',
    isPro: true
  },
  description: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
};

const meta = {
  title: 'Components/ArticleItem',
  component: ArticleItem,
  decorators: [
    (Story) => (
      <MockStoreProvider>
        <div style={{ maxWidth: '260px', fontFamily: 'sans-serif' }}>
          <Story />
        </div>
      </MockStoreProvider>
    )
  ],
  args: {
    onCardHover: (id) => console.log('Card hover:', id),
    className: '',
    'data-testid': 'offer-card-story'
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Карточка предложения для аренды недвижимости с поддержкой избранного'
      }
    }
  }
} satisfies Meta<typeof ArticleItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    offer: mockOffer
  },
  name: 'Премиум апартаменты'
};

export const StandardRoom: Story = {
  args: {
    offer: {
      ...mockOffer,
      id: '2',
      isPremium: false,
      title: 'Nice, cozy, warm big bed apartment',
      type: 'room',
      price: 80,
      rating: 3.8,
      host: {
        name: 'Angelina',
        avatarUrl: 'https://hotel-spb.ru/assets/components/phpthumbof/cache/predstavitelskiy_3rooms2.788c4c20502cae038e66e118c369e7b7.jpg',
        isPro: false
      }
    },
  },
  name: 'Стандартная комната'
};

export const FavoriteHouse: Story = {
  args: {
    offer: {
      ...mockOffer,
      id: '3',
      isFavorite: true,
      isPremium: false,
      title: 'Wood and stone place',
      type: 'house',
      price: 200,
      rating: 4.9,
      goods: ['Wi-Fi', 'Heating', 'Kitchen', 'Garden', 'Parking'],
      host: {
        name: 'Maximilian',
        avatarUrl: 'https://hotel-spb.ru/assets/components/phpthumbof/cache/predstavitelskiy_3rooms2.788c4c20502cae038e66e118c369e7b7.jpg',
        isPro: true
      }
    },
  },
  name: 'Дом в избранном'
};

export const WithCustomClassName: Story = {
  args: {
    offer: mockOffer,
    className: 'custom-card-class',
    onCardHover: undefined
  },
  name: 'С кастомным классом'
};

export const WithoutHoverHandler: Story = {
  args: {
    offer: mockOffer,
    onCardHover: undefined
  },
  name: 'Без обработчика наведения'
};

export const UnauthorizedUser: Story = {
  args: {
    offer: mockOffer
  },
  decorators: [
    (Story) => {
      const mockStore = configureStore({
        reducer: {
          auth: () => ({ authorizationStatus: 'NO_AUTH' }),
          favorites: () => ({})
        }
      });

      return (
        <MemoryRouter>
          <Provider store={mockStore}>
            <div style={{ maxWidth: '260px', fontFamily: 'sans-serif' }}>
              <Story />
            </div>
          </Provider>
        </MemoryRouter>
      );
    }
  ],
  name: 'Неавторизованный пользователь'
};