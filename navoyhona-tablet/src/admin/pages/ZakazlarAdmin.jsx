// src/admin/pages/ZakazlarAdmin.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 kerak bo‘ladi
import axios from '../../axiosConfig';

export default function ZakazlarAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 👈 qo‘shamiz

  useEffect(() => {
    const token = localStorage.getItem('admintoken');
    if (!token) {
        navigate('/admin/login');
        return;
      }

    const fetchZakazlar = async () => {
      try {
        const res = await axios.get('/admin/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('❌ Zakazlar olinmadi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchZakazlar();
  }, [navigate]);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">📦 Barcha Zakazlar (Admin)</h1>

      {loading && <p className="text-gray-500">⏳ Yuklanmoqda...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-gray-500">Hech qanday zakaz topilmadi.</p>
      )}

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`border rounded p-4 shadow-sm ${
              order.status === 'accepted'
                ? 'bg-blue-50'
                : order.status === 'picked_up'
                ? 'bg-yellow-100'
                : order.status === 'delivered'
                ? 'bg-green-100'
                : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{order.name}</p>
                <p className="text-sm text-gray-600">📞 {order.phone}</p>
                <p className="text-sm text-gray-600">📍 {order.address}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">📆 {order.date} | ⏰ {order.time}</p>
                <p className="text-sm">
                  Status: <span className="font-semibold">{order.status}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Kuryer: {order.courier_name || '❌ Biriktirilmagan'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
