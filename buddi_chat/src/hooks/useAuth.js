import { useEffect, useReducer } from 'react';
import fetchLoggedInUser from '../services/apiService';
import logger from '../utils/logger';
import {webSocketService} from '../services/webSocketService';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return { ...state, loading: true };
    case 'SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      webSocketService.disconnect();
      return { ...state, user: null, error: null };
    default:
      return state;
  }
};

const useAuth = () => {
  const [state, dispatch] = useReducer(authReducer, {
    loading: true,
    user: null,
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();
    
    const checkAuth = async () => {
      try {
        const userData = await fetchLoggedInUser({ signal: controller.signal });
        dispatch({ type: 'SUCCESS', payload: userData });
        webSocketService.connect();
      } catch (error) {
        if (error.name !== 'AbortError') {
          dispatch({ type: 'ERROR', payload: error });
          logger.apiError(error);
        }
      }
    };

    checkAuth();
    return () => controller.abort();
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  return { ...state, logout };
};

export default useAuth;
