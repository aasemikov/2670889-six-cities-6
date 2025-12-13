import { Outlet } from 'react-router-dom';
import { Header } from '../header';

export const Layout = () => (
  <div className="page">
    <Header />
    <Outlet />
  </div>
);
