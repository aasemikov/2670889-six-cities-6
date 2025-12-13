import type { Meta, StoryObj } from '@storybook/react';
import { OfferGallery } from '.';

const meta = {
  title: 'Components/OfferGallery',
  component: OfferGallery,
} satisfies Meta<typeof OfferGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    images: [
      'https://hotel-spb.ru/assets/components/phpthumbof/cache/rooms-01.30933c2db2be01cc7d608f4aa383397b.jpg',
      'https://hotel-spb.ru/assets/components/phpthumbof/cache/rooms-01.30933c2db2be01cc7d608f4aa383397b.jpg',
      'https://hotel-spb.ru/assets/components/phpthumbof/cache/rooms-01.30933c2db2be01cc7d608f4aa383397b.jpg',
      'https://hotel-spb.ru/assets/components/phpthumbof/cache/rooms-01.30933c2db2be01cc7d608f4aa383397b.jpg',
    ],
  },
};

export const ManyImages: Story = {
  args: {
    images: [
      'https://hotel-spb.ru/assets/components/phpthumbof/cache/rooms-01.30933c2db2be01cc7d608f4aa383397b.jpg',
      'https://hotel-spb.ru/assets/components/phpthumbof/cache/rooms-01.30933c2db2be01cc7d608f4aa383397b.jpg',
      'https://hotel-spb.ru/assets/components/phpthumbof/cache/rooms-01.30933c2db2be01cc7d608f4aa383397b.jpg',
      'https://hotel-spb.ru/assets/components/phpthumbof/cache/rooms-01.30933c2db2be01cc7d608f4aa383397b.jpg',
      'https://hotel-spb.ru/assets/components/phpthumbof/cache/rooms-01.30933c2db2be01cc7d608f4aa383397b.jpg',
      'https://hotel-spb.ru/assets/components/phpthumbof/cache/rooms-01.30933c2db2be01cc7d608f4aa383397b.jpg',
    ],
  },
};

export const SingleImage: Story = {
  args: {
    images: [
      'https://hotel-spb.ru/assets/components/phpthumbof/cache/rooms-01.30933c2db2be01cc7d608f4aa383397b.jpg',
    ],
  },
};

export const Empty: Story = {
  args: {
    images: [],
  },
};
