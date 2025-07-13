// src/pages/KelajakZakazlar.jsx

import { useEffect, useState } from 'react';
import axios from '../../axiosConfig.js';
import ZakazCard from '../components/ZakazCard.jsx';
import Navbar from '../components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';

function KelajakZakazlar() {
  const [orders, setOrders] = useState([]);        // Zakazlar ro‘yxati
  const [isAdmin, setIsAdmin] = useState(false);   // Admin huquqi
  const navigate = useNavigate();                  // ◀ Ortga yurish uchun

  // 🔑 TOKENNI O‘ZINGIZ QAYERGA SAQLAGAN BO‘LSANGIZ, SHU YERDA OLIB KELING
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('/api/scheduled-orders/future', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setOrders(res.data);
    })
    .catch(err => {
      console.error("❌ Kelajak zakazlarni olishda xatolik:", err);
    });
  }, [token]); // <-- token o‘zgarganda qayta chaqiradi

  return (
    <div className="min-h-screen bg-gray-100">
     

      <div className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📅 Kelajakdagi Zakazlar</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ◀ Ortga
          </button>
        </div>

        {/* 🧾 Zakazlar ro‘yxati yoki xabar */}
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">Kelajakdagi zakazlar yo‘q.</p>
        ) : (
          orders.map((order) => (
            <ZakazCard key={order.id} order={order} isAdmin={isAdmin} />
          ))
        )}
      </div>
    </div>
  );
}

export default KelajakZakazlar;
