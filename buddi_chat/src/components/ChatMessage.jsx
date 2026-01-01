import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const ChatMessage = memo(({ message, isSent }) => {
  const formattedTime = format(new Date(message.timestamp), 'HH:mm');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`d-flex flex-column ${isSent ? 'align-items-end' : 'align-items-start'} mb-3`}
    >
      {!isSent && (
        <span className="small text-muted mb-1 px-2" style={{ fontSize: '0.75rem' }}>
          {message.user?.username || 'User'}
        </span>
      )}
      <div className={`message-bubble ${isSent ? 'message-sent' : 'message-received'} shadow-sm`}>
        <p className="mb-0">{message.content}</p>
      </div>
      <span className="small text-muted mt-1 px-2" style={{ fontSize: '0.65rem' }}>
        {formattedTime}
      </span>
    </motion.div>
  );
});

ChatMessage.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    user: PropTypes.shape({
      username: PropTypes.string
    })
  }).isRequired,
  isSent: PropTypes.bool.isRequired
};

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
