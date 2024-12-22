import React from 'react';

const ChatMessage = ({ user, message, timestamp }) => {
  return (
    <div className="chat-message">
      <strong>{user}:</strong> {message}
      <span className="timestamp"> {new Date(timestamp).toLocaleTimeString()}</span>
    </div>
  );
};

export default ChatMessage;
