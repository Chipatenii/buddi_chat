import PropTypes from 'prop-types';

const Notifications = ({ notifications }) => {
  return (
    <div className="p-4 border border-secondary rounded bg-white shadow-sm">
      <h2 className="h5 fw-bold mb-2">Notifications</h2>
      {notifications.length > 0 ? (
        <ul className="list-unstyled">
          {notifications.map((notification, index) => (
            <li key={index} className="text-dark">{notification}</li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No new notifications.</p>
      )}
    </div>
  );
};

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Notifications;
