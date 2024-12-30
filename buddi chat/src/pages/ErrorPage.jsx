import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <p className="text-muted">Page Not Found</p>
      <Link to="/" className="btn btn-primary mt-4">
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;