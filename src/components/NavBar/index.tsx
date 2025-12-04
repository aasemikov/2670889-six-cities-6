import React, { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks/redux';
import { logout } from '../../store/slices/auth-slice';
import { fetchFavorites } from '../../store/slices/favorites-slice';

type NavBarProps = {
  isAuthorized: boolean;
};

export const NavBar: React.FC<NavBarProps> = ({ isAuthorized }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { favorites } = useAppSelector((state) => state.favorites);
  const favoritesCount = favorites.length;

  useEffect(() => {
    if (isAuthorized) {
      dispatch(fetchFavorites());
    }
  }, [isAuthorized, dispatch]);

  const handleLogout = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(logout());
  }, [dispatch]);

  if (!isAuthorized) {
    return (
      <nav className="header__nav">
        <ul className="header__nav-list">
          <li className="header__nav-item">
            <Link className="header__nav-link" to="/login">
              <span className="header__login">Sign in</span>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav className="header__nav">
      <ul className="header__nav-list">
        <li className="header__nav-item user">
          <Link
            className="header__nav-link header__nav-link--profile"
            to="/favorites"
          >
            <div className="header__avatar-wrapper user__avatar-wrapper">
              {user?.avatarUrl && (
                <img
                  className="header__avatar user__avatar"
                  src={user.avatarUrl}
                  alt={user.name}
                  width="54"
                  height="54"
                />
              )}
            </div>
            <span className="header__user-name user__name">
              {user?.email || 'User'}
            </span>
            {favoritesCount > 0 && (
              <span className="header__favorite-count">{favoritesCount}</span>
            )}
          </Link>
        </li>
        <li className="header__nav-item">
          <a
            className="header__nav-link"
            href="#"
            onClick={handleLogout}
          >
            <span className="header__signout">Sign out</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};
