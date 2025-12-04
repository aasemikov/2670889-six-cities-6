import type { Meta, StoryObj } from '@storybook/react';
import { ArticleItem } from '.';
import { Offer } from '../../types/offer';

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
  args: {
    onCardHover: undefined,
  },
} satisfies Meta<typeof ArticleItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PremiumApartment: Story = {
  args: {
    offer: mockOffer,
  },
};

export const StandardRoom: Story = {
  args: {
    offer: {
      ...mockOffer,
      id: '2',
      isPremium: false,
      title: 'Nice, cozy, warm big bed apartment',
      previewImage: 'https://hotel-spb.ru/assets/components/phpthumbof/cache/predstavitelskiy_3rooms2.788c4c20502cae038e66e118c369e7b7.jpg',
      type: 'room',
      host: {
        name: 'Angelina',
        avatarUrl: 'https://hotel-spb.ru/assets/components/phpthumbof/cache/predstavitelskiy_3rooms2.788c4c20502cae038e66e118c369e7b7.jpg',
        isPro: false
      }
    },
  },
};

export const FavoriteHouse: Story = {
  args: {
    offer: {
      ...mockOffer,
      id: '3',
      isFavorite: true,
      title: 'Wood and stone place',
      previewImage: 'https://hotel-spb.ru/assets/components/phpthumbof/cache/predstavitelskiy_3rooms2.788c4c20502cae038e66e118c369e7b7.jpg',
      type: 'house',
      goods: ['Wi-Fi', 'Heating', 'Kitchen', 'Garden', 'Parking'],
      host: {
        name: 'Maximilian',
        avatarUrl: 'https://hotel-spb.ru/assets/components/phpthumbof/cache/predstavitelskiy_3rooms2.788c4c20502cae038e66e118c369e7b7.jpg',
        isPro: true
      }
    },
  },
};
