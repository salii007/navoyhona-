import { useEffect, useState } from 'react';
import { adjustProduction } from '../../services/productionApi.js';
import { getUserFromTokenSafe, getEffectiveLocationId } from '../../common/auth/getUser.js';

export default function ProduceModal({ open, onClose, onUpdated }) {
  const user = getUserFromTokenSafe();
  const role = user?.role ?? null;

  const [delta, setDelta] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const locationId = getEffectiveLocationId(user); // token yoki localStorage’dan

  useEffect(() => {
    if (open) {
      setDelta(0);
      setErr('');
      setTempLocation('');
    }
  }, [open]);

  if (!open) return null;

  const disabled = busy || !locationId;
  const presets = [1, 5, 10, 20, 50];

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');

    if (!locationId) {
      setErr('Joy (location) tanlanmagan. Avval joyni saqlang.');
      return;
    }
    if (!delta || Number(delta) === 0) {
      setErr('Qiymat 0 bo‘lishi mumkin emas.');
      return;
    }
    if (role !== 'tablet' && role !== 'admin') {
      setErr('Bu amal faqat tablet (yoki admin) uchun ruxsat etilgan.');
      return;
    }

    try {
      setBusy(true);
      const { ok, new_total_today, error } = await adjustProduction({
        locationId,
        delta: Number(delta),
        reason: Number(delta) > 0 ? 'manual_add' : 'manual_subtract',
      });
      if (!ok) {
        setErr(`Server xatosi: ${error || 'ok=false'}`);
      } else {
        onUpdated?.(new_total_today);
        onClose();
      }
    } catch (e2) {
      const msg = e2?.response?.data?.error || e2?.message || 'So‘rov bajarilmadi.';
      setErr(`Xatolik: ${msg}`);
      console.error(e2);
    } finally {
      setBusy(false);
    }
  }

  function saveLocalLocation() {
    const id = Number(tempLocation);
    if (!Number.isFinite(id) || id <= 0) {
      setErr('Joy ID noto‘g‘ri. Masalan: 1, 2, 3 …');
      return;
    }
    localStorage.setItem('tablet_location_id', String(id));
    setErr('Joy saqlandi. Endi tasdiqlash mumkin.');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-4 w-full max-w-sm shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">🍞 Ishlab chiqarish (qo‘lda)</h3>
          <button className="text-gray-600 hover:text-black" onClick={onClose}>✖</button>
        </div>

        <div className="mb-3 text-sm text-gray-600">
          Joy: <b>{locationId ?? '—'}</b> • Rol: <b>{role ?? '—'}</b>
          {!locationId && (
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                className="border rounded px-3 py-1 w-24"
                value={tempLocation}
                onChange={e => setTempLocation(e.target.value)}
                placeholder="Joy ID"
              />
              <button
                type="button"
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                onClick={saveLocalLocation}
              >
                Joyni saqlash
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {presets.map(p => (
            <button key={p} type="button"
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
              onClick={() => setDelta(prev => Number(prev) + p)}>
              +{p}
            </button>
          ))}
          {presets.map(p => (
            <button key={`m${p}`} type="button"
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
              onClick={() => setDelta(prev => Number(prev) - p)}>
              -{p}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Δ (qo‘shish/aytirish soni):</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={delta}
              onChange={e => setDelta(e.target.value)}
              placeholder="masalan: +20 yoki -5"
            />
          </div>

          {err ? <div className="text-red-600 text-sm">{err}</div> : null}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
              disabled={busy}
            >
              Bekor qilish
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              disabled={disabled}
            >
              {busy ? 'Saqlanmoqda…' : 'Tasdiqlash'}
            </button>
          </div>
        </form>

        <div className="mt-3 text-xs text-gray-500">
          Eslatma: Aytirish (minus) faqat xatoni to‘g‘rilash uchundir. Har bir amal loglanadi.
        </div>
      </div>
    </div>
  );
}
