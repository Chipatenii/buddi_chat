import PropTypes from 'prop-types';

const ErrorIllustration = ({ code }) => {
  const illustrations = {
    401: '/illustrations/unauthorized.svg',
    403: '/illustrations/forbidden.svg',
    404: '/illustrations/not-found.svg',
    500: '/illustrations/server-error.svg',
    default: '/illustrations/error.svg'
  };

  return (
    <img
      src={illustrations[code] || illustrations.default}
      alt={`Error ${code} illustration`}
      className="error-illustration"
      aria-hidden="true"
    />
  );
};

ErrorIllustration.propTypes = {
  code: PropTypes.number
};

export default ErrorIllustration;