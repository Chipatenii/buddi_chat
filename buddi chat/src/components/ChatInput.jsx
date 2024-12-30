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
    <div className="d-flex align-items-center gap-2 p-4 border-top border-secondary">
      <input
        type="text"
        className="form-control flex-grow-1"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="btn btn-primary"
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