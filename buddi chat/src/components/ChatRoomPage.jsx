import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatMessage from '../components/ChatMessage';
import { connectWebSocket, sendMessage, closeWebSocket } from '../services/webSocketService';

const ChatRoomPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    connectWebSocket((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      closeWebSocket();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage({ user: 'You', message: newMessage, timestamp: Date.now() });
      setNewMessage('');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container my-4">
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
      </main>
      <Footer />
    </div>
  );
};

export default ChatRoomPage;