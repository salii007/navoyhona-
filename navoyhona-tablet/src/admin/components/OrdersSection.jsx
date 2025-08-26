// 📁 OrdersSection.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 👈 useLocation qo‘shildi
import axios from '../../axiosConfig';
import ZakazModal from '../components/ZakazModal';
import '../styles/OrdersSection.css';

export default function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 hozirgi URLni olish

  // 🔍 Sana bugungi sanami?
  const isToday = (dateString) => {
    const today = new Date();
    const zakazDate = new Date(dateString);
    return (
      today.getFullYear() === zakazDate.getFullYear() &&
      today.getMonth() === zakazDate.getMonth() &&
      today.getDate() === zakazDate.getDate()
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get('admin/orders');

        // ✅ path bo‘yicha tanlab ko‘rsatamiz
        const allOrders = res.data;
        const filtered = location.pathname.includes('/zakazlar')
          ? allOrders // barcha zakazlar
          : allOrders.filter(order => isToday(order.date || order.created_at)); // faqat bugungi

        setOrders(filtered);
      } catch (err) {
        console.error('Zakazlar olinmadi', err);
      }
    };

    fetchOrders();
  }, [navigate, location]);

  return (
    <div className="ordersWrapper">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => setSelectedOrder(order)}
          className="orderCard"
        >
          <p className="orderName">{order.name}</p>
          <p className="orderPhone">{order.phone}</p>
        </div>
      ))}

      {selectedOrder && (
        <ZakazModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
