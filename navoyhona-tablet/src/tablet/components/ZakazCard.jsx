// src/components/ui/ZakazCard.jsx

import { useState } from 'react';
import axios from '../../axiosConfig.js';
import '../../assets/cardzakaz.css';

export default function ZakazCard({ order, isAdmin }) {
  const [open, setOpen] = useState(false);
  const [delivered, setDelivered] = useState(order.status === 'delivered');
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    id,
    name,
    phone,
    address,
    product_name,
    quantity,
    price = 0,
    zalog_type,
    zalog_amount = 0,
    date,
    time,
    created_at,
    lat,
    lng,
  } = order;

  // Format date/time
  const formattedDate = new Date(date).toLocaleDateString('uz-UZ', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const formattedTime = time?.slice(0, 5) || '00:00';

  // Calculations
  const total     = price * quantity;
  const remaining = total - zalog_amount;

  // Delivery time window (minutes)
  const diffMin = (() => {
    const [h, m] = time.split(':').map(Number);
    const target = new Date(date);
    target.setHours(h, m, 0);
    return (target - new Date()) / 1000 / 60;
  })();
  const canDeliver = diffMin <= 40;

  // Open Yandex Navigator
  const navigateTo = e => {
    e.stopPropagation();
    if (lat && lng) {
      window.open(`https://yandex.uz/maps/?rtext=~${lat},${lng}`, '_blank');
    } else {
      alert('Geolokatsiya mavjud emas!');
    }
  };

  // Confirm delivered
  const confirmDelivery = async () => {
    try {
      await axios.patch(`api/scheduled-orders/${id}/delivered`);
      setDelivered(true);
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      alert("❌ Xatolik: zakazni 'delivered' qilishda muammo bo‘ldi.");
    }
  };

  if (delivered) return null;

  return (
    <div className="zakaz-card" onClick={() => setOpen(o => !o)}>
      <div className="title">📛 {name}</div>
      <div className="meta">
        📅 Yetkazish: <strong>{formattedDate}</strong> 🕓 <strong>{formattedTime}</strong>
      </div>
      {isAdmin && created_at && (
        <div className="admin-time">
          🕓 Zakaz berilgan: {new Date(created_at).toLocaleString()}
        </div>
      )}

      {open && (
        <div className="details">
          <div>📞 {phone}</div>
          <div>📍 {address}</div>
          <div>🍞 {product_name || 'non'} — {quantity} ta</div>

          {/* Always show total and remaining */}
          <div className="highlight">
            💸 Umumiy: {total.toLocaleString()} so‘m
          </div>
          {zalog_type === 'bor' ? (
            <>
              <div className="highlight">
                💰 Zalog: {zalog_amount.toLocaleString()} so‘m
              </div>
              <div className="highlight red">
                💸 Qolgan: {remaining.toLocaleString()} so‘m
              </div>
            </>
          ) : (
            <div className="highlight green">
              💸 Qolgan (to‘liq to‘lov): {remaining.toLocaleString()} so‘m
            </div>
          )}

          <div className="action-buttons">
            <button onClick={navigateTo} className="btn-navigate">
              🧭 Navigator orqali borish
            </button>
            {canDeliver && (
              <button
                onClick={e => { e.stopPropagation(); setShowConfirm(true); }}
                className="btn-deliver"
              >
                ✅ Yetkazdim
              </button>
            )}
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="confirm-modal">
          <div className="confirm-modal-box">
            <p>Zakaz yetkazildimi?</p>
            <button className="yes" onClick={confirmDelivery}>Ha</button>
            <button className="no" onClick={() => setShowConfirm(false)}>Yo‘q</button>
          </div>
        </div>
      )}
    </div>
  );
}
