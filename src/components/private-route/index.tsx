import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthorized: boolean;
  redirectPath?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuthorized,
  redirectPath = '/login',
}) => {
  const location = useLocation();

  if (!isAuthorized) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
