import type { Meta, StoryObj } from '@storybook/react';
import { HostInfo } from '.';

const meta = {
  title: 'Components/HostInfo',
  component: HostInfo,
} satisfies Meta<typeof HostInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RegularHost: Story = {
  args: {
    host: {
      name: 'Angelina',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXp3DxP80ArpRzsB0XWBG9Ow5GeuefbLrUHw&s',
      isPro: false,
    },
    description: 'Modern apartment in city center.',
  },
};
