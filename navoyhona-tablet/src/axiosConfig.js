// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
});

instance.interceptors.request.use(
  (config) => {
    const pathname = window.location.pathname;
    let token = null;

    if (pathname.startsWith('/admin')) {
      token = localStorage.getItem('adminToken');
    } else if (pathname.startsWith('/courier')) {
      token = localStorage.getItem('courierToken');
    } else {
      token = localStorage.getItem('tabletToken');
    }

    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ 401 bo'lsa, yo'l prefiksi bo'yicha to'g'ri loginga yuboramiz
instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        window.location.replace('/admin/login');
      } else if (path.startsWith('/courier')) {
        window.location.replace('/courier/login');
      } else {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
