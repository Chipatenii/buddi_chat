export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
    TIMEOUT: 15000,
    RETRIES: 3
  };
  
  export const THEME = {
    COLORS: {
      PRIMARY: '#2563eb',
      SECONDARY: '#4f46e5',
      DANGER: '#dc2626',
      SUCCESS: '#16a34a',
      WARNING: '#d97706'
    },
    SPACING: {
      SM: '0.5rem',
      MD: '1rem',
      LG: '2rem'
    }
  };

  export const SUPPORT_CONTACT = {
    email: 'support@buddi.chat',
    phone: '+260 (979) 08-2676'
  };

  export const APP_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    ERROR: '/error',
  };
  
  export const LOADER_SIZES = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  export const ERROR_MESSAGES = {
    DEFAULT: 'Something went wrong',
    401: 'Unauthorized access',
    403: 'Forbidden resource',
    404: 'Content not found',
    500: 'Internal server error'
  };
  
  export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    PROFILE: '/profile',
    SETTINGS: '/settings'
  };