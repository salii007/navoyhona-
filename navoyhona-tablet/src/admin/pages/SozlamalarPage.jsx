// src/admin/pages/Sozlamalar.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig.js';
import '../styles/_sozlamalar.scss';

const ROLE_OPTIONS = [
  { value: 'courier', label: 'Kuryer' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'navoy', label: 'Navoy (nonpaz)' },
  { value: 'zivalachi', label: 'Zivalachi' },
  { value: 'hamirchi', label: 'Hamirchi' },
  { value: 'admin', label: 'Admin' },
];

export default function Sozlamalar() {
  const navigate = useNavigate();

  // UI holatlar
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errText, setErrText] = useState(null);
  const [okText, setOkText] = useState(null);

  // Products
  const [products, setProducts] = useState([]);
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');

  // Locations
  const [locations, setLocations] = useState([]);
  const [lName, setLName] = useState('');
  const [lAddress, setLAddress] = useState('');

  // Users by role
  const [couriers, setCouriers] = useState([]);
  const [tablets, setTablets] = useState([]);
  const [navoys, setNavoys] = useState([]);
  const [zivalachis, setZivalachis] = useState([]);
  const [hamirchis, setHamirchis] = useState([]);
  const [admins, setAdmins] = useState([]);

  // create form
  const [uName, setUName] = useState('');
  const [uPhone, setUPhone] = useState('');
  const [uPass, setUPass] = useState('');
  const [uRole, setURole] = useState('courier');
  const [uLocation, setULocation] = useState('');

  // Inline tahrirlash
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserLoc, setEditingUserLoc] = useState('');

  const phoneMaskHint = useMemo(() => '+998901234567 ko‘rinishda', []);

  const toast = (ok, err = null) => {
    setOkText(ok || null);
    setErrText(err || null);
    setTimeout(() => {
      setOkText(null);
      setErrText(null);
    }, 3000);
  };

  const fetchByRole = async (role) => {
    const res = await axios.get('/api/admin/users', { params: { role } });
    return Array.isArray(res.data) ? res.data : [];
    // 401 bo‘lsa interceptor yo‘naltiradi yoki errText qo‘yiladi
  };

  const fetchAll = async () => {
    setLoading(true);
    setErrText(null);
    try {
      const [pr, lr, cr, tr, nr, zr, hr, ar] = await Promise.all([
        axios.get('/api/admin/products'),
        axios.get('/api/admin/locations'),
        fetchByRole('courier'),
        fetchByRole('tablet'),
        fetchByRole('navoy'),
        fetchByRole('zivalachi'),
        fetchByRole('hamirchi'),
        fetchByRole('admin'),
      ]);

      setProducts(Array.isArray(pr.data) ? pr.data : []);
      setLocations(Array.isArray(lr.data) ? lr.data : []);
      setCouriers(cr);
      setTablets(tr);
      setNavoys(nr);
      setZivalachis(zr);
      setHamirchis(hr);
      setAdmins(ar);
    } catch (e) {
      console.error('Sozlamalar fetch error:', e);
      const status = e?.response?.status;
      setErrText(
        status === 401
          ? '401: Ruxsat berilmagan. Admin sifatida qayta kiring.'
          : (e?.response?.data?.message || 'Sozlamalarni olishda xatolik.')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = localStorage.getItem('admintoken') || localStorage.getItem('token');
    if (!t) {
      navigate('/admin/login', { replace: true });
      return;
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ======================
  // PRODUCTS
  // ======================
  const addProduct = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const name = pName.trim();
    const priceNum = Number(pPrice);

    if (!name) return alert('Mahsulot nomini kiriting.');
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return alert('Narx ijobiy son bo‘lishi kerak.');
    }

    setSubmitting(true);
    setErrText(null);
    try {
      await axios.post('/api/admin/products', { name, price: priceNum, unit_price: priceNum });
      setPName('');
      setPPrice('');
      await fetchAll();
      toast('Mahsulot qo‘shildi ✅');
    } catch (e) {
      console.error('addProduct error:', e);
      const msg =
        e?.response?.status === 409
          ? 'Bu nomdagi mahsulot allaqachon mavjud.'
          : (e?.response?.data?.message || 'Mahsulot qo‘shishda xatolik.');
      setErrText(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const removeProduct = async (id) => {
    if (!confirm('Mahsulotni o‘chirishni tasdiqlaysizmi?')) return;
    if (submitting) return;

    setSubmitting(true);
    setErrText(null);
    try {
      await axios.delete(`/api/admin/products/${Number(id)}`);
      await fetchAll();
      toast('Mahsulot o‘chirildi 🗑️');
    } catch (e) {
      console.error('removeProduct error:', e);
      setErrText(e?.response?.data?.message || 'Mahsulotni o‘chirishda xatolik.');
    } finally {
      setSubmitting(false);
    }
  };

  // ======================
  // LOCATIONS
  // ======================
  const addLocation = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const name = lName.trim();
    const address = lAddress.trim();

    if (!name) return alert('Lokatsiya nomini kiriting.');

    setSubmitting(true);
    setErrText(null);
    try {
      await axios.post('/api/admin/locations', { name, address: address || null });
      setLName('');
      setLAddress('');
      await fetchAll();
      toast('Lokatsiya qo‘shildi ✅');
    } catch (e) {
      console.error('addLocation error:', e);
      const msg =
        e?.response?.status === 409
          ? 'Bu nomdagi lokatsiya mavjud.'
          : (e?.response?.data?.message || 'Lokatsiya qo‘shishda xatolik.');
      setErrText(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const removeLocation = async (id) => {
    if (!confirm('Lokatsiyani o‘chirishni tasdiqlaysizmi?')) return;
    if (submitting) return;

    setSubmitting(true);
    setErrText(null);
    try {
      await axios.delete(`/api/admin/locations/${Number(id)}`);
      await fetchAll();
      toast('Lokatsiya o‘chirildi 🗑️');
    } catch (e) {
      console.error('removeLocation error:', e);
      setErrText(e?.response?.data?.message || 'Lokatsiyani o‘chirishda xatolik.');
    } finally {
      setSubmitting(false);
    }
  };

  // ======================
  // USERS
  // ======================
  const addUser = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const name = uName.trim();
    const phone = uPhone.replace(/\s+/g, '');
    const password = uPass;
    const role = uRole;
    const location_id = uLocation ? Number(uLocation) : null;

    if (!name || !phone || !password) {
      return alert('Ism, telefon va parol kiritilishi shart.');
    }
    if (!/^\+?\d{9,15}$/.test(phone)) {
      return alert('Telefon formati noto‘g‘ri. Masalan: +998901234567');
    }

    setSubmitting(true);
    setErrText(null);
    try {
      await axios.post('/api/admin/users', { name, phone, password, role, location_id });
      setUName('');
      setUPhone('');
      setUPass('');
      setURole('courier');
      setULocation('');
      await fetchAll();
      toast('Foydalanuvchi qo‘shildi ✅');
    } catch (e) {
      console.error('addUser error:', e);
      const msg =
        e?.response?.status === 409
          ? 'Bu telefon raqam bilan foydalanuvchi mavjud.'
          : (e?.response?.data?.message || 'Foydalanuvchi qo‘shishda xatolik.');
      setErrText(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const removeUser = async (id) => {
    if (!confirm('Foydalanuvchini o‘chirishni tasdiqlaysizmi?')) return;
    if (submitting) return;

    setSubmitting(true);
    setErrText(null);
    try {
      await axios.delete(`/api/admin/users/${Number(id)}`);
      await fetchAll();
      toast('Foydalanuvchi o‘chirildi 🗑️');
    } catch (e) {
      console.error('removeUser error:', e);
      setErrText(e?.response?.data?.message || 'Foydalanuvchini o‘chirishda xatolik.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditUserLoc = (user) => {
    setEditingUserId(user.id);
    setEditingUserLoc(user.location_id ? String(user.location_id) : '');
  };

  const saveUserLoc = async (userId) => {
    if (submitting) return;
    setSubmitting(true);
    setErrText(null);
    try {
      await axios.patch(`/api/admin/users/${Number(userId)}`, {
        location_id: editingUserLoc ? Number(editingUserLoc) : null,
      });
      setEditingUserId(null);
      setEditingUserLoc('');
      await fetchAll();
      toast('Foydalanuvchi lokatsiyasi yangilandi ✅');
    } catch (e) {
      console.error('patch user error:', e);
      setErrText(e?.response?.data?.message || 'Foydalanuvchini yangilashda xatolik.');
    } finally {
      setSubmitting(false);
    }
  };

  const locNameById = (id) => locations.find((l) => l.id === id)?.name || '—';

  // UI yordamchi: bir xil card
  const renderUserList = (title, list) => (
    <div>
      <h3>{title}</h3>
      <div className="list">
        {list.length === 0 && <div className="empty">Ro‘yxat bo‘sh</div>}
        {list.map((u) => (
          <div key={u.id} className="item">
            <div className="main">
              <div className="name">{u.name} <span className="role-tag">{u.role}</span></div>
              <div className="sub">
                {u.phone} • Lokatsiya: <b>{locNameById(u.location_id)}</b>
              </div>
            </div>
            <div className="actions">
              {editingUserId === u.id ? (
                <>
                  <select
                    value={editingUserLoc}
                    onChange={(e) => setEditingUserLoc(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="">— Lokatsiya yo‘q —</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => saveUserLoc(u.id)}
                    disabled={submitting}
                    className="save"
                  >
                    💾 Saqlash
                  </button>
                  <button
                    onClick={() => {
                      setEditingUserId(null);
                      setEditingUserLoc('');
                    }}
                    disabled={submitting}
                  >
                    ❌ Bekor
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => startEditUserLoc(u)} disabled={submitting}>
                    ✏️ Tahrirlash
                  </button>
                  <button
                    className="danger"
                    onClick={() => removeUser(u.id)}
                    disabled={submitting}
                  >
                    🗑 O‘chirish
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="admin-page sozlamalar-page">
      <div className="page-head">
        <h1>⚙️ Sozlamalar</h1>
        <div className="actions">
          <button onClick={fetchAll} disabled={loading || submitting}>
            🔄 Yangilash
          </button>
        </div>
      </div>

      {loading && <div className="loading">Yuklanmoqda…</div>}
      {errText && <div className="error">{errText}</div>}
      {okText && <div className="ok">{okText}</div>}

      {/* PRODUCTS */}
      <div className="section">
        <div className="section-head">
          <h2>Mahsulotlar</h2>
          <form onSubmit={addProduct} className="inline-form">
            <input
              type="text"
              placeholder="Mahsulot nomi (masalan: Patir)"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              disabled={submitting}
            />
            <input
              type="number"
              placeholder="Bir dona narxi"
              value={pPrice}
              onChange={(e) => setPPrice(e.target.value)}
              disabled={submitting}
              min={0}
              step={100}
            />
            <button type="submit" disabled={submitting}>
              + Qo‘shish
            </button>
          </form>
        </div>

        <div className="list">
          {products.length === 0 && <div className="empty">Mahsulotlar yo‘q</div>}
          {products.map((p) => {
            const unit = Number(p.unit_price ?? p.price ?? 0);
            return (
              <div key={p.id} className="item">
                <div className="main">
                  <div className="name">{p.name}</div>
                  <div className="sub">{unit.toLocaleString('uz-UZ')} so‘m</div>
                </div>
                <div className="actions">
                  <button
                    className="danger"
                    onClick={() => removeProduct(p.id)}
                    disabled={submitting}
                  >
                    🗑 O‘chirish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LOCATIONS */}
      <div className="section">
        <div className="section-head">
          <h2>Navoyhonalar</h2>
          <form onSubmit={addLocation} className="inline-form">
            <input
              type="text"
              placeholder="Nom (masalan: Markaziy)"
              value={lName}
              onChange={(e) => setLName(e.target.value)}
              disabled={submitting}
            />
            <input
              type="text"
              placeholder="Manzil (ixtiyoriy)"
              value={lAddress}
              onChange={(e) => setLAddress(e.target.value)}
              disabled={submitting}
            />
            <button type="submit" disabled={submitting}>
              + Qo‘shish
            </button>
          </form>
        </div>

        <div className="list">
          {locations.length === 0 && <div className="empty">Lokatsiyalar yo‘q</div>}
          {locations.map((l) => (
            <div key={l.id} className="item">
              <div className="main">
                <div className="name">{l.name}</div>
                <div className="sub">{l.address || '—'}</div>
              </div>
              <div className="actions">
                <button
                  className="danger"
                  onClick={() => removeLocation(l.id)}
                  disabled={submitting}
                >
                  🗑 O‘chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* USERS */}
      <div className="section">
        <div className="section-head">
          <h2>Foydalanuvchilar</h2>
          <form onSubmit={addUser} className="inline-form">
            <input
              type="text"
              placeholder="Ism"
              value={uName}
              onChange={(e) => setUName(e.target.value)}
              disabled={submitting}
            />
            <input
              type="tel"
              placeholder={`Telefon (${phoneMaskHint})`}
              value={uPhone}
              onChange={(e) => setUPhone(e.target.value)}
              disabled={submitting}
            />
            <input
              type="password"
              placeholder="Parol"
              value={uPass}
              onChange={(e) => setUPass(e.target.value)}
              disabled={submitting}
            />
            <select
              value={uRole}
              onChange={(e) => setURole(e.target.value)}
              disabled={submitting}
            >
              {ROLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <select
              value={uLocation}
              onChange={(e) => setULocation(e.target.value)}
              disabled={submitting}
            >
              <option value="">Lokatsiya (ixtiyoriy)</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            <button type="submit" disabled={submitting}>
              + Qo‘shish
            </button>
          </form>
        </div>

        {/* 3 ustunli panellar: kuryer/tablet/admin va ishlab chiqarish rollari */}
        <div className="grid-roles">
          {renderUserList('Kuryerlar', couriers)}
          {renderUserList('Tablet foydalanuvchilari', tablets)}
          {renderUserList('Adminlar', admins)}
        </div>

        <div className="grid-roles">
          {renderUserList('Navoy (nonpaz)lar', navoys)}
          {renderUserList('Zivalachilar', zivalachis)}
          {renderUserList('Hamirchilar', hamirchis)}
        </div>
      </div>
    </div>
  );
}
