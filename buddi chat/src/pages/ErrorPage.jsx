import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="error-page">
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/">Return to Home</Link>
    </div>
  );
};

export default ErrorPage;
