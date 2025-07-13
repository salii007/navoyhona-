import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Tablet (admin/planshet) bo‘limi uchun himoya.
 * Agar token bo‘lsa ichki sahifalarni (<Outlet/>) ko‘rsatadi,
 * aks holda login sahifasiga qaytaradi.
 */
export default function PrivateRoute() {
  const token = localStorage.getItem('token');
  return token
    ? <Outlet />
    : <Navigate to="/" replace />;
}
