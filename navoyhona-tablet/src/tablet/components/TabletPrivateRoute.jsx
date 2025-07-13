import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Courier bo‘lmagan (tablet/admin) foydalanuvchilar uchun.
 * Agar token va role!=courier bo‘lsa, ichki sahifalarni ko‘rsatadi,
 * aks holda courier bo‘limiga yo‘naltiradi.
 */
export default function TabletPrivateRoute() {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');
  if (!token) return <Navigate to="/" replace />;
  if (role === 'courier') return <Navigate to="/courier" replace />;
  return <Outlet />;
}
