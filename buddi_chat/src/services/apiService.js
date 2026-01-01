import axios from 'axios';

// Configuration
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_TIMEOUT = 15000; // 15 seconds

const getRequestId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
};

// Create Axios instance
const api = axios.create({
  baseURL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-Request-Id': getRequestId(), // For request tracing
  },
  withCredentials: true, // For cookies if using them
});

let csrfToken = null;

export const fetchCsrfToken = async () => {
  try {
    const response = await api.get('/csrf');
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};

// Request Interceptor
// Request Interceptor
api.interceptors.request.use(async config => {
  // Add CSRF token for mutating methods
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    if (!csrfToken) {
      await fetchCsrfToken();
    }
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }

  // Add request ID for error tracking
  config.headers['X-Request-Id'] = getRequestId();

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
  return response;
}, error => {
  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }

  // Structured error handling
  const errorResponse = {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    details: '',
    status: 500
  };

  if (error.response) {
    const { status, data } = error.response;
    errorResponse.status = status;
    errorResponse.code = data.code || `HTTP_${status}`;
    errorResponse.message = data.message || error.message;
    errorResponse.details = data.details;
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
    const response = await api.get('/auth/me', { signal });
    return response.data.user || response.data.data || response.data;
  } catch (error) {
    if (error.code !== 'HTTP_401') {
      console.error('Failed to fetch user:', error);
    }
    throw error;
  }
};

export const queryHandler = async (config) => {
  try {
    const response = await api(config);
    return response.data.data || response.data.user || response.data;
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
