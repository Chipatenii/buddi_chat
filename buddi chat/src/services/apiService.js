import axios from 'axios';
// Removed dotenv import and config as it's handled by dotenv-webpack

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000', // Use environment variable for base URL or fallback to localhost
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