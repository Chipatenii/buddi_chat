import PropTypes from 'prop-types';

const Loader = ({ variant = 'primary', size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div 
      className={`loader ${fullScreen ? 'full-screen' : ''}`}
      role="status"
      aria-label="Loading"
    >
      <div className={`spinner spinner-${variant} ${sizeClasses[size]}`} />
    </div>
  );
};

Loader.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'light', 'dark']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullScreen: PropTypes.bool
};

export default Loader;