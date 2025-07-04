// src/api/axios.js

import axios from 'axios';

const instance = axios.create({
  

   baseURL: `${import.meta.env.VITE_APP_API_URL}/api`, 
 
});

instance.interceptors.request.use(
  (config) => {

    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, '$1');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;