import type { Meta, StoryObj } from '@storybook/react';
import { OfferInfo } from '.';

const meta = {
  title: 'Components/OfferInfo',
  component: OfferInfo,
} satisfies Meta<typeof OfferInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Apartment: Story = {
  args: {
    rating: 4.5,
    type: 'apartment',
    bedrooms: 3,
    maxAdults: 4,
    price: 120,
  },
};

export const Room: Story = {
  args: {
    rating: 4.2,
    type: 'room',
    bedrooms: 1,
    maxAdults: 2,
    price: 80,
  },
};
