import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRouteTablet() {
  const token = localStorage.getItem('tabletToken');
  const role = localStorage.getItem('role');
  const location = useLocation();

  if (!token || role !== 'tablet') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
