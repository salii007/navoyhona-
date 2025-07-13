// src/pages/CourierDelivery.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';


function CourierDelivery() {
  const [couriers, setCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Do‘konlar ro‘yxati — agar kerak bo‘lsa dropdown qilish uchun
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');

  useEffect(() => {
    // 1) Kuryerlar ro‘yxatini olish
    axios.get('/couriers')
      .then(res => setCouriers(res.data))
      .catch(err => console.error('Kuryerlar olishda xato:', err));

    // 2) Magazinlar ro‘yxatini olish
    axios.get('/stores')
      .then(res => setStores(res.data))
      .catch(err => console.error('Do‘konlar olishda xato:', err));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios.post('/delivery-log', {
        courier_id: selectedCourier,
        store_id: selectedStore,
        quantity,
        // location_id ham avtomatik token’dan olinadi backendda
      });
      alert('Non kuryerga berildi!');
      setQuantity(1);
    } catch (err) {
      console.error('Xato:', err);
      alert('Xatolik: non berishda muammo yuz berdi.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Kuryerga Non Berish</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
          <div>
            <label className="block mb-1">Kuryer tanlang</label>
            <select
              value={selectedCourier}
              onChange={e => setSelectedCourier(e.target.value)}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">— Tanlang —</option>
              {couriers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Do‘kon (store) tanlang</label>
            <select
              value={selectedStore}
              onChange={e => setSelectedStore(e.target.value)}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">— Tanlang —</option>
              {stores.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.address}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Nechta dona non?</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(+e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded w-full"
          >
            Berish
          </button>
        </form>
      </div>
    </div>
  );
}

export default CourierDelivery;
