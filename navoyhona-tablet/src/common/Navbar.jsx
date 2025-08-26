import LogoutButton from './LogoutButton';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Navbar() {
  const [tokenExists, setTokenExists] = useState(!!localStorage.getItem('token'));
  const location = useLocation();

  // Admin yo'llarida global Navbar ko'rinmasin (AdminLayout o'zi bor)
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const onStorage = () => setTokenExists(!!localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    // interval o‘rniga storage event yetadi; polling shart emas
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!tokenExists) return null;

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold text-blue-700">📦 Zakazlar</h1>
      <LogoutButton />
    </nav>
  );
}

export default Navbar;
