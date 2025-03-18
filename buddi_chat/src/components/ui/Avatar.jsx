import PropTypes from 'prop-types';
import { DEFAULT_AVATAR } from '../../constants';

const Avatar = ({ src, name, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
  };

  return (
    <div className={`avatar ${sizeClasses[size]}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="avatar-image"
          loading="lazy"
        />
      ) : (
        <div className="avatar-initials">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default Avatar;