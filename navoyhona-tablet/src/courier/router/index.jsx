// src/courier/router/index.jsx :contentReference[oaicite:3]{index=3}
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute     from '../../tablet/components/CourierPrivateRoute.jsx';
import Login            from '../pages/Login.jsx';
import CourierDashboard from '../pages/CourierDashboard.jsx';
import CourierOrders    from '../pages/CourierOrders.jsx';
import CourierDetails   from '../pages/CourierDetails.jsx';

export default function CourierRouter() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route index           element={<CourierDashboard />} />
        <Route path="orders"   element={<CourierOrders />} />
        <Route path="order/:id" element={<CourierDetails />} />
      </Route>
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}
