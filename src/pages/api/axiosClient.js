import axios from 'axios';

const axiosClient = axios.create({
  // Hardcode this to '/api' for right now
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;