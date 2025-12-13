import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout';
import { PrivateRoute } from './components/private-route';
import { PublicRoute } from './components/public-route';
import NotFound from './pages/404';
import { FavoritesPage } from './pages/favorites';
import { LoginPage } from './pages/login';
import Main from './pages/main';
import { OfferPage } from './pages/offer';
import { useAppDispatch, useAppSelector } from './store/hooks/redux';
import { checkAuth } from './store/slices/auth-slice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { authorizationStatus } = useAppSelector((state) => state.auth);
  const isAuthorized = authorizationStatus === 'AUTH';

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />} />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route element={<PrivateRoute isAuthorized={isAuthorized} />}>
          <Route path="/favorites" element={<FavoritesPage />} />
        </Route>
        <Route element={<PublicRoute isAuthorized={isAuthorized} />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
