// src/common/LogoutButton.jsx
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const role = localStorage.getItem('role');

    // Tokenni roli bo‘yicha o‘chir
    if (role === 'courier') {
      localStorage.removeItem('courierToken');
    } else if (role === 'tablet') {
      localStorage.removeItem('tabletToken');
    } else if (role === 'admin') {
      localStorage.removeItem('token');
    }

    localStorage.removeItem('role'); // umumiy

    navigate('/login'); // universal login sahifasi
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      🔒 Chiqish
    </button>
  );
}

export default LogoutButton;
