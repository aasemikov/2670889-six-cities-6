import type { Meta, StoryObj } from '@storybook/react';
import { ReviewForm } from '.';

const meta = {
  title: 'Components/ReviewForm',
  component: ReviewForm,
} satisfies Meta<typeof ReviewForm>;

export default meta;
type Story = StoryObj<typeof ReviewForm>;

export const Empty: Story = {};
