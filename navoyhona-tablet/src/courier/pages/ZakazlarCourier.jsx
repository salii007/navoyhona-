// src/courier/pages/ZakazlarCourier.jsx
import { useEffect, useState } from 'react';
import axios from '../../axiosConfig.js';
import ZakazCard from '../components/ZakazCard';
import '../styles/ZakazlarCourier.scss';



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
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
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
      await axios.patch(`/courier/orders/${orderId}/${action}`,
        action === 'payment' ? { payment_type: value } : {});
      fetchOrders();
    } catch (err) {
      // Hatolikni logga yozmaslik kerak bo‘lsa bu qism bo‘sh qoladi
    }
  };

  // ✅ Faqat statuslar bo‘yicha filtr
  const statusFilters = [
    { label: '📦 Hammasi', value: 'all' },
    { label: '⏳ Kutilmoqda', value: 'pending' },
    { label: '🚚 Qabul qilindi', value: 'accepted' },
    { label: '📤 Yo‘lda', value: 'picked_up' },
    { label: '💵 To‘lash', value: 'tulash' }
  ];

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'tulash') return order.status === 'delivered';
    return order.status === filter;
  });

  return (
    <div className="zakazlar-page">
      {/* 🔘 Filtrlar */}
      <div className="filters">
        {statusFilters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={filter === value ? 'active' : ''}
          >
            {label}
          </button>
        ))}
      </div>
  
      {loading ? (
        <p className="status-message">⏳ Yuklanmoqda...</p>
      ) : error ? (
        <p className="status-message error-message">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p className="status-message">Bu kategoriyada zakazlar yo‘q</p>
      ) : (
        filteredOrders.map(order => (
          <div key={order.id} className="zakaz-card">
            <ZakazCard order={order} onAction={handleAction} />
          </div>
        ))
      )}
    </div>
  );  
}
