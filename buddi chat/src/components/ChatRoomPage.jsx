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
      <main>
        <h2>Chat Room</h2>
        <div className="chat-container">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              user={msg.user}
              message={msg.message}
              timestamp={msg.timestamp}
            />
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatRoomPage;
