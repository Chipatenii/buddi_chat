import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faImage, faFile } from '@fortawesome/free-solid-svg-icons';
import { Button, Input } from '../ui';
import { useTheme } from '../context/ThemeContext';

const ChatInput = memo(({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!message.trim() || disabled || isUploading) return;
    
    onSend(message);
    setMessage('');
  }, [message, onSend, disabled, isUploading]);

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Handle file upload logic here
      const formData = new FormData();
      formData.append('file', file);
      // Upload file and get URL
      // onSend(message, fileUrl);
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  return (
    <form 
      className="chat-input-container"
      onSubmit={handleSubmit}
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.targetValue)}
        placeholder="Type your message..."
        disabled={disabled || isUploading}
        aria-label="Chat message input"
      />
      <div className="chat-input-actions">
        <label className="upload-button" title="Upload image">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={disabled || isUploading}
          />
          <FontAwesomeIcon icon={faImage} />
        </label>
        <label className="upload-button" title="Upload file">
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={disabled || isUploading}
          />
          <FontAwesomeIcon icon={faFile} />
        </label>
        <Button
          type="submit"
          variant="primary"
          disabled={!message.trim() || disabled || isUploading}
          aria-label="Send message"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </Button>
      </div>
    </form>
  );
});

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

ChatInput.defaultProps = {
  disabled: false
};

ChatInput.displayName = 'ChatInput';

export default ChatInput;
