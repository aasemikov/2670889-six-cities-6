import type { Meta, StoryObj } from '@storybook/react';
import { HostInfo, HostInfoProps } from '.';

const meta: Meta<typeof HostInfo> = {
  title: 'Components/HostInfo',
  component: HostInfo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Компонент для отображения информации о хозяине и описания предложения.',
      },
    },
  },
  argTypes: {
    host: {
      control: 'object',
      description: 'Информация о хозяине',
      table: {
        type: {
          summary: '{ name: string, avatar: string, isPro: boolean }'
        },
      },
    },
    description: {
      control: 'text',
      description: 'Описание предложения (поддерживает переносы строк)',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    host: {
      name: 'Angelina',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isPro: false,
    },
    description: 'A quiet cozy and picturesque apartment that hides behind a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
  },
} satisfies Meta<typeof HostInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RegularHost: Story = {
  name: 'Обычный хозяин',
  parameters: {
    docs: {
      description: {
        story: 'Информация о хозяине без статуса Pro.',
      },
    },
  },
};

export const ProHost: Story = {
  args: {
    host: {
      name: 'Maximilian',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isPro: true,
    },
    description: 'Luxury penthouse with panoramic views of the city. Recently renovated with high-end finishes and designer furniture. Perfect for those seeking comfort and style.',
  },
  name: 'Pro хозяин',
  parameters: {
    docs: {
      description: {
        story: 'Информация о хозяине со статусом Pro.',
      },
    },
  },
};

export const LongDescription: Story = {
  args: {
    host: {
      name: 'Oliver Conner',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      isPro: true,
    },
    description: `This stunning modern apartment is located in the heart of the city, just steps away from the main attractions, restaurants, and public transport.

The space features an open-plan living area with floor-to-ceiling windows offering breathtaking views of the city skyline. The fully equipped kitchen includes state-of-the-art appliances, perfect for preparing meals at home.

The bedroom is a tranquil retreat with a comfortable king-size bed and blackout curtains for a perfect night's sleep. The ensuite bathroom features a rainfall shower and luxury toiletries.

Additional amenities include high-speed Wi-Fi, smart TV with streaming services, air conditioning, and a dedicated workspace.`,
  },
  name: 'Длинное описание',
  parameters: {
    docs: {
      description: {
        story: 'Информация с многострочным описанием (разделяется по переносам строк).',
      },
    },
  },
};

export const ShortDescription: Story = {
  args: {
    host: {
      name: 'Sophie',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isPro: false,
    },
    description: 'Cozy room in a shared apartment.',
  },
  name: 'Краткое описание',
  parameters: {
    docs: {
      description: {
        story: 'Информация с очень коротким описанием.',
      },
    },
  },
};

export const BrokenAvatar: Story = {
  args: {
    host: {
      name: 'John Doe',
      avatar: 'https://broken-link.com/avatar.jpg',
      isPro: true,
    },
    description: 'Apartment with a great location.',
  },
  name: 'Битая аватарка',
  parameters: {
    docs: {
      description: {
        story: 'Хозяин с неработающей ссылкой на аватар.',
      },
    },
  },
};

export const NoAvatar: Story = {
  args: {
    host: {
      name: 'Anonymous',
      avatar: '',
      isPro: false,
    },
    description: 'Private listing with limited information.',
  },
  name: 'Без аватарки',
  parameters: {
    docs: {
      description: {
        story: 'Хозяин без аватарки (пустая строка).',
      },
    },
  },
};

const HostInfoWithErrorHandling: React.FC<HostInfoProps> = ({ host, description }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face';
  };

  return (
    <div className="offer__host">
      <h2 className="offer__host-title">Meet the host</h2>
      <div className="offer__host-user user">
        <div
          className={`offer__avatar-wrapper ${host.isPro ? 'offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}
        >
          <img
            className="offer__avatar user__avatar"
            src={host.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
            width="74"
            height="74"
            alt={`${host.name}'s avatar`}
            onError={handleImageError}
          />
        </div>
        <span className="offer__user-name">{host.name}</span>
        {host.isPro && <span className="offer__user-status">Pro</span>}
      </div>
      <div className="offer__description">
        {description.split('\n').map((paragraph, index) => (
          <p key={`paragraph-${index}`} className="offer__text">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export const WithErrorHandling: Story = {
  render: (args) => <HostInfoWithErrorHandling {...args} />,
  args: {
    host: {
      name: 'Test Host',
      avatar: 'https://broken-image-url.com/avatar.jpg',
      isPro: true,
    },
    description: 'This apartment features a modern design with all necessary amenities for a comfortable stay.',
  },
  name: 'С обработкой ошибок',
  parameters: {
    docs: {
      description: {
        story: 'Версия компонента с обработкой ошибок загрузки аватарки.',
      },
    },
  },
};

export const Interactive: Story = {
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        story: 'Интерактивная история для тестирования различных значений пропсов.',
      },
    },
  },
};
