// src/courier/router/index.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import CourierLayout      from '../layouts/CourierLayout';
import CourierLogin       from '../../common/pages/CommonLogin.jsx';
import CourierPrivateRoute from '../components/CourierPrivateRoute.jsx';

export default function CourierRouter() {
  return (
    <Routes>
      {/* Kirish sahifasi */}
      <Route path="login" element={<CourierLogin />} />

      {/* Barcha ichki sahifalar himoyalangan */}
      <Route element={<CourierPrivateRoute />}>
        <Route path="/*" element={<CourierLayout />} />
      </Route>

      {/* Noma'lum pathlar */}
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}
