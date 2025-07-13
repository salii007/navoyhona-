// src/pages/Zakazlar.jsx
import { useEffect, useState } from 'react';
import axios from '../../axiosConfig.js';
import ZakazCard from '../components/ZakazCard.jsx';
import Navbar from '../components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import '../../assets/zakazlar.css';


function Zakazlar() {
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // 🔑 Tokenni localStorage dan oling
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
    .get('/api/scheduled-orders/today', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setOrders(res.data))
      .catch(err => console.error("❌ Bugungi zakazlarni olishda xatolik:", err));
  }, [token]); // <- dependency ga token qo‘shildi

  return (
<div className="page-gradient">


  <div className="max-w-4xl mx-auto p-4 space-y-4">
    <div className="flex justify-between items-center mb-6">
      <h2 className="zakaz-heading">📅 Bugungi Zakazlar</h2>
      <button
        onClick={() => navigate('/kelajak-zakazlar')}
        className="kelajak-button"
      >
        🌅 Kelajakdagilar
      </button>
    </div>

    {orders.length === 0 ? (
      <p className="no-orders">❗ Bugungi zakazlar topilmadi.</p>
    ) : (
      <div className="zakaz-grid">
        {orders.map(order => (
          <ZakazCard key={order.id} order={order} isAdmin={isAdmin} />
        ))}
      </div>
    )}
  </div>
</div>


  );
}

export default Zakazlar;
