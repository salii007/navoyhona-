import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login             from '../pages/Login.jsx';
import Zakazlar          from '../pages/Zakazlar.jsx';
import CreateZakaz       from '../pages/CreateZakaz.jsx';
import KelajakZakazlar   from '../pages/KelajakZakazlar.jsx';
import QaytarilganNonlar from '../pages/QaytarilganNonlar.jsx';
import PrivateRoute      from '../components/PrivateRoute.jsx';

export default function TabletRoutes() {
  return (
    <Routes>
      {/* Ochiq sahifa: login */}
      <Route path="/" element={<Login />} />

      {/* Himoyalangan sahifalar */}
      <Route element={<PrivateRoute />}>
        <Route path="zakazlar"           element={<Zakazlar />} />
        <Route path="create-zakaz"       element={<CreateZakaz />} />
        <Route path="kelajak-zakazlar"   element={<KelajakZakazlar />} />
        <Route path="qaytarilgan-nonlar" element={<QaytarilganNonlar />} />
      </Route>

      {/* Boshqa yo‘llar login sahifasiga */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
