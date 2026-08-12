import axios from 'axios';
import { getClientToken, clearClientAuth } from '../utils/authStorage';

// Separate from the Admin axiosClient — companies and admins have distinct
// tokens/sessions, so they must not share a storage key or redirect target.
const baseURL = import.meta.env.VITE_API_URL || 'https://placify-backend-nvvw.onrender.com/api';

const clientAxios = axios.create({ baseURL });

clientAxios.interceptors.request.use((config) => {
  const token = getClientToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearClientAuth();
      if (window.location.pathname !== '/company/login') {
        window.location.href = '/company/login';
      }
    }
    return Promise.reject(error);
  }
);

export default clientAxios;
