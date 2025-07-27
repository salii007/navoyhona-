import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../axiosConfig.js';

function CourierLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 🔁 Token bor bo‘lsa → avtomatik zakazlar sahifasiga o‘tkazamiz
  useEffect(() => {
    const token = localStorage.getItem('courierToken');
    const role = localStorage.getItem('role');
    if (token && role === 'courier') {
      navigate('/courier/zakazlar', { replace: true });
    }
  }, [navigate]);

  // 🔐 Login funksiyasi
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', {
        phone,
        password,
      });

      const { token } = response.data;

      // 🎯 JWT token ichidan ma'lumotlarni ajratamiz
      const payload = JSON.parse(atob(token.split('.')[1]));
      const { role, courier_id, location_id } = payload;

      if (role !== 'courier') {
        alert("Bu login courier uchun emas!");
        return;
      }

      // 🗂️ Token va foydalanuvchini localStorage ga yozamiz
      localStorage.setItem('courierToken', token);
      localStorage.setItem('role', role);
      localStorage.setItem('courier_id', courier_id);
      localStorage.setItem('location_id', location_id);

      navigate('/courier/zakazlar');
    } catch (err) {
      console.error('❌ Login xatosi:', err);
      alert('Login yoki parol noto‘g‘ri!');
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl mb-4 font-bold">Kuryer Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefon raqami"
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parol"
          className="border p-2 w-full rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Kirish
        </button>
      </form>
    </div>
  );
}

export default CourierLogin;
