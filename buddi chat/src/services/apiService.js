import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Backend base URL
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
