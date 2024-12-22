import React from 'react';

const Notifications = ({ notifications }) => {
  return (
    <div className="notifications">
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
