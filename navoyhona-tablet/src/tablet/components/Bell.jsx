// src/components/ui/Bell.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';           // Lo’yihangga mos qilib yo‘lni tekshir
import ZakazReminderModal from './ZakazReminderModal';

export default function Bell() {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchToday = () => {
      axios
        .get('/api/scheduled-orders/today')
        .then(res => setOrders(res.data))
        .catch(err => console.error("Bell fetch error:", err));
    };
    fetchToday();
    const iv = setInterval(fetchToday, 60_000);
    return () => clearInterval(iv);
  }, []);

  // 40 daqiqa ichida yetkaziladigan zakazlar
  const now = new Date();
  const filtered = orders.filter(o => {
    const dt = new Date(`${o.date}T${o.time}`);
    const diffMin = (dt - now) / 60000;
    return diffMin > 0 && diffMin <= 120;
  });

  return (
    <div>
      {filtered.length > 0 && (
        <div
          onClick={() => setModalOpen(true)}
          style={{ color: 'red', fontSize: 24, cursor: 'pointer' }}
          title={`${filtered.length} ta zakazga 40 daqiqa qoldi`}
        >
          🔔
        </div>
      )}
      {/* Modal faqat modalOpen bo‘lganda va zakazlar bo‘lsa chiqaramiz */}
      {modalOpen && (
        <ZakazReminderModal
          zakazlar={filtered}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

