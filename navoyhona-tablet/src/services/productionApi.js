import axios from '../axiosConfig.js';

const BASE = '/production'; // serverda ham shu yo'l ulangan

export async function fetchProducedToday(locationId) {
  const res = await axios.get(`${BASE}/today`, { params: { location_id: locationId } });
  return res.data?.produced_today ?? 0;
}

export async function adjustProduction({ locationId, delta, reason = 'manual_adjust' }) {
  const res = await axios.post(`${BASE}/adjust`, { location_id: locationId, delta, reason });
  return res.data; // { ok, new_total_today }
}
