// src/admin/pages/Statistika.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig.js';
import '../styles/_statistika.scss';

export default function Statistika() {
  const navigate = useNavigate();

  const [period, setPeriod] = useState('day'); // day | week | month
  const [locationId, setLocationId] = useState('all');
  const [overview, setOverview] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errText, setErrText] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    if (!t) {
      navigate('/api/admin/login', { replace: true });
      return;
    }
    fetchLocations();
  }, [navigate]);

  // Lokatsiyalarni olish
  const fetchLocations = async () => {
    try {
      const res = await axios.get('/api/admin/locations');
      setLocations(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Locations fetch error:', e);
    }
  };

  // Statistikani olish
  const fetchOverview = async () => {
    setLoading(true);
    setErrText(null);
    try {
      const params = new URLSearchParams();
      params.set('period', period);
      if (locationId !== 'all') params.set('location_id', String(locationId));

      const res = await axios.get(`/api/admin/stats/overview?${params.toString()}`);

      // Ma’lumotlar tekshiruvi — agar backendda boshqa nomlar bo‘lsa ham ishlasin
      const data = res.data || {};
      setOverview({
        total_orders: data.total_orders ?? data.total ?? 0,
        delivered: data.delivered ?? data.delivered_count ?? 0,
        pending: data.pending ?? data.pending_count ?? 0,
        revenue: data.revenue ?? data.total_price ?? 0
      });
    } catch (e) {
      console.error('Stats fetch error:', e);
      setErrText(
        e?.response?.status === 401
          ? '401: Token yoki ruxsat xatosi. Admin sifatida qaytadan kiring.'
          : 'Statistikani olishda xatolik.'
      );
      setOverview(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [period, locationId]);

  return (
    <div className="admin-page statistika-page">
      <div className="page-head">
        <h1>📊 Statistika</h1>
        <div className="filters">
          <div className="segmented">
            <button
              className={period === 'day' ? 'active' : ''}
              onClick={() => setPeriod('day')}
            >
              Bugun
            </button>
            <button
              className={period === 'week' ? 'active' : ''}
              onClick={() => setPeriod('week')}
            >
              Hafta
            </button>
            <button
              className={period === 'month' ? 'active' : ''}
              onClick={() => setPeriod('month')}
            >
              Oy
            </button>
          </div>
          <select
            className="select"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          >
            <option value="all">Barcha lokatsiyalar</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
          <button onClick={fetchOverview} disabled={loading}>🔄 Yangilash</button>
        </div>
      </div>

      <div className="section">
        {loading && <div className="loading">Yuklanmoqda…</div>}
        {errText && <div className="error">{errText}</div>}

        {overview && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="label">Umumiy zakazlar</div>
              <div className="value">{overview.total_orders}</div>
            </div>
            <div className="stat-card">
              <div className="label">Yetkazilgan</div>
              <div className="value success">{overview.delivered}</div>
            </div>
            <div className="stat-card">
              <div className="label">Kutilayotgan</div>
              <div className="value warn">{overview.pending}</div>
            </div>
            <div className="stat-card">
              <div className="label">Tushum (so‘m)</div>
              <div className="value money">
                {Number(overview.revenue).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {!loading && !overview && !errText && (
          <div className="empty">Ma’lumot topilmadi</div>
        )}
      </div>
    </div>
  );
}
