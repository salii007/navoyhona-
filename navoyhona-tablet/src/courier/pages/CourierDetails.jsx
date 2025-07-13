// CourierDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ZakazCard from '../../tablet/components/ZakazCard.js';
import CourierActions from '../components/CourierActions';
export default function CourierDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/scheduled-orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(() => setError('Ma’lumot yuklanmadi'))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="p-4">
      <ZakazCard order={order} />
      <div className="mt-4">
        <CourierActions order={order} onActionComplete={() => window.location.reload()} />
      </div>
    </div>
  );
}