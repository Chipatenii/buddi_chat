import PropTypes from 'prop-types';

const ChatMessage = ({ user, message, timestamp }) => {
  return (
    <div className="d-flex flex-column p-3 border-bottom border-secondary">
      <span className="small fw-bold text-secondary">{user}</span>
      <p className="text-dark mb-1">{message}</p>
      <span className="text-muted small">{new Date(timestamp).toLocaleTimeString()}</span>
    </div>
  );
};

ChatMessage.propTypes = {
  user: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
};

export default ChatMessage;