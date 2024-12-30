import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatMessage from './ChatMessage';
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
    sendMessage({ user: 'You', message: newMessage });
    setNewMessage('');
  };

  return (
    <div>
      <Header />
      <main className="container my-4">
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