import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Avatar, MessageStatus } from '../components/ui';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import './ChatMessage.css';

const ChatMessage = memo(({ message, isCurrentUser }) => {
  const { theme } = useTheme();
  
  const isOwnMessage = useMemo(() => 
    message.user._id === isCurrentUser._id,
    [message.user._id, isCurrentUser._id]
  );

  const formattedTime = useMemo(() => 
    format(new Date(message.timestamp), 'HH:mm'),
    [message.timestamp]
  );

  const messageClass = useMemo(() => 
    `message ${isOwnMessage ? 'outgoing' : 'incoming'}`,
    [isOwnMessage]
  );

  return (
    <div className={messageClass}>
      <div className="message-header">
        {!isOwnMessage && (
          <Avatar 
            src={message.user.profilePicture}
            name={message.user.name}
            size="sm"
          />
        )}
        <div className="message-meta">
          <span className="message-sender">
            {!isOwnMessage && message.user.name}
          </span>
          <time className="message-time">
            {formattedTime}
          </time>
        </div>
      </div>
      
      <div className="message-body">
        <p>{message.content}</p>
        {isOwnMessage && (
          <MessageStatus status={message.status} />
        )}
      </div>
    </div>
  );
});

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['sent', 'sending', 'failed']),
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      profilePicture: PropTypes.string
    }).isRequired
  }).isRequired,
  isCurrentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired
};

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
