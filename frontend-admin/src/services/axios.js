import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;
const backendUrl = import.meta.env.VITE_MODE === 'development' ? url : '/api';

console.log(backendUrl);

const axiosInstance = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // ❌ No cookies needed anymore
  // withCredentials: true
});

// ✅ Add interceptor to attach token from sessionStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('admintoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
