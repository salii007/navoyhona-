// src/admin/components/AdminMenu.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left z-50">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-200"
        title="Menu"
      >
        <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10a2 2 0 114 0 2 2 0 01-4 0zm7-2a2 2 0 100 4 2 2 0 000-4zM3 10a2 2 0 114 0 2 2 0 01-4 0z" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 space-y-1">
            <button onClick={() => handleNavigate('/admin/zakazlar')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">📦 Barcha Zakazlar</button>
            <button onClick={() => handleNavigate('/admin/statistika')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">📊 Statistika</button>
            <button onClick={() => handleNavigate('/admin/sozlamalar')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">⚙️ Sozlamalar</button>
            <button
              onClick={() => {
                localStorage.removeItem('admintoken');
                localStorage.removeItem('role');
                navigate('/admin/login');
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
            >
              🔓 Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
