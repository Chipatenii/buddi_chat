import PropTypes from 'prop-types';
import './ChatMessage.css';

const ChatMessage = ({ user, message, timestamp, isSent }) => {
  // Fallbacks for missing user or invalid data
  const userName = user?.name || 'Unknown User';
  const userId = user?.id || 'N/A';
  const displayTimestamp = timestamp ? new Date(timestamp).toLocaleTimeString() : 'Invalid Time';

  return (
    <div className={`chat-message ${isSent ? 'sent' : 'received'}`}>
      <div className="d-flex align-items-center mb-2">
        <div
          className="avatar bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2"
          style={{ width: '40px', height: '40px' }}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
        <strong>{userName} ({userId})</strong>
      </div>
      <p>{message}</p>
      <small className="text-muted">{displayTimestamp}</small>
    </div>
  );
};

ChatMessage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string, // For handling ISO string timestamps
  ]).isRequired,
  isSent: PropTypes.bool.isRequired,
};

export default ChatMessage;