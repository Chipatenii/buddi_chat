import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { THEME } from '../../constants';

const Modal = ({ 
  title,
  children,
  onClose,
  isOpen 
}) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'unset';
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div 
        className="modal-content"
        style={{
          backgroundColor: THEME.COLORS.LIGHT,
          padding: THEME.SPACING.MD
        }}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} aria-label="Close modal">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};

export default Modal;