import PropTypes from 'prop-types';

const Card = ({ children, header, footer, className = '' }) => {
  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      {header && (
        <div className="px-4 py-3 border-bottom border-secondary" style={{ borderOpacity: 0.1 }}>
          {header}
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="px-4 py-3 border-top border-secondary" style={{ borderOpacity: 0.1 }}>
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  header: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Card;
