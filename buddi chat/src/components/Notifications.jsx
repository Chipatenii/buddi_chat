import PropTypes from 'prop-types';

const Notifications = ({ notifications }) => {
  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white shadow">
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      {notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map((notification, index) => (
            <li key={index} className="text-gray-700">{notification}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No new notifications.</p>
      )}
    </div>
  );
};

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Notifications;
