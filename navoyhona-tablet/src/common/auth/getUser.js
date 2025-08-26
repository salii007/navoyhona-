// src/common/auth/getUser.js

function getStoredToken() {
    // 1) Eng ko‘p ishlatiladigani
    let t = localStorage.getItem('token');
  
    // 2) Loyihada boshqa kalitlar bo‘lsa — fallback
    if (!t) t = localStorage.getItem('tabletToken');
    if (!t) t = localStorage.getItem('courierToken');
    if (!t) t = localStorage.getItem('adminToken');
  
    // 3) Axios default header’dan olish (agar bor bo‘lsa)
    if (!t && window?.axios?.defaults?.headers?.common?.Authorization) {
      t = window.axios.defaults.headers.common.Authorization;
    }
  
    if (!t) return null;
    if (t.startsWith('Bearer ')) t = t.slice(7);
    if (!t.includes('.')) return null; // JWT emas
  
    return t;
  }
  
  export function getUserFromTokenSafe() {
    const t = getStoredToken();
    if (!t) return null;
    try {
      const payload = t.split('.')[1];
      const p = JSON.parse(atob(payload));
      if (p && p.location_id == null && p.locationId != null) {
        p.location_id = p.locationId; // camel/snake fallback
      }
      return p; // { id, role, location_id, ... }
    } catch {
      return null;
    }
  }
  
  /** Joyni samarali olish: token’da bo‘lmasa — lokal sozlama */
  export function getEffectiveLocationId(user) {
    const fromUser = user?.location_id;
    const fromLocal = Number(localStorage.getItem('tablet_location_id'));
    return fromUser ?? (Number.isFinite(fromLocal) ? fromLocal : null);
  }
  