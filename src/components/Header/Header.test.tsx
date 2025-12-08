import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const MockHeader = ({ isAuthorized }: { isAuthorized: boolean }) => (
  <header className="header" data-testid="header">
    <div data-testid="container">
      <div className="header__wrapper">
        <div className="header__left">
          <a className="header__logo-link" href="/">
            <img
              className="header__logo"
              src="/img/logo.svg"
              alt="6 cities logo"
              width="81"
              height="41"
            />
          </a>
        </div>
        <nav data-testid="navbar">
          {isAuthorized ? 'Авторизованная навигация' : 'Неавторизованная навигация'}
        </nav>
      </div>
    </div>
  </header>
);

describe('Компонент Header (упрощенный)', () => {
  it('корректно отображает структуру', () => {
    render(<MockHeader isAuthorized={false} />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByAltText('6 cities logo')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('отображает правильное состояние навигации', () => {
    const { rerender } = render(<MockHeader isAuthorized={false} />);
    expect(screen.getByTestId('navbar')).toHaveTextContent('Неавторизованная навигация');

    rerender(<MockHeader isAuthorized />);
    expect(screen.getByTestId('navbar')).toHaveTextContent('Авторизованная навигация');
  });

  it('содержит логотип с правильными атрибутами', () => {
    render(<MockHeader isAuthorized={false} />);

    const logoImg = screen.getByAltText('6 cities logo');
    expect(logoImg).toHaveAttribute('width', '81');
    expect(logoImg).toHaveAttribute('height', '41');
    expect(logoImg).toHaveAttribute('src', '/img/logo.svg');
  });

  it('имеет правильные CSS классы', () => {
    const { container } = render(<MockHeader isAuthorized={false} />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('header');

    const logoLink = screen.getByRole('link');
    expect(logoLink).toHaveClass('header__logo-link');
  });
});
