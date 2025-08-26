// src/tablet/components/Navbar.jsx
import '../../assets/zakaz.css'; 
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton.jsx';
import BellNotification from './Bell.jsx';
import Clock from '../../common/ui/Clock.jsx';
import ProducedBadge from './ProducedBadge.jsx';
import { getUserFromTokenSafe } from '../../common/auth/getUser.js';


function Navbar() {
  const user = getUserFromTokenSafe();

  return (
    <div className="navbar">
      {/* Chap taraf: logotip va vaqt */}
      <div className="navbar-left flex items-center gap-4">
        <span>📋 Navoyhona Zakazlar</span>
        <Clock />
        {/* 🍞 Ishlab chiqarilgan nonlar — location_id bo‘yicha */}
        <ProducedBadge />
      </div>

      {/* O‘ng taraf: foydalanuvchi va tugmalar */}
      <div className="flex items-center gap-6">
        {user && (
          <div className="text-sm text-gray-600">
            👤 {user.name} ({user.role})
          </div>
        )}

        <div className="navbar-right flex gap-3">
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
