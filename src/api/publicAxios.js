import axios from 'axios';

// For genuinely public endpoints (Public Jobs API etc.) — no token attached,
// no 401 interceptor, since these calls work identically whether or not
// anyone is logged in as anything.
const baseURL = import.meta.env.VITE_API_URL || 'https://placify-backend-nvvw.onrender.com/api';

const publicAxios = axios.create({ baseURL });

export default publicAxios;
