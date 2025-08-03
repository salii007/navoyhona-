// src/admin/components/BreadStockSection.jsx
import { useEffect, useState } from 'react';
import axios from '../../axiosConfig';

export default function BreadStockSection() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axios.get('/admin/stocks');
        setStocks(res.data);
      } catch (err) {
        console.error('Non zaxirasi olinmadi', err);
      }
    };

    fetchStocks();
  }, []);

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
