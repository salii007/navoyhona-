import axios from '../../axiosConfig.js';

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Kuryerga tegishli zakazlarni olish
 * @returns {Promise<Array>} zakazlar arrayi
 */
export const fetchCourierOrders = async () => {
  const response = await axios.get('api/scheduled-orders');
  return response.data;
};

/**
 * Zakazni olish (olmoqchiman) holatini yangilash
 * @param {number|string} id zakaz ID
 */
export const takeOrder = async (id) => {
  const response = await axios.patch(`${API_BASE}api/scheduled-orders/${id}/take`);
  return response.data;
};

/**
 * "Nonni oldim" holatini yangilash
 * @param {number|string} id zakaz ID
 */
export const pickOrder = async (id) => {
  const response = await axios.patch(`${API_BASE}api/scheduled-orders/${id}/picked`);
  return response.data;
};

/**
 * Yetkazildi deb belgilash
 * @param {number|string} id zakaz ID
 * @param {string} paymentType naqd yoki karta
 */
export const deliverOrder = async (id, paymentType) => {
  const response = await axios.patch(
    `${API_BASE}api/scheduled-orders/${id}/delivered`,
    { paymentType }
  );
  return response.data;
};
