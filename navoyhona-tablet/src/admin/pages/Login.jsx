// src/admin/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';

// 🔓 Token ichidan rolni ajratib olish
function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}

export default function AdminLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const res = await axios.post('/auth/login', { phone, password });
      const token = res.data.token;
  
      const role = getRoleFromToken(token);
      if (role !== 'admin') {
        return setError('⛔ Bu sahifaga faqat admin kira oladi!');
      }else{
        localStorage.setItem('admintoken', token);
        localStorage.setItem('role', role);
    
        // ✅ To‘g‘ri sahifaga redirect qilamiz
        navigate('/admin/dashboard', { replace: true });
      }
  

    } catch (err) {
      setError('❌ Login xatosi: telefon yoki parol noto‘g‘ri');
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">
          🛠 Admin Panelga Kirish
        </h2>

        {error && (
          <div className="text-red-600 text-sm text-center font-semibold">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="📞 Telefon raqam"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />

        <input
          type="password"
          placeholder="🔑 Parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Kirish
        </button>
      </form>
    </div>
  );
}
