import { Outlet, Navigate } from 'react-router-dom';

function getUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}

export default function CourierLayout() {
  const role = getUserRole();

  // Faqat courier role kirishi mumkin
  if (role !== 'courier') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Outlet />
    </div>
  );
}
