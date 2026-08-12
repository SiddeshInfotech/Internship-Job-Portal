import axios from 'axios';
import { getStudentToken, clearStudentAuth } from '../utils/authStorage';

// Separate token namespace from admin_token and client_token — students,
// companies, and admins are three distinct sessions that must never collide.
const baseURL = import.meta.env.VITE_API_URL || 'https://placify-backend-nvvw.onrender.com/api';

const studentAxios = axios.create({ baseURL });

studentAxios.interceptors.request.use((config) => {
  const token = getStudentToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

studentAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStudentAuth();
      if (window.location.pathname !== '/student/login') {
        window.location.href = '/student/login';
      }
    }
    return Promise.reject(error);
  }
);

export default studentAxios;
