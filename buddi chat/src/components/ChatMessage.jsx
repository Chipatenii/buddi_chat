import PropTypes from 'prop-types';
import { Avatar, MessageStatus } from '../components/ui';
import { formatDateTime } from '../utils/date';
import { useTheme } from '../context/ThemeContext';
import './ChatMessage.css';

const ChatMessage = ({ message, isCurrentUser }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`message ${isCurrentUser ? 'outgoing' : 'incoming'}`}>
      <div className="message-header">
        {!isCurrentUser && (
          <Avatar 
            src={message.user.profilePicture}
            name={message.user.name}
            size="sm"
          />
        )}
        <div className="message-meta">
          <span className="message-sender">
            {!isCurrentUser && message.user.name}
          </span>
          <time className="message-time">
            {formatDateTime(message.timestamp, 'time')}
          </time>
        </div>
      </div>
      
      <div className="message-body">
        <p>{message.content}</p>
        {isCurrentUser && (
          <MessageStatus status={message.status} />
        )}
      </div>
    </div>
  );
};

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
  isCurrentUser: PropTypes.bool.isRequired
};

export default ChatMessage;