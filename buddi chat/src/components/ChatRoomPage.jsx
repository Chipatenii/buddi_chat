import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { connectWebSocket, closeWebSocket, sendMessage } from '../services/webSocketService';

const ChatRoomPage = () => {
  const [messages, setMessages] = useState([]);
  const [chatRooms] = useState(['General', 'Random', 'Tech']);
  const [currentRoom, setCurrentRoom] = useState('General');
  const [users, setUsers] = useState([
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
  ]);
  const loggedInUser = { id: '3', name: 'You' }; // Example logged-in user

  // Set up WebSocket connection and clean up on unmount
  useEffect(() => {
    connectWebSocket((newMessage) =>
      setMessages((prev) => [...prev, newMessage])
    );

    return () => closeWebSocket();
  }, []);

  // Handle sending a message
  const handleSendMessage = (message) => {
    const newMessage = { user: loggedInUser, message, timestamp: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    sendMessage(newMessage);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Page Header */}
      <header className="bg-primary text-white py-4 w-100">
        <h1 className="text-center m-0">Chat Room</h1>
      </header>

      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light w-100">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Buddi Chat</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <span className="nav-link">|</span>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>
              <li className="nav-item">
                <span className="nav-link">|</span>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/settings">Settings</Link>
              </li>
              <li className="nav-item">
                <span className="nav-link">|</span>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => alert('Logged out!')}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="d-flex flex-grow-1 w-100">
        {/* Sidebar */}
        <ChatSidebar users={users} />

        {/* Chat Room Area */}
        <main className="flex-grow-1 p-4 d-flex flex-column w-100">
          <h2 className="mb-4 text-primary">{currentRoom} Room</h2>

          {/* Message List */}
          <div className="messages mb-4 flex-grow-1 overflow-auto">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                user={msg.user}
                message={msg.message}
                timestamp={msg.timestamp}
                isSent={msg.user.id === loggedInUser.id}
              />
            ))}
          </div>

          {/* Input Field */}
          <ChatInput onSend={handleSendMessage} />
        </main>
      </div>
    </div>
  );
};

export default ChatRoomPage;