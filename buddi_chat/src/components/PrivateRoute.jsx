import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import logger from '../utils/logger';
import Loader from './Loader';

const PrivateRoute = ({ user, loading, error, requiredRoles = [] }) => {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  useEffect(() => {
    if (!loading && !user && error) {
      logger.warn('Unauthorized access attempt', {
        path: currentPath,
        error: error.code
      });
    }
  }, [loading, user, error, currentPath]);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location,
          reason: error?.code || 'UNAUTHENTICATED'
        }} 
        replace 
      />
    );
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    logger.warn('Forbidden access attempt', {
      path: currentPath,
      userRole: user.role,
      requiredRoles
    });
    return <Navigate to="/error" state={{ code: 403 }} replace />;
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  user: PropTypes.object,
  requiredRoles: PropTypes.arrayOf(PropTypes.oneOf([
    'user', 
    'moderator', 
    'admin'
  ]))
};

export default PrivateRoute;
