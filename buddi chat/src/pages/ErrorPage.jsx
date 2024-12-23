import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="error-page">
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/">Return to Home</Link>
    </div>
  );
};

export default ErrorPage;
