// src/admin/components/AdminMenu.jsx
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './admin-menu.scss';

export default function AdminMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // 🔒 Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // agar refresh_token ishlatsangiz, uni ham o‘chiring:
    // localStorage.removeItem('refresh_token');
    navigate('/login', { replace: true });
    setOpen(false);
  };

  // 🧹 Tashqariga bosilganda va Esc bosilganda yopish
  useEffect(() => {
    if (!open) return;

    const onClickOutside = (e) => {
      if (
        !menuRef.current?.contains(e.target) &&
        !buttonRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  // 🔄 Yo‘l o‘zgarsa, panelni yopamiz
  useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // 🔗 Bir oynada navigatsiya qiluvchi handlerlar
  const goDashboard   = () => { navigate('/admin'); setOpen(false); };
  const goZakazlar    = () => { navigate('/admin/zakazlar'); setOpen(false); };
  const goStatistika  = () => { navigate('/admin/statistika'); setOpen(false); };
  const goSozlamalar  = () => { navigate('/admin/sozlamalar'); setOpen(false); };

  return (
    <div className="admin-menu">
      {/* Menyu tugmasi */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="admin-menu__btn"
        title="Menu"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="admin-menu-panel"
      >
        {/* vertical kebab */}
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {/* Ochiladigan panel */}
      {open && (
        <div
          id="admin-menu-panel"
          ref={menuRef}
          role="menu"
          aria-label="Admin menu"
          className="admin-menu__panel"
          tabIndex={-1}
        >
          <div className="admin-menu__group">

            {/* 🏠 Dashboard */}
            <button
              type="button"
              onClick={goDashboard}
              className="admin-menu__item"
              role="menuitem"
            >
              <span className="emoji">🏠</span>
              <span>Dashboard</span>
            </button>

            {/* 📦 Barcha Zakazlar */}
            <button
              type="button"
              onClick={goZakazlar}
              className="admin-menu__item"
              role="menuitem"
            >
              <span className="emoji">📦</span>
              <span>Barcha Zakazlar</span>
            </button>

            {/* 📊 Statistika */}
            <button
              type="button"
              onClick={goStatistika}
              className="admin-menu__item"
              role="menuitem"
            >
              <span className="emoji">📊</span>
              <span>Statistika</span>
            </button>

            {/* ⚙️ Sozlamalar */}
            <button
              type="button"
              onClick={goSozlamalar}
              className="admin-menu__item"
              role="menuitem"
            >
              <span className="emoji">⚙️</span>
              <span>Sozlamalar</span>
            </button>

            <div className="admin-menu__divider" />

            {/* 🔓 Chiqish */}
            <button
              type="button"
              onClick={handleLogout}
              role="menuitem"
              className="admin-menu__item admin-menu__item--danger"
            >
              <span className="emoji">🔓</span>
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
