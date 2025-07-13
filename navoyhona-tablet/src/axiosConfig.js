// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // Vite proxy orqali ishlaydi
});

instance.interceptors.request.use((config) => {
  const pathname = window.location.pathname;
  let roleToken = null;

  if (pathname.startsWith('/courier')) {
    roleToken = localStorage.getItem('courierToken');
  } else {
    roleToken = localStorage.getItem('tabletToken');
  }

  if (roleToken) {
    config.headers.Authorization = 'Bearer ' + roleToken;
  }

  return config;
}, (error) => Promise.reject(error));


export default instance;
