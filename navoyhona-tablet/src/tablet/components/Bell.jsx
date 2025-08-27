import React, { useEffect, useMemo, useState } from 'react';
import axios from '../../axiosConfig';            // ⬅️ yangi nisbiy yo‘l (src/components/ui → src)
import ZakazReminderModal from './ZakazReminderModal';
import { getUserFromTokenSafe } from '../../common/auth/getUser.js';

export default function Bell() {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const fetchToday = async () => {
    try {
      setError(null);
      // ⬅️ baseURL '/api' bo‘lgani uchun bu yerda '/scheduled-orders/today'
      const res = await axios.get('/scheduled-orders/today');
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Bell fetch error:', err);
      setError(err?.response?.status === 401
        ? 'Avtorizatsiya xatosi (401). Token tekshiring.'
        : 'Ma’lumot olishda xatolik.');
      setOrders([]);
    }
  };

  useEffect(() => {
    const user = getUserFromTokenSafe();
    if (!user) return; // token yo'q – so'rov yubormaymiz
    fetchToday();
    const iv = setInterval(fetchToday, 60_000);
    return () => clearInterval(iv);
  }, []);

  // 40 daqiqagacha qolganlar
  const filtered = useMemo(() => {
    const now = new Date();
    return orders.filter(o => {
      if (!o?.date || !o?.time) return false;
      const dt = new Date(`${o.date}T${o.time}`);
      const diffMin = (dt - now) / 60000;
      return diffMin > 0 && diffMin <= 40;
    });
  }, [orders]);

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

      {error && (
        <div style={{ fontSize: 12, color: '#b91c1c', marginTop: 6 }}>
          {error}
        </div>
      )}

      {modalOpen && filtered.length > 0 && (
        <ZakazReminderModal
          zakazlar={filtered}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
