import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
});

instance.interceptors.request.use((config) => {
  const pathname = window.location.pathname;
  let token = null;

  if (pathname.startsWith('/admin')) {
    token = localStorage.getItem('admintoken');
  } else if (pathname.startsWith('/courier')) {
    token = localStorage.getItem('courierToken');
  } else {
    token = localStorage.getItem('tabletToken');
  }

  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }

  return config;
}, (error) => Promise.reject(error));

export default instance;
