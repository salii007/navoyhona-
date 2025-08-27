// src/admin/layout/AdminLayout.jsx
import { Outlet, Link } from 'react-router-dom';
import AdminMenu from '../components/AdminMenu';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex flex-wrap justify-between items-center gap-3 px-4 py-3 bg-white shadow z-10">
        <h1 className="text-xl font-bold text-blue-700">🛠 Admin Panel</h1>
        <AdminMenu />
        <Link to="/admin/zakazlar" className="px-3 py-2 rounded-xl bg-green-600 text-white">
          ➕ Yangi Zakaz
        </Link>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
