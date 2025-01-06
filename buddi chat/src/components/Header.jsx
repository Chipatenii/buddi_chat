import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Toggle the navigation menu on smaller screens
  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <header className="bg-primary text-white py-3 px-4">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo or Brand Name */}
        <h1 className="h4 mb-0">Buddi Chat</h1>

        {/* Navbar Toggler (Visible on small screens) */}
        <button
          className="navbar-toggler d-md-none"
          type="button"
          onClick={handleNavCollapse}
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <nav
          className={`collapse navbar-collapse ${isNavCollapsed ? '' : 'show'}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/chat-room" className="nav-link text-white">
                Chat Room
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link text-white">
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/settings" className="nav-link text-white">
                Settings
              </Link>
            </li>
            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="btn btn-link nav-link text-white"
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