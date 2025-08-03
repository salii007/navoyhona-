// src/tablet/components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const token = localStorage.getItem('tabletToken');
  const role = localStorage.getItem('role');

  if (!token || role !== 'tablet') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
