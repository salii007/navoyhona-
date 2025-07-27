import { Routes, Route, Navigate } from 'react-router-dom';
import ZakazlarCourier from '../pages/ZakazlarCourier';
// … boshqa importlar

export default function CourierLayout() {
  return (
    <div>
      {/* Navbar, sidebar va hokazo */}
      <Routes>
        <Route path="zakazlar" element={<ZakazlarCourier />} />
        <Route index element={<Navigate to="zakazlar" />} />
        {/* kerak bo‘lsa boshqa child-sahifalar */}
      </Routes>
    </div>
  );
}
