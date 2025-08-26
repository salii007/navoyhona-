import { Link, Outlet } from 'react-router-dom';
import AdminMenu from '../components/AdminMenu';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex flex-wrap justify-between items-center gap-3 px-4 py-3 bg-white shadow z-10">
        <h1 className="text-xl font-bold text-blue-700">🛠 Admin Panel</h1>
        <AdminMenu />
        {/* ESKISI: <Link to="/create-zakaz" ...> */}
        <Link to="/admin/create-zakaz" className="nav-link link-yangi">
          ➕ Yangi Zakaz
        </Link>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
