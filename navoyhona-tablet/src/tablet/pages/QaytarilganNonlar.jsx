import { useEffect, useState } from 'react';
import axios from "../../axiosConfig.js";  // Token bilan ulanish bor
import { Button } from "../../common/ui/button"; // ✅
import { useNavigate } from 'react-router-dom'; // 👈 Yangi qo‘shildi

export default function QaytarilganNonlar() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 👈 Hook ni chaqirib oldik

  const fetchReturns = async () => {
    try {
      const res = await axios.get('/returns');
      setReturns(res.data);
    } catch (err) {
      console.error('Vazvratlarni olishda xatolik:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.patch(`/returns/${id}/accept`);
      setReturns(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Qabul qilishda xatolik:', err);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  if (loading) return <div className="text-center p-4">Yuklanmoqda...</div>;

  if (returns.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        Qaytarilgan non yo‘q.
        <div className="mt-4">
          <Button onClick={() => navigate('/zakazlar')}>🔙 Ortga</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🔁 Qaytarilgan nonlar</h2>
        <Button onClick={() => navigate('/zakazlar')}>🔙 Ortga</Button> {/* Orqaga qaytish */}
      </div>
      <div className="space-y-4">
        {returns.map(item => (
          <div key={item.id} className="bg-white p-4 shadow rounded-xl">
            <div className="font-semibold">{item.product_name} — {item.quantity} dona</div>
            <div className="text-sm text-gray-600">
              Tel: {item.client_phone} <br />
              Dastavkachi: {item.courier_name} <br />
              Sabab: {item.reason} <br />
              Sana: {new Date(item.returned_at).toLocaleString()}
            </div>
            <Button onClick={() => handleAccept(item.id)} className="mt-2">
              ✅ Qabul qilish
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
