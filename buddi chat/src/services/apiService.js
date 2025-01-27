import axios from 'axios';

// Set the base URL for the API from environment variables
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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

// Add a response interceptor to handle global error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401: // Unauthorized
          console.error('Unauthorized! Redirecting to login...');
          localStorage.removeItem('token'); // Remove invalid token
          window.location.href = '/login'; // Redirect to login page
          break;
        case 403: // Forbidden
          console.error('Access denied! Insufficient permissions.');
          break;
        case 404: // Not Found
          console.error('Resource not found!');
          break;
        default:
          console.error(`API Error (${status}):`, error.response.data || 'Unknown error');
      }
    } else {
      console.error('Network or request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Export the configured Axios instance
export default api;