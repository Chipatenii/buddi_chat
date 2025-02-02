import PropTypes from 'prop-types';
import { LOADER_SIZES } from '../constants';

const Loader = ({ variant = 'primary', size = 'md', fullScreen = false }) => {
  const sizeClass = LOADER_SIZES[size] || LOADER_SIZES.md;
  
  return (
    <div 
      className={`loader ${fullScreen ? 'full-screen' : ''}`}
      role="status"
      aria-label="Loading"
    >
      <div className={`spinner spinner-${variant} ${sizeClass}`}>
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    </div>
  );
};

Loader.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'light', 'dark']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullScreen: PropTypes.bool
};

export default Loader;