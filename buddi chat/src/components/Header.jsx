import React from 'react';

const Header = () => {
  return (
    <header>
      <h1>Buddi Chat</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/chatroom">Chat Room</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
