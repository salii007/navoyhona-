import React, { useEffect, useState } from 'react';
import { fetchCourierOrders } from '../../api/courier';
import ZakazCard from '../../tablet/components/ZakazCard';
import CourierActions from '../components/CourierActions';

const STATUS_LIST = ['pending', 'taken', 'picked', 'delivered'];

export default function CourierDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchCourierOrders();
      setOrders(data);
    } catch (e) {
      setError('Zakazlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = orders.filter(o => o.status === filter);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Bugungi zakazlar</h1>
          <p className="text-sm text-gray-600">
            {filtered.length} ta “{filter}” statusdagi zakaz
          </p>
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Yangilash
        </button>
      </div>

      <div className="flex space-x-2 mb-4">
        {STATUS_LIST.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded ${filter === s ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div>Yuklanmoqda...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div>Hech qanday zakaz topilmadi.</div>
      )}

      <div className="space-y-4">
        {filtered.map(order => (
          <ZakazCard key={order.id} order={order}>
            <CourierActions order={order} onActionComplete={loadOrders} />
          </ZakazCard>
        ))}
      </div>
    </div>
  );
}
