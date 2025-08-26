// src/admin/components/AdminPrivateRoute.jsx
import { Navigate } from 'react-router-dom';

export default function AdminPrivateRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  const role = localStorage.getItem('role');

  if (!token || role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
