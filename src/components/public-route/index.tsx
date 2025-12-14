import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PublicRouteProps {
  isAuthorized: boolean;
  redirectPath?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  isAuthorized,
  redirectPath = '/',
}) => {
  const location = useLocation();

  if (isAuthorized) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
