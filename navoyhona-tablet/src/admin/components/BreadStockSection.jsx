// src/admin/components/BreadStockSection.jsx
import { useEffect, useState } from 'react';
import axios from '../../axiosConfig.js';

export default function BreadStockSection() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setErr('');
        setLoading(true);
        // baseURL: '/api' → yakuniy URL: /api/admin/stocks
        const res = await axios.get('admin/stocks');
        setStocks(res.data || []);
      } catch (e) {
        setErr(e?.response?.data?.error || e?.message || 'Ma’lumot olinmadi');
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  if (loading) return <div>Yuklanmoqda…</div>;
  if (err) return <div className="text-red-600">Xatolik: {err}</div>;

  return (
    <div className="space-y-2">
      {stocks.map((location) => (
        <div key={location.location_id} className="border p-2 rounded shadow">
          <h3 className="font-bold">📍 {location.name}</h3>
          <ul className="pl-4 list-disc text-sm">
            {location.products.map((product) => (
              <li key={product.product_name}>
                {product.product_name}: <strong>{product.quantity}</strong> dona
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
