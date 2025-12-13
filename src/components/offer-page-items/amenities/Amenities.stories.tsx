import type { Meta, StoryObj } from '@storybook/react';
import { AmenitiesList } from '.';

const meta = {
  title: 'Components/AmenitiesList',
  component: AmenitiesList,
} satisfies Meta<typeof AmenitiesList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    amenities: ['Wi-Fi', 'Heating', 'Kitchen', 'Fridge', 'Washing machine'],
  },
};

export const FewAmenities: Story = {
  args: {
    amenities: ['Wi-Fi', 'Kitchen'],
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
    ],
  },
};

export const Empty: Story = {
  args: {
    amenities: [],
  },
};
