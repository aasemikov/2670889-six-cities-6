import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '.';

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    isAuthorized: {
      control: 'boolean',
      description: 'Статус авторизации пользователя'
    }
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Authorized: Story = {
  args: {
    isAuthorized: true,
  },
};

export const Unauthorized: Story = {
  args: {
    isAuthorized: false,
  },
};

export const WithCustomLogo: Story = {
  args: {
    isAuthorized: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header с кастомным логотипом. Убедитесь что файл logo.svg существует в public/img/'
      }
    }
  }
};
