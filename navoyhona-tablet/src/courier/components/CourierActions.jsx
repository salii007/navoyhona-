// ├── CourierActions.jsx
import React, { useState } from 'react';
import { takeOrder, pickOrder, deliverOrder } from '../../api/courier';
export default function CourierActions({ order, onActionComplete }) {
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState('naqd');
  const act = async (fn, ...args) => {
    setLoading(true);
    try { await fn(...args); onActionComplete(); }
    catch { alert('Xatolik yuz berdi'); }
    finally { setLoading(false); }
  };
  return (
    <div className="space-x-2">
      {order.status==='pending' && <button onClick={()=>act(takeOrder,order.id)} disabled={loading} className="btn">Olmoqchiman</button>}
      {order.status==='taken' && <button onClick={()=>act(pickOrder,order.id)} disabled={loading} className="btn">Nonni oldim</button>}
      {order.status==='picked' && (
        <>
          <select value={paymentType} onChange={e=>setPaymentType(e.target.value)} className="input">
            <option value="naqd">Naqd</option>
            <option value="karta">Karta</option>
          </select>
          <button onClick={()=>act(deliverOrder,order.id,paymentType)} disabled={loading} className="btn">Yetkazdim</button>
        </>
      )}
      {order.status==='delivered' && <span className="text-green-600">Yetkazildi</span>}
    </div>
  );
}
