// src/pages/CreateZakaz.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig.js'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import AddressAutocomplete from '../../common/ui/AddressAutocomplete.jsx';
import '../../assets/createzakaz.css'; 

export default function CreateZakaz() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [zalogType, setZalogType] = useState('yoq');
  const [zalogAmount, setZalogAmount] = useState(0);

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);

  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    setScheduledDate(`${yyyy}-${mm}-${dd}`);

    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    setScheduledTime(`${hh}:${mi}`);

    axios.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('❌ Mahsulotlarni olishda xatolik:', err));
  }, []);

  const totalSum = unitPrice * quantity;
  const remaining = totalSum - (zalogType === 'bor' ? zalogAmount : 0);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!scheduledTime) {
      alert("Vaqt tanlanmagan!");
      return;
    }
  
    const token = localStorage.getItem('tabletToken');
    let location_id;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      location_id = payload.location_id;
    } catch {
      alert("❌ Token ichidan location_id olinmadi.");
      return;
    }
  
    try {
      await axios.post('api/scheduled-orders', {
        name,
        phone,
        address,
        product_name: productName,
        quantity,
        unit_price: unitPrice,
        location_id,
        date: scheduledDate,
        time: scheduledTime,
        zalog_type: zalogType,
        zalog_amount: zalogType === 'bor' ? zalogAmount : 0
      });
  
      navigate('/zakazlar');
    } catch (err) {
      console.error('❌ Zakaz yaratishda xatolik:', err);
      alert(`Xato: ${err.response?.data?.message || err.message}`);
    }
  };
  

  return (
    <div className="page-background">
      
      <div className="form-container">
        <h1 className="form-title">Yangi Zakaz Qo‘shish</h1>

        <form onSubmit={handleSubmit} className="form-box">
          <input type="text" placeholder="F.I.Sh" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
          <input type="text" placeholder="Telefon raqam" className="input-field" value={phone} onChange={e => setPhone(e.target.value)} required />

          <div>
            <label className="label">Manzil</label>
            <AddressAutocomplete value={address} onChange={setAddress} />
          </div>

          <select className="select-field" value={selectedProductId} onChange={e => {
            const productId = e.target.value;
            setSelectedProductId(productId);
            const selected = products.find(p => p.id == productId);
            setProductName(selected?.name || '');
            setUnitPrice(selected?.price || 0);
          }} required>
            <option value="">Mahsulot tanlang</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} — {p.price} so‘m</option>
            ))}
          </select>

          <input type="number" placeholder="Miqdor" className="input-field" value={quantity} onChange={e => setQuantity(+e.target.value)} min="1" required />
          <input type="date" className="input-field" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} required />

          <div>
            <label className="label">🕒 Yetkazish vaqti</label>
            <TimePicker className="w-full" onChange={setScheduledTime} value={scheduledTime} clearIcon={null} clockIcon={null} format="HH:mm" required />
          </div>

          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" value="yoq" checked={zalogType === 'yoq'} onChange={e => setZalogType(e.target.value)} /> Zalog yo‘q
            </label>
            <label className="radio-label">
              <input type="radio" value="bor" checked={zalogType === 'bor'} onChange={e => setZalogType(e.target.value)} /> Zalog bor
            </label>
          </div>

          {zalogType === 'bor' && (
            <input type="number" placeholder="Qancha zalog berildi?" className="input-field" value={zalogAmount} onChange={e => setZalogAmount(+e.target.value)} min="0" />
          )}

          <p className="summary">💸 Umumiy: {unitPrice} × {quantity} = {totalSum.toLocaleString()} so‘m</p>
          {zalogType === 'bor' && (
            <p className="summary-green">Zalog: {zalogAmount.toLocaleString()} so‘m<br />Qolgan: {remaining.toLocaleString()} so‘m</p>
          )}

          <button type="submit" className="submit-button">✅ Zakazni yuborish</button>
        </form>
      </div>
    </div>
  );
}
