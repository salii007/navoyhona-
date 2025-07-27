import { useEffect, useState } from 'react';
import axios from '../../axiosConfig.js';
import ZakazCard from '../components/ZakazCard';
import Navbar from '../../common/Navbar';

export default function ZakazlarCourier() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  // ✅ Zakazlarni olib kelish (axios orqali)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/courier/orders/today');
      console.log('📦 Zakazlar keldi:', res.data);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Zakazlarni olishda xatolik:", err);
      setError("Server bilan bog‘lanishda xatolik yuz berdi.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Harakat tugmalari uchun
  const handleAction = async (orderId, action, value) => {
    try {
      const res = await axios.patch(`/courier/orders/${orderId}/${action}`,
        action === 'payment' ? { payment_type: value } : {});
      console.log('✅ Yangilangan zakaz:', res.data);
      fetchOrders();
    } catch (err) {
      console.error('❌ Tugma bajarishda xato:', err);
    }
  };

  // ✅ Status va mahsulot bo‘yicha bitta filtr
  const productNames = [...new Set(orders.map(order => order.product_name))];
  const statusFilters = [
    { label: '📦 Hammasi', value: 'all' },
    { label: '⏳ Kutilmoqda', value: 'pending' },
    { label: '🚚 Qabul qilindi', value: 'accepted' },
    { label: '📤 Yo‘lda', value: 'picked_up' },
    { label: '✅ Tugagan', value: 'completed' }
  ];

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter || order.product_name === filter;
  });

  return (
    <div className="p-4 space-y-4">
      <Navbar />

      {/* 🔘 Filtrlar */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {[...statusFilters, ...productNames.map(name => ({ label: name, value: name }))].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1 rounded-full border text-sm font-medium transition-all ${
              filter === value
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">⏳ Yuklanmoqda...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-400">Bu kategoriyada zakazlar yo‘q</p>
      ) : (
        filteredOrders.map(order => (
          <ZakazCard key={order.id} order={order} onAction={handleAction} />
        ))
      )}
    </div>
  );
}
