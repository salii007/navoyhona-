import axios from '../../axiosConfig.js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../common/Navbar'; // ✅ Navbar import qilingan
//token
// 🔓 JWT token ichidan rolni ajratib olish
function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}

function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 🔁 Token mavjud bo‘lsa → avtomatik yo‘naltiramiz
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'courier') {
      navigate('/courier/zakazlar', { replace: true });
    } else if (token && role === 'tablet') {
      navigate('/zakazlar', { replace: true });
    }
  }, [navigate]);

  // 🔐 Login funksiyasi
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login', { phone, password });
      const token = response.data.token;
      const role = getRoleFromToken(token);

      if (!role) {
        alert('❌ Roli aniqlanmadi');
        return;
      }

      // 🧠 Token va rolni saqlash
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // 🚀 Roli bo‘yicha yo‘naltirish
      if (role === 'courier') {
        navigate('/courier/zakazlar', { replace: true });
      } else if (role === 'tablet') {
        navigate('/zakazlar', { replace: true });
      } else {
        alert('❌ Nomaʼlum rol');
      }
    } catch (error) {
      console.error('Login xatosi:', error);
      alert('❌ Login muvaffaqiyatsiz! Telefon yoki parol noto‘g‘ri.');
    }
  };

  return (
    <>
      {/* Navbar login sahifasida ham bo‘lishi mumkin deb so‘rading */}
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm space-y-4"
        >
          <h2 className="text-xl font-bold text-center text-blue-700">📲 Kirish</h2>

          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{9,15}"
            title="Faqat raqam kiriting"
            autoComplete="tel"
            placeholder="Telefon raqam"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Parol"
            autoComplete="current-password"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold p-3 rounded w-full"
          >
            🔐 Kirish
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
