import PropTypes from 'prop-types';
import { THEME } from '../../../constants';

const Button = ({ 
  variant = 'primary',
  size = 'md',
  children,
  loading,
  ...props 
}) => {
  const baseStyle = `btn btn-${variant} ${loading ? 'opacity-75 cursor-wait' : ''}`;
  const sizeStyle = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }[size];

  return (
    <button
      className={`${baseStyle} ${sizeStyle}`}
      style={{ backgroundColor: THEME.COLORS[variant.toUpperCase()] }}
      disabled={loading}
      {...props}
    >
      {loading ? <span className="animate-pulse">Loading...</span> : children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'warning']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default Button;