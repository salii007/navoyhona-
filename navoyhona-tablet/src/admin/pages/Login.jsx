// src/admin/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';

// JWT ichidan role ajratish (faqat tekshiruv uchun)
function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      // Backend: POST /api/admin/login (yoki /api/auth/login) — senga mos endpoint
      const { data } = await axios.post('/admin/login', { phone, password });

      // Kutilayotgan javob: { token: '...' }
      const token = data?.token;
      if (!token) {
        setErr('Token topilmadi');
        setLoading(false);
        return;
      }

      // Tokenni admin kalitida saqlaymiz
      localStorage.setItem('adminToken', token);

      // Roli adminmi? (ixtiyoriy tekshiruv)
      const role = getRoleFromToken(token);
      if (role !== 'admin') {
        setErr('Admin emas (role mismatch)');
        setLoading(false);
        return;
      }

      // Admin panelga yuboramiz (Dashboard ochiladi)
      navigate('/admin', { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.error || 'Login xato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-xl font-bold">Admin Login</h1>

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <div>
          <label className="text-sm">Telefon</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+99890..."
          />
        </div>

        <div>
          <label className="text-sm">Parol</label>
          <input
            type="password"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Kutilmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  );
}
