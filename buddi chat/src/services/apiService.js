import axios from 'axios';

// Set the base URL for the API from environment variables
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensures cookies are sent with requests
});

// Request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authtoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(error);
    }
    
    const { status } = error.response;
    switch (status) {
      case 401:
        console.error('Unauthorized! Redirecting to login...');
        localStorage.removeItem('authtoken'); // Remove expired/invalid token
        window.location.href = '/login';
        break;
      case 403:
        console.error('Access denied! Insufficient permissions.');
        break;
      case 404:
        console.error('Resource not found!');
        break;
      case 500:
        console.error('Server error! Please try again later.');
        break;
      default:
        console.error(`API Error (${status}):`, error.response.data || 'Unknown error');
    }

    return Promise.reject(error);
  }
);

// Fetch logged-in user
export const fetchLoggedInUser = async () => {
  try {
    const response = await api.get('/loggedInUser');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch logged-in user:', error);
    throw error;
  }
};

export default api;