import { configureStore } from '@reduxjs/toolkit';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { Header } from '.';

const createMockStore = (isAuthorized: boolean) =>
  configureStore({
    reducer: {
      auth: () => ({
        authorizationStatus: isAuthorized ? 'AUTH' : 'NO_AUTH',
        user: isAuthorized ? {
          email: 'john@example.com',
          name: 'John Doe',
          avatarUrl: 'https://example.com/avatar.jpg'
        } : null
      }),
      favorites: () => ({
        favorites: isAuthorized
          ? [
            { id: '1', title: 'Favorite Apartment 1' },
            { id: '2', title: 'Favorite Apartment 2' },
            { id: '3', title: 'Favorite Apartment 3' },
          ]
          : [],
        isLoading: false,
        error: null
      }),
    }
  });

const withReduxProvider = (isAuthorized: boolean = true) => (Story: React.ComponentType) => (
  <Provider store={createMockStore(isAuthorized)}>
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Story />
    </div>
  </Provider>
);

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [withReduxProvider(true)],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof Header>;

export const AuthorizedWithFavorites: Story = {
  decorators: [withReduxProvider(true)],
  parameters: {
    docs: {
      description: {
        story: 'Шапка для авторизованного пользователя с избранными предложениями'
      }
    }
  }
};

export const AuthorizedNoFavorites: Story = {
  decorators: [
    (Story) => (
      <Provider store={configureStore({
        reducer: {
          auth: () => ({
            authorizationStatus: 'AUTH',
            user: {
              email: 'john@example.com',
              name: 'John Doe',
              avatarUrl: 'https://example.com/avatar.jpg'
            }
          }),
          favorites: () => ({
            favorites: [],
            isLoading: false,
            error: null
          })
        }
      })}>
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
          <Story />
        </div>
      </Provider>
    )
  ],
  render: () => <Header />,
  parameters: {
    docs: {
      description: {
        story: 'Шапка для авторизованного пользователя без избранных предложений'
      }
    }
  }
};

export const Unauthorized: Story = {
  decorators: [withReduxProvider(false)],
  parameters: {
    docs: {
      description: {
        story: 'Шапка для неавторизованного пользователя'
      }
    }
  }
};

export const LoadingFavorites: Story = {
  decorators: [
    (Story) => (
      <Provider store={configureStore({
        reducer: {
          auth: () => ({
            authorizationStatus: 'AUTH',
            user: {
              email: 'john@example.com',
              name: 'John Doe',
              avatarUrl: 'https://example.com/avatar.jpg'
            }
          }),
          favorites: () => ({
            favorites: [],
            isLoading: true, 
            error: null
          })
        }
      })}>
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
          <Story />
        </div>
      </Provider>
    )
  ],
  render: () => <Header />,
  parameters: {
    docs: {
      description: {
        story: 'Шапка в состоянии загрузки избранных предложений'
      }
    }
  }
};

export const ErrorFavorites: Story = {
  decorators: [
    (Story) => (
      <Provider store={configureStore({
        reducer: {
          auth: () => ({
            authorizationStatus: 'AUTH',
            user: {
              email: 'john@example.com',
              name: 'John Doe',
              avatarUrl: 'https://example.com/avatar.jpg'
            }
          }),
          favorites: () => ({
            favorites: [],
            isLoading: false,
            error: 'Failed to load favorites'
          })
        }
      })}>
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
          <Story />
        </div>
      </Provider>
    )
  ],
  render: () => <Header />,
  parameters: {
    docs: {
      description: {
        story: 'Шапка с ошибкой загрузки избранных предложений'
      }
    }
  }
};

export const InPageContext: Story = {
  decorators: [withReduxProvider(true)],
  render: () => (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <h2>Главная страница</h2>
        <p>Пример контента страницы с Header компонентом.</p>
        <p>Навигация и ссылки работают через BrowserRouter из Storybook.</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header в контексте страницы с навигацией'
      }
    }
  }
};

export const AllStates: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2>Разные состояния Header</h2>

      <div style={{ marginBottom: '40px', borderBottom: '2px solid #ccc', paddingBottom: '20px' }}>
        <h3>Авторизованный с избранными (3):</h3>
        <Provider store={createMockStore(true)}>
          <Header />
        </Provider>
      </div>

      <div style={{ marginBottom: '40px', borderBottom: '2px solid #ccc', paddingBottom: '20px' }}>
        <h3>Авторизованный без избранных:</h3>
        <Provider store={configureStore({
          reducer: {
            auth: () => ({
              authorizationStatus: 'AUTH',
              user: {
                email: 'john@example.com',
                name: 'John Doe',
                avatarUrl: 'https://example.com/avatar.jpg'
              }
            }),
            favorites: () => ({
              favorites: [],
              isLoading: false,
              error: null
            })
          }
        })}>
          <Header />
        </Provider>
      </div>

      <div style={{ marginBottom: '40px', borderBottom: '2px solid #ccc', paddingBottom: '20px' }}>
        <h3>Неавторизованный:</h3>
        <Provider store={createMockStore(false)}>
          <Header />
        </Provider>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Сравнение разных состояний Header'
      }
    }
  }
};