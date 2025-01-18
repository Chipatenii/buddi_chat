import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('Unauthorized! Redirecting to login...');
                    break;
                case 403:
                    console.error('Access denied!');
                    break;
                case 404:
                    console.error('Resource not found!');
                    break;
                default:
                    console.error(`API Error: ${error.response.status}`);
            }
        } else {
            console.error('Network or request setup error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;