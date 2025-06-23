import PropTypes from 'prop-types';
import { IconCheck, IconClock, IconAlert } from './Icons';

const MessageStatus = ({ status }) => {
  const statusConfig = {
    sent: {
      icon: <IconCheck />,
      color: 'var(--color-success)'
    },
    sending: {
      icon: <IconClock />,
      color: 'var(--color-warning)'
    },
    failed: {
      icon: <IconAlert />,
      color: 'var(--color-danger)'
    }
  };

  return (
    <span className="message-status" style={{ color: statusConfig[status]?.color }}>
      {statusConfig[status]?.icon}
    </span>
  );
};

MessageStatus.propTypes = {
  status: PropTypes.oneOf(['sent', 'sending', 'failed']).isRequired
};

export default MessageStatus;
