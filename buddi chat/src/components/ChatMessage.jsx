import PropTypes from 'prop-types';
import './ChatMessage.css';

const ChatMessage = ({ user, message, timestamp, isSent }) => {
  return (
    <div className={`chat-message ${isSent ? 'sent' : 'received'}`}>
      <div className="d-flex align-items-center mb-2">
        <div className="avatar bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2" style={{ width: '40px', height: '40px' }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <strong>{user.name}</strong>
      </div>
      <p>{message}</p>
      <small className="text-muted">{new Date(timestamp).toLocaleTimeString()}</small>
    </div>
  );
};

ChatMessage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.instanceOf(Date).isRequired,
  isSent: PropTypes.bool.isRequired,
};

export default ChatMessage;