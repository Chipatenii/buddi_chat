import React from 'react';

const ChatMessage = ({ user, message, timestamp }) => {
    return (
        <div className="chat-message">
            <strong>{user}:</strong> <span>{message}</span>
            <small>{new Date(timestamp).toLocaleTimeString()}</small>
        </div>
    );
};

export default ChatMessage;
