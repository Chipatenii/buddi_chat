import axios from 'axios';

// Hard-code the base URL
const baseURL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: baseURL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
});

export default api;