import { useState, useEffect } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { connectWebSocket, closeWebSocket, sendMessage } from '../services/webSocketService';

const ChatRoomPage = () => {
  const [messages, setMessages] = useState([]);
  const [chatRooms] = useState(['General', 'Random', 'Tech']);
  const [currentRoom, setCurrentRoom] = useState('General');

  // Set up WebSocket connection and clean up on unmount
  useEffect(() => {
    connectWebSocket((newMessage) =>
      setMessages((prev) => [...prev, newMessage])
    );

    return () => closeWebSocket();
  }, []);

  // Handle sending a message
  const handleSendMessage = (message) => {
    const newMessage = { user: 'You', message, timestamp: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    sendMessage(newMessage);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Page Header */}
      <header className="bg-primary text-white py-3">
        <h1 className="text-center m-0">Chat Room</h1>
      </header>

      {/* Main Content */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <ChatSidebar chatRooms={chatRooms} onRoomSelect={setCurrentRoom} />

        {/* Chat Room Area */}
        <main className="flex-grow-1 p-4 d-flex flex-column">
          <h2 className="mb-4 text-primary">{currentRoom} Room</h2>

          {/* Message List */}
          <div className="messages mb-4 flex-grow-1 overflow-auto">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                user={msg.user}
                message={msg.message}
                timestamp={msg.timestamp}
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
