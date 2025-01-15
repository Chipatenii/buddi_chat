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
    { id: '1', name: 'Alice', profilePicture: 'https://via.placeholder.com/120', bio: 'Loves tech' },
    { id: '2', name: 'Bob', profilePicture: 'https://via.placeholder.com/120', bio: 'Enjoys gaming' },
  ]);
  
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user from the database
    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/loggedInUser'); // Adjust the API endpoint as needed
        const user = await response.json();
        setLoggedInUser(user);
      } catch (error) {
        console.error('Failed to fetch logged-in user:', error);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    connectWebSocket((newMessage) =>
      setMessages((prev) => [...prev, newMessage])
    );

    return () => closeWebSocket();
  }, []);

  const handleSendMessage = (message) => {
    if (!loggedInUser) {
      console.error('Logged-in user not found');
      return; // Prevent sending if logged-in user is not available
    }

    const newMessage = { user: loggedInUser, message, timestamp: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    sendMessage(newMessage);
  };

  if (!loggedInUser) {
    return <p>Loading user data...</p>; // Show loading until user is fetched
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1 w-100">
        {/* Sidebar */}
        <ChatSidebar users={users} />

        {/* Chat Room Area */}
        <main className="flex-grow-1 p-5 d-flex flex-column w-100">
          <h2 className="mb-4 text-primary">{currentRoom} Room</h2>

          {/* Message List */}
          <div className="messages mb-5 flex-grow-1 overflow-auto">
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