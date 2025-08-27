// src/admin/components/AdminGuard.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export default function AdminGuard() {
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // Agar guard ichida bo'lsa, admin loginiga qaytaramiz
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const role = getRoleFromToken(token);
  if (role !== 'admin') {
    // roli mos kelmasa, admin loginiga
    return <Navigate to="/admin/login" replace />;
  }

  // Token va role to'g'ri — bolalar yo'llarini ko'rsatamiz
  return <Outlet />;
}
