import PropTypes from 'prop-types';
import { THEME } from '../../constants';

const Card = ({ children, header, footer, className = '' }) => {
  return (
    <div 
      className={`card ${className}`}
      style={{
        borderRadius: THEME.SPACING.MD,
        padding: THEME.SPACING.MD
      }}
    >
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
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