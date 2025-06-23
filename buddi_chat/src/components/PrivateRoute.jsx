import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import logger from '../utils/logger';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const location = useLocation();
  const { user, loading, error } = useAuth();
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
    return <div className="security-placeholder" />; // Use your <Loader> component instead
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

  // Add additional security checks here if needed
  // if (user.needsPasswordReset) {
  //   return <Navigate to="/reset-password" replace />;
  // }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.oneOf([
    'user', 
    'moderator', 
    'admin'
  ]))
};

export default PrivateRoute;
