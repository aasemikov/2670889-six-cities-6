import type { Meta, StoryObj } from '@storybook/react';
import { OfferHeader } from '.';

const meta = {
  title: 'Components/OfferHeader',
  component: OfferHeader,
} satisfies Meta<typeof OfferHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Premium: Story = {
  args: {
    title: 'Luxury Apartment',
    isPremium: true,
    isFavorite: true,
    onFavoriteToggle: () => { },
  },
};

export const Standard: Story = {
  args: {
    title: 'Cozy Room',
    isPremium: false,
    isFavorite: false,
    onFavoriteToggle: () => { },
  },
};
