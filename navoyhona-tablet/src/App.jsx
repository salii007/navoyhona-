// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import CourierLayout from './courier/layouts/CourierLayout.jsx';
import TabletLayout from './tablet/layouts/TabletLayout.jsx';
import Login from './tablet/pages/Login.jsx'; // umumiy login sahifa

function getUserRole() {
  const pathname = window.location.pathname;
  const tokenKey = pathname.startsWith('/courier') ? 'courierToken' : 'tabletToken';
  const token = localStorage.getItem(tokenKey);

  if (!token) return null;

  try {
    return JSON.parse(atob(token.split('.')[1])).role;
  } catch {
    return null;
  }
}


export default function App() {
  const role = getUserRole();

  return (
    <Routes>
      {/* Login sahifasi har doim mavjud */}
      <Route path="/login" element={<Login />} />

      {/* Authenticated foydalanuvchilar */}
      {role === 'courier' && <Route path="/*" element={<CourierLayout />} />}
      {role === 'tablet' && <Route path="/*" element={<TabletLayout />} />}

      {/* Token yo‘q yoki noto‘g‘ri bo‘lsa → Login sahifasiga */}
      {!role && <Route path="*" element={<Navigate to="/login" replace />} />}
    </Routes>
  );
}
