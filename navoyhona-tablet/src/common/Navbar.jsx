import LogoutButton from './LogoutButton';
import { useEffect, useState } from 'react';

function Navbar() {
  const [tokenExists, setTokenExists] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      setTokenExists(!!token);
    }, 300); // har 300ms da tekshiradi

    return () => clearInterval(interval);
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
