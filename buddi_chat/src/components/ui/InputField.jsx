import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({ 
  label, 
  icon, 
  error, 
  type = 'text', 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="input-group-modern">
      {label && <label>{label}</label>}
      <div className="position-relative">
        {icon && (
          <div className="position-absolute start-0 top-50 translate-middle-y ps-3 text-secondary opacity-50">
            {icon}
          </div>
        )}
        <input
          {...props}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={`input-modern ${icon ? 'ps-5' : ''} ${isPassword ? 'pe-5' : ''} ${error ? 'border-danger' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="position-absolute end-0 top-50 translate-middle-y pe-3 border-0 bg-transparent text-secondary hover-primary transition-smooth"
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <div className="small text-danger mt-1 px-1">{error}</div>}
    </div>
  );
};

export default InputField;
