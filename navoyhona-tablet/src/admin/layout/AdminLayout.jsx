// src/admin/layout/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import AdminMenu from '../components/AdminMenu';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center px-4 py-3 bg-white shadow">
        <h1 className="text-xl font-bold text-blue-700">🛠 Admin Panel</h1>
        <AdminMenu />
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
