import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Kuryer bo‘limi uchun himoya.
 * Agar token va role=courier bo‘lsa, ichki sahifalarni (<Outlet/>) ko‘rsatadi,
 * aks holda tablet bo‘limiga yo‘naltiradi.
 */
export default function CourierPrivateRoute() {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');
  if (!token) return <Navigate to="/" replace />;
  if (role !== 'courier') return <Navigate to="/" replace />;
  return <Outlet />;
}
