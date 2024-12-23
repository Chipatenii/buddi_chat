import { useState } from 'react';
import PropTypes from 'prop-types';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t border-gray-300">
      <input
        type="text"
        className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="bg-blue text-white py-2 px-4 rounded-md hover:bg-blue-600"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};
ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
};

export default ChatInput;
