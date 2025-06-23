import { Link, useNavigate } from 'react-router-dom';
// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComments, faUser, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

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
                <FontAwesomeIcon icon={faHome} title="Home" />
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/chat-room" className="nav-link text-white mx-2">
                <FontAwesomeIcon icon={faComments} title="Chat Room" />
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link text-white mx-2">
                <FontAwesomeIcon icon={faUser} title="Profile" />
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/settings" className="nav-link text-white mx-2">
                <FontAwesomeIcon icon={faCog} title="Settings" />
              </Link>
            </li>
            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="btn btn-link nav-link text-white mx-2"
              >
                <FontAwesomeIcon icon={faSignOutAlt} title="Logout" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
