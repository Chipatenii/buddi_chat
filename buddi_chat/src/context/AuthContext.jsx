import { createContext, useReducer, useEffect, useCallback } from 'react';
import { fetchLoggedInUser } from '../services/apiService';
import api from '../services/apiService';
import logger from '../utils/logger';
import { webSocketService } from '../services/webSocketService';

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return { ...state, loading: true };
    case 'SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload, user: null };
    case 'LOGOUT':
      return { ...state, user: null, error: null, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    loading: true,
    user: null,
    error: null
  });

  const checkAuth = useCallback(async (signal) => {
    try {
      const userData = await fetchLoggedInUser(signal);
      dispatch({ type: 'SUCCESS', payload: userData });
      webSocketService.connect();
    } catch (error) {
      const isCancel = error.name === 'AbortError' || error.name === 'CanceledError' || error.code === 'ERR_CANCELED';
      if (!isCancel) {
        dispatch({ type: 'ERROR', payload: error });
        // Don't log 401 as error in production-grade apps, it's a common state
        if (error.status !== 401) {
          logger.apiError(error);
        }
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    checkAuth(controller.signal);
    return () => controller.abort();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      logger.error('Logout failed:', err);
    } finally {
      webSocketService.disconnect();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = (userData) => {
    dispatch({ type: 'SUCCESS', payload: userData });
    webSocketService.connect();
  };

  return (
    <AuthContext.Provider value={{ ...state, logout, login, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
