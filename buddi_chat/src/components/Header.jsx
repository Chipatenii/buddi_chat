import { Link, useNavigate, useLocation } from 'react-router-dom';
// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComments, faUser, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../hooks/useAuth';
import logo from '../logo.svg';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const location = useLocation();

  // Handle user logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <header className="header-desktop hide-mobile">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Link to="/" className="d-flex align-items-center text-white text-decoration-none">
          <img src={logo} alt="Buddi Chat Logo" className="me-2" style={{ height: '40px' }} />
          <span className="fw-bold fs-4">Buddi</span>
        </Link>

        {/* Navigation Links */}
        <nav className="d-flex align-items-center">
          <ul className="navbar-nav d-flex flex-row align-items-center">
            {user ? (
              <>
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
                  <Link to={`/profile/${user.id}`} className="nav-link text-white mx-2">
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
                    className="btn btn-premium-sm ms-3"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              !isAuthPage && (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link text-white mx-3">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="btn btn-premium-sm">Sign Up</Link>
                  </li>
                </>
              )
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
