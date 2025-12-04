import { Outlet } from 'react-router-dom';
import { Header } from '../Header';

export const Layout = () => (
  <div className="page">
    <Header />
    <Outlet />
  </div>
);
