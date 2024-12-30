import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <header className="bg-primary text-white py-3 px-4 d-flex justify-content-between align-items-center">
      <h1 className="h4 mb-0">Buddi Chat</h1>
      <nav>
        <ul className="nav">
          <li className="nav-item">
            <Link to="/" className="nav-link text-white">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/chat-room" className="nav-link text-white">Chat Room</Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-link text-white">Profile</Link>
          </li>
          <li className="nav-item">
            <Link to="/settings" className="nav-link text-white">Settings</Link>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="btn btn-link nav-link text-white">Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;