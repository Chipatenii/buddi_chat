import axios from 'axios';

// Configuration
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_TIMEOUT = 15000; // 15 seconds

// Create Axios instance
const api = axios.create({
  baseURL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-Request-Id': crypto.randomUUID(), // For request tracing
  },
  withCredentials: true, // For cookies if using them
});

// Request Interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add request ID for error tracking
  config.headers['X-Request-Id'] = crypto.randomUUID();
  
  return config;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject({
    code: 'REQUEST_FAILED',
    message: 'Failed to send request',
    details: error.message
  });
});

// Response Interceptor
api.interceptors.response.use(response => {
  // Transform successful responses
  return {
    ...response,
    data: {
      success: true,
      ...response.data
    }
  };
}, error => {
  // Structured error handling
  const errorResponse = {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    details: '',
    status: 500
  };

  if (error.response) {
    // Handle API error responses
    const { status, data } = error.response;
    errorResponse.status = status;
    errorResponse.code = data.code || `HTTP_${status}`;
    errorResponse.message = data.message || error.message;
    errorResponse.details = data.details;

    // Specific error handling
    if (status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login?session_expired=true';
    }
  } else if (error.request) {
    // Handle no response errors
    errorResponse.code = 'NETWORK_ERROR';
    errorResponse.message = 'Unable to connect to the server';
    errorResponse.details = error.message;
  } else {
    // Handle setup errors
    errorResponse.code = 'CLIENT_ERROR';
    errorResponse.message = 'Request configuration error';
    errorResponse.details = error.message;
  }

  console.error(`API Error [${errorResponse.code}]:`, errorResponse.message);
  return Promise.reject(errorResponse);
});

// API Methods
export const fetchLoggedInUser = async (signal) => {
  try {
    const response = await api.get('/me', { signal });
    return response.data.data;
  } catch (error) {
    if (error.code !== 'HTTP_401') { // Skip logging for unauthorized
      console.error('Failed to fetch user:', error);
    }
    throw error;
  }
};

export const queryHandler = async (config) => {
  try {
    const response = await api(config);
    return response.data.data;
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
};

// Helper for common operations
export const apiWrapper = {
  get: (url, config) => queryHandler({ ...config, method: 'get', url }),
  post: (url, data, config) => queryHandler({ ...config, method: 'post', url, data }),
  put: (url, data, config) => queryHandler({ ...config, method: 'put', url, data }),
  delete: (url, config) => queryHandler({ ...config, method: 'delete', url }),
};

// Export configured instance
export default api;