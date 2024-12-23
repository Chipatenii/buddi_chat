import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout'; 

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Buddi Chat</h1>
      <nav className="flex items-center">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-gray-300">Home</Link>
          </li>
          <li>
            <Link to="/chatroom" className="hover:text-gray-300">Chat Room</Link>
          </li>
        </ul>
        {/* Add Logout button */}
        <Logout />
      </nav>
    </header>
  );
};

export default Header;
