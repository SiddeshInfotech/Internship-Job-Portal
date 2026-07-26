import axios from 'axios';

// Separate from the Admin axiosClient — companies and admins have distinct
// tokens/sessions, so they must not share a storage key or redirect target.
const baseURL = import.meta.env.VITE_API_URL || 'https://placify-backend-nvvw.onrender.com/api';

const clientAxios = axios.create({ baseURL });

clientAxios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('client_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('client_token');
      sessionStorage.removeItem('client_info');
      if (window.location.pathname !== '/company/login') {
        window.location.href = '/company/login';
      }
    }
    return Promise.reject(error);
  }
);

export default clientAxios;
