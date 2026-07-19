import axios from 'axios';

// Base URL comes from .env (VITE_API_URL). Falls back to the live Render
// backend if the env var isn't set, so the app still works out of the box.
const baseURL = import.meta.env.VITE_API_URL || 'https://placify-backend-nvvw.onrender.com/api';

const axiosClient = axios.create({ baseURL });

// Attach the admin JWT to every outgoing request automatically
axiosClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is missing/expired/invalid, the backend replies 401 —
// clear the stored session and bounce back to the login page.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_info');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
