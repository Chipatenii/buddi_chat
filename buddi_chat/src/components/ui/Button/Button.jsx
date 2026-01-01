import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Button = ({ 
  variant = 'primary',
  size = 'md',
  children,
  loading,
  className = '',
  ...props 
}) => {
  const sizeStyle = {
    sm: 'px-3 py-1 text-sm rounded-lg',
    md: 'px-4 py-2 text-base rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-2xl'
  }[size];

  const variantClass = variant === 'primary' ? 'btn-premium' : `btn btn-${variant}`;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${variantClass} ${sizeStyle} ${loading ? 'opacity-70 cursor-wait' : ''} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          <span>Loading...</span>
        </div>
      ) : children}
    </motion.button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'warning', 'link']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Button;
