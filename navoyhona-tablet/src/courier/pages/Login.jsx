// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        username,
        password,
      });
      // token va rolni saqlaymiz
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);  // misol: 'courier' yoki 'tablet'

      // rolga qarab yo‘naltirish
      if (data.role === 'courier') {
        navigate('/courier', { replace: true });
      } else {
        navigate('/zakazlar', { replace: true });
      }
    } catch {
      setError('Login yoki parol noto‘g‘ri');
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto mt-20">
      <h2 className="text-2xl mb-4">Tizimga kirish</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Login"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          placeholder="Parol"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Kirish
        </button>
      </form>
    </div>
  );
}
