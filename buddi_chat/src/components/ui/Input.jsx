import PropTypes from 'prop-types';
import { THEME } from '../../constants';

const Input = ({ 
  label,
  error,
  loading,
  ...props 
}) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        className={`input-field ${error ? 'input-error' : ''}`}
        style={{
          borderColor: error ? THEME.COLORS.DANGER : THEME.COLORS.PRIMARY
        }}
        disabled={loading}
        {...props}
      />
      {error && <div className="input-error-message">{error}</div>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  loading: PropTypes.bool
};

export default Input;