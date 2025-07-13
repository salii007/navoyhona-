import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ZakazCard from '../../tablet/components/ZakazCard.jsx';

function CourierOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/scheduled-orders/today')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Xatolik:', err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📦 Menga biriktirilgan bugungi zakazlar</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Hech qanday zakaz topilmadi.</p>
      ) : (
        orders.map(order => (
          <ZakazCard key={order.id} order={order} />
        ))
      )}
    </div>
  );
}

export default CourierOrders;
