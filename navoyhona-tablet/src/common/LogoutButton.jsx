import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const role = localStorage.getItem('role');

    if (role === 'admin') {
      localStorage.removeItem('adminToken'); // ✅ admin tokeni
    } else {
      localStorage.removeItem('token'); // ✅ tablet yoki courier tokeni
    }

    localStorage.removeItem('role'); // 🎯 rolni ham tozalaymiz

    navigate('/login', { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
    >
      🔒 Chiqish
    </button>
  );
}

export default LogoutButton;
