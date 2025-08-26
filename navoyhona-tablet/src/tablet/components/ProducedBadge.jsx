import { useEffect, useState } from 'react';
import { fetchProducedToday } from '../../services/productionApi.js';
import ProduceModal from './ProduceModal.jsx';
import { getUserFromTokenSafe, getEffectiveLocationId } from '../../common/auth/getUser.js';

export default function ProducedBadge() {
  const user = getUserFromTokenSafe();
  const locationId = getEffectiveLocationId(user);

  const [count, setCount] = useState(null);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState('');

  async function load() {
    setErr('');
    try {
      if (!locationId) { setCount(null); return; }
      const c = await fetchProducedToday(locationId);
      setCount(c);
    } catch (e) {
      setErr('Ma’lumot vaqtincha olinmadi');
      console.error(e);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [locationId]);

  return (
    <div className="flex items-center gap-2">
      <button
        className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
        onClick={() => setOpen(true)}
        title="Qo‘lda qo‘shish/aytirish"
      >
        🍞 Bugun: {count == null ? '—' : `${count} ta`}
      </button>
      {err ? <span className="text-xs text-red-600">{err}</span> : null}

      <ProduceModal
        open={open}
        onClose={() => setOpen(false)}
        onUpdated={(newTotal) => setCount(newTotal)}
      />
    </div>
  );
}
