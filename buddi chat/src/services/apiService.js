import axios from 'axios';

// Base URL configuration
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL,
  timeout: 10000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json', // Default content type
  },
});

// Add request interceptor for token injection
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Add response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check for response existence (network error vs server error)
    if (error.response) {
      console.error(`API Response Error [${error.response.status}]:`, error.response.data);
      // You can handle specific status codes here
      switch (error.response.status) {
        case 401: // Unauthorized
          // Optionally log out the user or refresh the token
          console.error('Unauthorized! Redirecting to login...');
          break;
        case 403: // Forbidden
          console.error('Access denied!');
          break;
        case 404: // Not Found
          console.error('Resource not found!');
          break;
        default:
          console.error('Unhandled error:', error.response.status);
      }
    } else if (error.request) {
      // No response received (network issue)
      console.error('No response received:', error.request);
    } else {
      // Error during request setup
      console.error('Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;