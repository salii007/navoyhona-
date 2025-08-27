// src/common/pages/CommonLogin.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig.js';
import Navbar from '../Navbar';

function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}

import { useLocation } from 'react-router-dom';

export default function CommonLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // 👈 joriy path

  useEffect(() => {
    const token =
      localStorage.getItem('tabletToken') ||
      localStorage.getItem('courierToken') ||
      localStorage.getItem('adminToken');
    const role = localStorage.getItem('role');

    // ✅ faqat login sahifasida turganda redirect
    if (location.pathname === '/login' || location.pathname === '/') {
      if (token && role === 'courier') {
        navigate('/courier/zakazlar', { replace: true });
      } else if (token && role === 'tablet') {
        navigate('/zakazlar', { replace: true });
      } else if (token && role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [navigate, location.pathname]);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { phone, password });
      const token = response.data.token;
      const role = getRoleFromToken(token);

      if (role === 'courier') {
        localStorage.setItem('courierToken', token);
        localStorage.setItem('role', 'courier'); 
        navigate('/courier/zakazlar');
      } else if (role === 'tablet') {
        localStorage.setItem('tabletToken', token);
        localStorage.setItem('role', 'tablet'); 
        navigate('/zakazlar');
      } else if (role === 'admin') {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('role', 'admin');
        navigate('/admin/dashboard');
      } else {
        alert('❌ Bu login sahifa faqat courier va tablet uchun!');
      }      
    } catch (err) {
      alert('❌ Telefon yoki parol noto‘g‘ri.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold text-center text-blue-700">📲 Kirish</h2>

          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{9,15}"
            autoComplete="tel"
            placeholder="Telefon raqam"
            className="border p-3 w-full rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Parol"
            className="border p-3 w-full rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded w-full">
            🔐 Kirish
          </button>
        </form>
      </div>
    </>
  );
}
