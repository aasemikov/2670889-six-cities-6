import React, { FormEvent, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { cities } from '../../mocks/cities';
import { useAppDispatch, useAppSelector } from '../../store/hooks/redux';
import { clearError, login } from '../../store/slices/auth-slice';
import { setSelectedCity } from '../../store/slices/offers-slice';
import { City } from '../../types/offer';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [randomCity, setRandomCity] = useState<City>(cities[0]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authorizationStatus, loading, error } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * cities.length);
    setRandomCity(cities[randomIndex]);

    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const handleCityClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(setSelectedCity(randomCity));
    navigate('/');
  };

  if (authorizationStatus === 'AUTH') {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="page page--gray page--login">
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" onSubmit={handleSubmit}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  className={'login__input form__input'}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  className={'login__input form__input'}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <button
                className="login__submit form__submit button"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              {error && (
                <div className="login__error">
                  <p>Authorization failed. Please check your email and password.</p>
                </div>
              )}
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a
                className="locations__item-link"
                href="/"
                onClick={handleCityClick}
              >
                <span>{randomCity.name}</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
