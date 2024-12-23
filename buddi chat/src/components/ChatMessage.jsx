import PropTypes from 'prop-types';

const ChatMessage = ({ user, message, timestamp }) => {
  return (
    <div className="flex flex-col p-4 border-b border-gray-200">
      <span className="text-sm font-bold text-gray-600">{user}</span>
      <p className="text-gray-800">{message}</p>
      <span className="text-xs text-gray-500">{new Date(timestamp).toLocaleTimeString()}</span>
    </div>
  );
};

ChatMessage.propTypes = {
  user: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
};

export default ChatMessage;
