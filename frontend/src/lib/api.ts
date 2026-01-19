import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
