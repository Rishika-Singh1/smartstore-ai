import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smartstore-backend-0ctf.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Token
api.interceptors.request.use((config) => {

  const token = localStorage.getItem('token');

  if (token) {

    config.headers.Authorization = `Bearer ${token}`;

  }

  return config;

});

// Auto Logout On 401
api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem('token');

      localStorage.removeItem('user');

      window.location.href = '/login';

    }

    return Promise.reject(error);

  }

);

export default api;