// src/admin/pages/CreateZakaz.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from '../../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import '../../admin/assets/createzakaz.css';
import AddressAutocomplete from '../../common/ui/AddressAutocomplete.jsx';

/**
 * ADMIN uchun "Yangi Zakaz" sahifasi.
 * Farqlar:
 *  - Admin token ishlatiladi (adminToken).
 *  - location_id ni token ichidan emas, select orqali tanlaymiz (admin location tanlashi shart).
 *  - API endpointlar: /api/admin/... (axiosConfig bazadan /api bo‘lsa, bu yerda '/admin/...').
 *  - Mahsulot narxi sifatida unit_price ishlatiladi (p.price emas, p.unit_price!).
 */
export default function CreateZakazAdmin() {
  const navigate = useNavigate();

  // Mijoz ma’lumotlari
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Zakaz parametrlari
  const [quantity, setQuantity] = useState(1);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Zalog
  const [zalogType, setZalogType] = useState('yoq'); // 'yoq' | 'bor'
  const [zalogAmount, setZalogAmount] = useState(0);

  // Tanlovlar
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);

  // (ixtiyoriy) location bo‘yicha kuryer tanlash uchun
  const [couriers, setCouriers] = useState([]);
  const [selectedCourierId, setSelectedCourierId] = useState('');

  // Sana/vaqtni hozirgi vaqtdan to‘ldiramiz, ma’lumotlarni yuklaymiz
  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    setScheduledDate(`${yyyy}-${mm}-${dd}`);

    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    setScheduledTime(`${hh}:${mi}`);

    // Admin token borligini tekshiramiz
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      alert('❌ Admin token topilmadi. Iltimos, admin sifatida tizimga kiring.');
      navigate('/login', { replace: true });
      return;
    }

    // Mahsulotlar va lokatsiyalarni yuklaymiz
    (async () => {
      try {
        // Bazaviy faraz: axiosConfig da baseURL = '/api'
        const [prodRes, locRes] = await Promise.all([
          axios.get('admin/products'),
          axios.get('admin/locations'),
        ]);
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
        setLocations(Array.isArray(locRes.data) ? locRes.data : []);
      } catch (err) {
        console.error('❌ Ma’lumot yuklashda xatolik:', err);
        alert(`Xatolik: ${err.response?.data?.message || err.message}`);
      }
    })();
  }, [navigate]);

  // Location tanlanganda shu lokatsiyaga tegishli kuryerlar (ixtiyoriy)
  useEffect(() => {
    if (!selectedLocationId) {
      setCouriers([]);
      setSelectedCourierId('');
      return;
    }
    (async () => {
      try {
        // Agar sizda kuryer ro‘yxatini lokatsiya bo‘yicha beradigan endpoint bo‘lsa:
        // Masalan: GET /api/admin/couriers?location_id=...
        const res = await axios.get('admin/couriers', {
          params: { location_id: selectedLocationId }
        });
        setCouriers(Array.isArray(res.data) ? res.data : []);
      } catch {
        // Agar hali endpoint tayyor bo‘lmasa — jim o‘tamiz
        setCouriers([]);
      }
    })();
  }, [selectedLocationId]);

  // Umumiy summa va qolganini hisoblash
  const totalSum = useMemo(() => (unitPrice || 0) * (quantity || 0), [unitPrice, quantity]);
  const remaining = useMemo(
    () => totalSum - (zalogType === 'bor' ? (zalogAmount || 0) : 0),
    [totalSum, zalogType, zalogAmount]
  );

  const onChangeProduct = (productId) => {
    setSelectedProductId(productId);
    const selected = products.find(p => String(p.id) === String(productId));
    setProductName(selected?.name || '');
    // MUHIM: unit_price dan oling!
    setUnitPrice(Number(selected?.unit_price) || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocationId) {
      alert('📍 Lokatsiyani tanlang!');
      return;
    }
    if (!selectedProductId) {
      alert('🍞 Mahsulotni tanlang!');
      return;
    }
    if (!scheduledTime) {
      alert('🕒 Vaqt tanlanmagan!');
      return;
    }
    if (quantity <= 0) {
      alert('Miqdor 1 dan kam bo‘lishi mumkin emas!');
      return;
    }
    if (zalogType === 'bor') {
      if (zalogAmount < 0) {
        alert('Zalog manfiy bo‘lishi mumkin emas!');
        return;
      }
      if (zalogAmount > totalSum) {
        alert('Zalog umumiy summadan katta bo‘lishi mumkin emas!');
        return;
      }
    }

    try {
      // Admin sifatida yaratamiz: /api/admin/scheduled-orders
      await axios.post('admin/scheduled-orders', {
        name,
        phone,
        address,
        product_id: Number(selectedProductId),
        product_name: productName,         // agar backendda ishlatilsa
        quantity: Number(quantity),
        unit_price: Number(unitPrice),
        location_id: Number(selectedLocationId),
        date: scheduledDate,               // 'YYYY-MM-DD'
        time: scheduledTime,               // 'HH:mm'
        zalog_type: zalogType,             // 'bor' | 'yoq'
        zalog_amount: zalogType === 'bor' ? Number(zalogAmount) : 0,
        // ixtiyoriy:
        courier_id: selectedCourierId ? Number(selectedCourierId) : null,
        created_by: 'admin'                // agar audit uchun kerak bo‘lsa
      });

      // Muvaffaqiyatdan so‘ng admin zakazlar sahifasiga qaytamiz
      navigate('/admin/zakazlar');
    } catch (err) {
      console.error('❌ Zakaz yaratishda xatolik:', err);
      alert(`Xato: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="page-background">
      <div className="form-container">
        <h1 className="form-title">Yangi Zakaz (Admin)</h1>

        <form onSubmit={handleSubmit} className="form-box">
          {/* Mijoz */}
          <input
            type="text"
            placeholder="F.I.Sh"
            className="input-field"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Telefon raqam"
            className="input-field"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />

          <div>
            <label className="label">Manzil</label>
            <AddressAutocomplete value={address} onChange={setAddress} />
          </div>

          {/* Location (shart) */}
          <select
            className="select-field"
            value={selectedLocationId}
            onChange={e => setSelectedLocationId(e.target.value)}
            required
          >
            <option value="">📍 Lokatsiyani tanlang</option>
            {locations.map(l => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          {/* Product (unit_price ishlatiladi) */}
          <select
            className="select-field"
            value={selectedProductId}
            onChange={e => onChangeProduct(e.target.value)}
            required
          >
            <option value="">🍞 Mahsulot tanlang</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} — {Number(p.unit_price || 0).toLocaleString()} so‘m
              </option>
            ))}
          </select>

          {/* Miqdor / Sana / Vaqt */}
          <input
            type="number"
            placeholder="Miqdor"
            className="input-field"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            min="1"
            required
          />

          <input
            type="date"
            className="input-field"
            value={scheduledDate}
            onChange={e => setScheduledDate(e.target.value)}
            required
          />

          <div>
            <label className="label">🕒 Yetkazish vaqti</label>
            <TimePicker
              className="w-full"
              onChange={setScheduledTime}
              value={scheduledTime}
              clearIcon={null}
              clockIcon={null}
              format="HH:mm"
              required
            />
          </div>

          {/* Kuryer (ixtiyoriy) */}
          {couriers.length > 0 && (
            <select
              className="select-field"
              value={selectedCourierId}
              onChange={e => setSelectedCourierId(e.target.value)}
            >
              <option value="">👷 Kuryer (ixtiyoriy)</option>
              {couriers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name || c.phone || `ID ${c.id}`}
                </option>
              ))}
            </select>
          )}

          {/* Zalog */}
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="yoq"
                checked={zalogType === 'yoq'}
                onChange={e => setZalogType(e.target.value)}
              /> Zalog yo‘q
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="bor"
                checked={zalogType === 'bor'}
                onChange={e => setZalogType(e.target.value)}
              /> Zalog bor
            </label>
          </div>

          {zalogType === 'bor' && (
            <input
              type="number"
              placeholder="Qancha zalog berildi?"
              className="input-field"
              value={zalogAmount}
              onChange={e => setZalogAmount(Number(e.target.value))}
              min="0"
            />
          )}

          {/* Hisob */}
          <p className="summary">
            💸 Umumiy: {unitPrice.toLocaleString()} × {quantity} = {totalSum.toLocaleString()} so‘m
          </p>
          {zalogType === 'bor' && (
            <p className="summary-green">
              Zalog: {zalogAmount.toLocaleString()} so‘m<br />
              Qolgan: {remaining.toLocaleString()} so‘m
            </p>
          )}

          <button type="submit" className="submit-button">✅ Zakazni yuborish</button>
        </form>
      </div>
    </div>
  );
}
