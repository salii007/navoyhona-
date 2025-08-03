// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import CourierLayout from './courier/layouts/CourierLayout.jsx';
import TabletLayout from './tablet/layouts/TabletLayout.jsx';
import { adminRoutes } from './admin/routes';
import CommonLogin from './common/pages/CommonLogin.jsx';
import AdminLogin from './admin/pages/Login.jsx';

function getUserRole() {
  const pathname = window.location.pathname;
  const tokenKey = pathname.startsWith('/courier') ? 'courierToken' : 'tabletToken';
  const token = localStorage.getItem(tokenKey);

  try {
    return token ? JSON.parse(atob(token.split('.')[1])).role : null;
  } catch {
    return null;
  }
}

export default function App() {
  const role = getUserRole();

  return (
    <Routes>
      {/* Login sahifalari */}
      <Route path="/login" element={<CommonLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin yo‘llari – HAR DOIM birinchi bo‘lishi kerak */}
      {adminRoutes}

      {/* Boshqa layoutlar */}
      <Route path="/courier/*" element={<CourierLayout />} />
      <Route path="/*" element={<TabletLayout />} />

      {/* Token yo‘q bo‘lsa login sahifasiga */}
      {!role && <Route path="*" element={<Navigate to="/login" replace />} />}
    </Routes>
  );
}
