// src/admin/routes/index.jsx
import { Route } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import Dashboard from '../pages/Dashboard';

import StatistikaPage from '../pages/StatistikaPage';
import SozlamalarPage from '../pages/SozlamalarPage';
import AdminLogin from '../pages/Login';
import AdminPrivateRoute from '../components/AdminPrivateRoute';

export const adminRoutes = (
  <Route path="/admin">
    <Route index element={<AdminLogin />} />
    <Route
      path="dashboard"
      element={
        <AdminPrivateRoute>
          <AdminLayout />
        </AdminPrivateRoute>
      }
    >
      <Route index element={<Dashboard />} />
      
      <Route path="statistika" element={<StatistikaPage />} />
      <Route path="sozlamalar" element={<SozlamalarPage />} />
    </Route>
  </Route>
);
