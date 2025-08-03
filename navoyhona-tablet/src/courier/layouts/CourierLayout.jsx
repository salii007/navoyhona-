// src/courier/layouts/CourierLayout.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ZakazlarCourier from '../pages/ZakazlarCourier';
import CourierOrders from '../pages/CourierOrders';
import CourierDetails from '../pages/CourierDetails';
import CourierNavbar from '../components/CourierNavbar';

export default function CourierLayout() {
  return (
    <div>
      <CourierNavbar />
      <div className="p-4">
        <Routes>
          <Route path="zakazlar" element={<ZakazlarCourier />} />
          <Route path="orders" element={<CourierOrders />} />
          <Route path="order/:id" element={<CourierDetails />} />
          <Route index element={<Navigate to="zakazlar" replace />} />
        </Routes>
      </div>
    </div>
  );
}
