import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '../components/ui';
import { APP_ROUTES, SUPPORT_CONTACT } from '../constants';
import logger from '../utils/logger';
import ErrorIllustration from '../components/ErrorIllustration';

const ErrorPage = ({ error }) => {
  const location = useLocation();
  const stateError = location.state?.error;
  const currentError = error || stateError;
  const errorCode = currentError?.code || 404;

  useEffect(() => {
    logger.error('Error Page rendered', {
      path: location.pathname,
      error: currentError
    });
    
    // Focus management for accessibility
    document.getElementById('error-heading')?.focus();
  }, [currentError, location.pathname]);

  const handleErrorReport = async () => {
    try {
      await window.trackingService.reportError({
        code: errorCode,
        message: currentError?.message,
        stack: currentError?.stack,
        path: location.pathname
      });
      logger.info('Error reported successfully');
    } catch (reportError) {
      logger.error('Error reporting failed:', reportError);
    }
  };

  const getErrorMessage = (code) => ({
    401: 'Authorization Required',
    403: 'Access Forbidden',
    404: 'Page Not Found',
    500: 'Internal Server Error',
  }[code] || 'Something Went Wrong');

  return (
    <div className="error-page" role="alert" aria-live="polite">
      <ErrorIllustration code={errorCode} />

      <h1 id="error-heading" className="error-code" tabIndex="-1">
        {errorCode}
      </h1>
      
      <h2 className="error-message">
        {getErrorMessage(errorCode)}
      </h2>

      <div className="error-support">
        <p>Need help? Contact our support team:</p>
        <address>
          <a href={`mailto:${SUPPORT_CONTACT.email}`}>{SUPPORT_CONTACT.email}</a><br />
          <a href={`tel:${SUPPORT_CONTACT.phone}`}>{SUPPORT_CONTACT.phone}</a>
        </address>
      </div>

      <div className="error-actions">
        <Button
          as={Link}
          to={APP_ROUTES.HOME}
          variant="primary"
        >
          Return Home
        </Button>

        <Button
          variant="secondary"
          onClick={handleErrorReport}
          aria-label="Report this error"
        >
          Report Error
        </Button>

        {errorCode === 500 && (
          <Button 
            variant="text"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        )}
      </div>

      {/* Debug information */}
      {process.env.NODE_ENV === 'development' && (
        <details className="error-stack">
          <summary>Technical Details</summary>
          <pre>
            {currentError?.stack || 'No stack trace available'}
          </pre>
        </details>
      )}
    </div>
  );
};

ErrorPage.propTypes = {
  error: PropTypes.shape({
    code: PropTypes.number,
    message: PropTypes.string,
    details: PropTypes.string,
    stack: PropTypes.string
  })
};

ErrorPage.defaultProps = {
  error: null
};

export default ErrorPage;
