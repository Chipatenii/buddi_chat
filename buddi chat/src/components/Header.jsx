import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <header className="bg-blue text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Buddi Chat</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/chat-room">Chat Room</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><button onClick={handleLogout} className="hover:text-orange">Logout</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
