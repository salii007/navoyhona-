import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem('courierToken');
    navigate('/login'); // yoki window.location.reload()
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
