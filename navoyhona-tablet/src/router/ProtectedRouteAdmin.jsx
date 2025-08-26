import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRouteAdmin() {
  const token =
    localStorage.getItem('adminToken') ||
    localStorage.getItem('token'); // agar keyin bitta kalitga o'tsangiz

  const role = localStorage.getItem('role');
  const location = useLocation();

  if (!token || role !== 'admin') {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
