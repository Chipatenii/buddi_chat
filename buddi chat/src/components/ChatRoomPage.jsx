import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatMessage from '../components/ChatMessage';
import ChatSidebar from '../components/ChatSidebar';
import api from '../services/apiService';
import { connectWebSocket, sendMessage, closeWebSocket } from '../services/webSocketService';

const ChatRoomPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]); // Initialize users state

  useEffect(() => {
    console.log('ChatRoomPage rendered'); // Debugging log

    const fetchMessages = async () => {
      try {
        const response = await api.get('/chat/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await api.get('/chat/users');
        setUsers(response.data); // Set users state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchMessages();
    fetchUsers(); // Fetch users when the component mounts

    // Connect to WebSocket and set up message handler
    connectWebSocket((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up WebSocket connection on component unmount
    return () => {
      closeWebSocket();
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        const response = await api.post('/chat/messages', { message: newMessage });
        setMessages([...messages, response.data]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container my-4 d-flex">
        <ChatSidebar users={users} /> {/* Pass users prop to ChatSidebar */}
        <div className="chat-content flex-grow-1 p-4">
          <h2 className="mb-4">Chat Room</h2>
          <div className="chat-container mb-4">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                user={msg.user}
                message={msg.message}
                timestamp={msg.timestamp}
              />
            ))}
          </div>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message"
            />
            <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatRoomPage;