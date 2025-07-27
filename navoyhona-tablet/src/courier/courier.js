import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL || '';

export const fetchCourierOrders = async () =>
  axios.get(`${API_BASE}/scheduled-orders`).then(r => r.data);

export const takeOrder = async id =>
  axios.patch(`${API_BASE}/scheduled-orders/${id}/take`);

export const pickOrder = async id =>
  axios.patch(`${API_BASE}/scheduled-orders/${id}/picked`);

export const deliverOrder = async (id, paymentType) =>
  axios.patch(`${API_BASE}/scheduled-orders/${id}/delivered`, { paymentType });
