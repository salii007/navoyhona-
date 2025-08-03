import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function CourierNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('courierToken'); // ✅ to‘g‘rilandi
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-xl font-semibold">Kuryer Panel</div>
        <div className="flex space-x-4">
          
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded hover:bg-blue-500"
          >
            Chiqish
          </button>
        </div>
      </div>
    </nav>
  );
}
