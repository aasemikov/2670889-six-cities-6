import { Container } from '../Container';
import { NavBar } from '../NavBar';

export const Header: React.FC = () => (
  <header className="header">
    <Container>
      <div className="header__wrapper">
        <div className="header__left">
          <a className="header__logo-link header__logo-link--active">
            <img
              className="header__logo"
              src="img/logo.svg"
              alt="6 cities logo"
              width="81"
              height="41"
            />
          </a>
        </div>
        <NavBar />
      </div>
    </Container>
  </header>
);
