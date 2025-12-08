import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from '.';

jest.mock('../Header', () => ({
  Header: () => <header>Шапка сайта</header>,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div>Контент страницы</div>,
}));

describe('Компонент Layout', () => {
  it('отображает шапку и основной контент', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    expect(screen.getByText('Шапка сайта')).toBeInTheDocument();
    expect(screen.getByText('Контент страницы')).toBeInTheDocument();
  });

  it('использует CSS класс "page" для контейнера', () => {
    const { container } = render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );

    const pageElement = container.querySelector('.page');
    expect(pageElement).toBeInTheDocument();
  });
});
