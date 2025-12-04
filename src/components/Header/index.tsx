import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks/redux';
import { Container } from '../Container';
import { NavBar } from '../NavBar';

export const Header: React.FC = () => {
  const { authorizationStatus } = useAppSelector((state) => state.auth);
  const isAuthorized = authorizationStatus === 'AUTH';

  return (
    <header className="header">
      <Container>
        <div className="header__wrapper">
          <div className="header__left">
            <Link className="header__logo-link" to="/">
              <img
                className="header__logo"
                src={`${import.meta.env.BASE_URL}img/logo.svg`}
                alt="6 cities logo"
                width="81"
                height="41"
              />
            </Link>
          </div>
          <NavBar isAuthorized={isAuthorized} />
        </div>
      </Container>
    </header>
  );
};
