// src/tablet/components/Navbar.jsx
import '../../assets/zakaz.css'; 
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton.jsx';
import BellNotification from './Bell.jsx';
import Clock from '../../common/ui/Clock.jsx';

// 👤 Tokenni ichidan foydalanuvchini olish
function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload; // { name, role }
  } catch {
    return null;
  }
}

function Navbar() {
  const user = getUserFromToken();

  return (
    <div className="navbar">
      {/* Chap taraf: logotip va vaqt */}
      <div className="navbar-left">
        <span>📋 Navoyhona Zakazlar</span>
        <Clock />
      </div>

      {/* O‘ng taraf: foydalanuvchi va tugmalar */}
      <div className="flex items-center gap-6">
        {/* 👤 Foydalanuvchi ma’lumoti */}
        {user && (
          <div className="text-sm text-gray-600">
            👤 {user.name} ({user.role})
          </div>
        )}

        <div className="navbar-right">
          <BellNotification />

          <Link to="/zakazlar" className="nav-link link-zakazlar">📦 Zakazlar</Link>
          <Link to="/qaytarilgan-nonlar" className="nav-link link-qaytarilganlar">🔁 Qaytarilganlar</Link>
          <Link to="/create-zakaz" className="nav-link link-yangi">➕ Yangi Zakaz</Link>

          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
