import React from 'react';

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <h3>Online Users</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
