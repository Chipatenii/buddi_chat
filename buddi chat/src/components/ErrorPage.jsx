import React from 'react';

const ErrorPage = () => {
  return (
    <div className="error-page">
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/">Go Back to Home</a>
    </div>
  );
};

export default ErrorPage;
