import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from '../ui';
import { useTheme } from '../context/ThemeContext';

const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const { theme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form 
      className="chat-input-container"
      onSubmit={handleSubmit}
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.targetValue)}
        placeholder="Type your message..."
        disabled={disabled}
        aria-label="Chat message input"
      />
      <Button
        type="submit"
        variant="primary"
        disabled={!message.trim() || disabled}
        aria-label="Send message"
      >
        Send
      </Button>
    </form>
  );
};

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default ChatInput;