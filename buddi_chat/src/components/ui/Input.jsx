import PropTypes from 'prop-types';

const Input = ({ 
  label,
  error,
  loading,
  className = '',
  ...props 
}) => {
  return (
    <div className={`input-group mb-3 ${className}`}>
      {label && <label className="form-label small text-muted mb-1">{label}</label>}
      <div className="position-relative">
        <input
          className={`form-control bg-dark border-secondary text-white rounded-xl py-2 px-3 ${error ? 'is-invalid' : ''}`}
          style={{ 
            backgroundColor: 'rgba(30, 41, 59, 0.5) !important',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
          disabled={loading}
          {...props}
        />
        {error && <div className="invalid-feedback small mt-1">{error}</div>}
      </div>
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default Input;
