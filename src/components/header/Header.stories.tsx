import { configureStore } from '@reduxjs/toolkit';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

const createMockStore = (isAuthorized: boolean) =>
  configureStore({
    reducer: {
      auth: () => ({
        authorizationStatus: isAuthorized ? 'AUTH' : 'NO_AUTH'
      })
    }
  });

const withProviders = (isAuthorized: boolean = true) => (Story: React.ComponentType) => (
  <MemoryRouter>
    <Provider store={createMockStore(isAuthorized)}>
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Story />
      </div>
    </Provider>
  </MemoryRouter>
);

const HeaderMock: React.FC = () => {
  const baseUrl = window.location.pathname.includes('storybook') ? '/storybook/' : '/';

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <a className="header__logo-link" href="/">
              <img
                className="header__logo"
                src={`${baseUrl}img/logo.svg`}
                alt="6 cities logo"
                width="81"
                height="41"
              />
            </a>
          </div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item">
                <a className="header__nav-link" href="/login">
                  <span className="header__signout">Sign in</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

const meta = {
  title: 'Components/Header',
  component: HeaderMock,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [withProviders(true)],
} satisfies Meta<typeof HeaderMock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Authorized: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Шапка для авторизованного пользователя'
      }
    }
  }
};

export const Unauthorized: Story = {
  decorators: [withProviders(false)],
  parameters: {
    docs: {
      description: {
        story: 'Шапка для неавторизованного пользователя'
      }
    }
  }
};