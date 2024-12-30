import { useState, useEffect } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { connectWebSocket, closeWebSocket, sendMessage } from '../services/webSocketService';

const ChatRoomPage = () => {
  const [messages, setMessages] = useState([]);
  const [chatRooms] = useState(['General', 'Random', 'Tech']);
  const [currentRoom, setCurrentRoom] = useState('General');

  useEffect(() => {
    connectWebSocket((newMessage) => setMessages((prev) => [...prev, newMessage]));

    return () => {
      closeWebSocket();
    };
  }, []);

  const handleSendMessage = (message) => {
    const newMessage = { user: 'You', message, timestamp: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    sendMessage(newMessage);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <header>
        <h1 className="text-center my-4">Chat Room</h1>
      </header>
      <div className="d-flex flex-grow-1">
        <ChatSidebar chatRooms={chatRooms} onRoomSelect={setCurrentRoom} />
        <main className="flex-grow-1 p-4">
          <h2 className="mb-4">{currentRoom} Room</h2>
          <div className="messages mb-4">
            {messages.map((msg, index) => (
              <ChatMessage key={index} user={msg.user} message={msg.message} timestamp={msg.timestamp} />
            ))}
          </div>
          <ChatInput onSend={handleSendMessage} />
        </main>
      </div>
    </div>
  );
};

export default ChatRoomPage;