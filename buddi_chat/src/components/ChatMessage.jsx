import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const ChatMessage = memo(({ message, isSent, hideUser }) => {
  const formattedTime = format(new Date(message.timestamp), 'HH:mm');

  return (
    <motion.div
      initial={{ opacity: 0, x: isSent ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`d-flex flex-column ${isSent ? 'align-items-end' : 'align-items-start'} ${hideUser ? 'mt-1' : 'mt-4'}`}
    >
      {!isSent && !hideUser && (
        <div className="d-flex align-items-center gap-2 mb-2 px-1">
          <span className="fw-bold small text-primary">{message.user?.username || 'User'}</span>
          <span className="small text-secondary opacity-50" style={{ fontSize: '0.65rem' }}>{formattedTime}</span>
        </div>
      )}
      <div 
        className={`premium-chat-bubble ${isSent ? 'sent' : 'received'} shadow-sm position-relative`}
        style={{
          padding: '0.75rem 1.25rem',
          borderRadius: isSent 
            ? (hideUser ? '1rem 0.25rem 1rem 1rem' : '1rem 1rem 0.25rem 1rem') 
            : (hideUser ? '0.25rem 1rem 1rem 1rem' : '1rem 1rem 1rem 0.25rem'),
          maxWidth: '80%',
        }}
      >
        <p className="mb-0 small line-height-relaxed">{message.content}</p>
        <AnimatePresence>
            {isSent && !hideUser && (
                <span className="small position-absolute text-secondary opacity-30" style={{ fontSize: '0.6rem', bottom: '-1.2rem', right: '0.5rem' }}>
                    Sent at {formattedTime}
                </span>
            )}
        </AnimatePresence>
      </div>
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
