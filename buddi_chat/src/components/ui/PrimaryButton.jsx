import { Loader } from 'lucide-react';

const PrimaryButton = ({ 
  children, 
  loading, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseClass = variant === 'primary' ? 'btn-premium' : 'btn-outline-premium';
  
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${baseClass} w-100 py-3 d-flex align-items-center justify-content-center gap-2 ${className}`}
    >
      {loading ? (
        <>
          <Loader size={18} className="animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default PrimaryButton;
