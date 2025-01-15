import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <header className="bg-primary text-white py-3 px-5">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Link to="/" className="d-flex align-items-center text-white text-decoration-none">
          <img src="src/logo.svg" alt="Buddi Chat Logo" className="me-2" style={{ height: '40px' }} />
        </Link>

        {/* Navigation Links */}
        <nav className="d-flex">
          <ul className="navbar-nav ms-auto d-flex flex-row align-items-center">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white mx-2">
                Home
              </Link>
            </li>
            <span className="text-white">|</span>
            <li className="nav-item">
              <Link to="/chat-room" className="nav-link text-white mx-2">
                Chat Room
              </Link>
            </li>
            <span className="text-white">|</span>
            <li className="nav-item">
              <Link to="/profile" className="nav-link text-white mx-2">
                Profile
              </Link>
            </li>
            <span className="text-white">|</span>
            <li className="nav-item">
              <Link to="/settings" className="nav-link text-white mx-2">
                Settings
              </Link>
            </li>
            <span className="text-white">|</span>
            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="btn btn-link nav-link text-white mx-2"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;