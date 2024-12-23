import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue text-white py-4 px-6">
      <h1 className="text-2xl font-bold">Buddi Chat</h1>
      <nav className="mt-2">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-orange">Home</Link>
          </li>
          <li>
            <Link to="/chat-room" className="hover:text-orange">Chat Room</Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-orange">Profile</Link>
          </li>
          <li>
            <Link to="/settings" className="hover:text-orange">Settings</Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-orange">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
