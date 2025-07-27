import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Rolni ham tozalaymiz
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
