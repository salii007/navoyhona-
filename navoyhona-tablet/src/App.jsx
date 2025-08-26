import { Routes, Route, Navigate } from 'react-router-dom';

// LOGIN
import CommonLogin from './common/pages/CommonLogin.jsx';
import AdminLogin from './admin/pages/Login.jsx';

// ADMIN
import ProtectedRouteAdmin from './router/ProtectedRouteAdmin.jsx';
import AdminLayout from './admin/layout/AdminLayout.jsx';
import Dashboard from './admin/pages/Dashboard.jsx';
import ZakazlarAdmin from './admin/pages/ZakazlarAdmin.jsx';
import Statistika from './admin/pages/StatistikaPage.jsx';
import Sozlamalar from './admin/pages/SozlamalarPage.jsx';

// COURIER
import ProtectedRouteCourier from './router/ProtectedRouteCourier.jsx';
import CourierLayout from './courier/layouts/CourierLayout.jsx';

// TABLET
import ProtectedRouteTablet from './router/ProtectedRouteTablet.jsx';
import TabletLayout from './tablet/layouts/TabletLayout.jsx';

export default function App() {
  return (
    <Routes>
      {/* Login sahifalari */}
      <Route path="/login" element={<CommonLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ADMIN yo‘llari (faqat admin) */}
      <Route element={<ProtectedRouteAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="zakazlar" element={<ZakazlarAdmin />} />
          <Route path="statistika" element={<Statistika />} />
          <Route path="sozlamalar" element={<Sozlamalar />} />
        </Route>
      </Route>

      {/* COURIER yo‘llari (faqat courier) */}
      <Route element={<ProtectedRouteCourier />}>
        <Route path="/courier/*" element={<CourierLayout />} />
      </Route>

      {/* TABLET yo‘llari (faqat tablet) */}
      <Route element={<ProtectedRouteTablet />}>
        <Route path="/*" element={<TabletLayout />} />
      </Route>

      {/* Not found → login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
