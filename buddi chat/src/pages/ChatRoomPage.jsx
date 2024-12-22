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
    <div className="chat-room-page">
      <ChatSidebar chatRooms={chatRooms} onRoomSelect={setCurrentRoom} />
      <main>
        <h2>{currentRoom} Room</h2>
        <div className="messages">
          {messages.map((msg, index) => (
            <ChatMessage key={index} user={msg.user} message={msg.message} timestamp={msg.timestamp} />
          ))}
        </div>
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
};

export default ChatRoomPage;
